const palette = document.getElementById("palette");
let swatches = [];
let emptySwatches = [];

const patterns = ['analogous', 'complementary', 'monochromatic', 'split-complementary'];
let patternIndex = 0;
let currentPattern = document.getElementById("current-pattern");

const savedPattern = localStorage.getItem("pattern");
if(savedPattern && patterns.includes(savedPattern)){
    currentPattern.innerHTML = savedPattern;
    patternIndex = patterns.indexOf(savedPattern);
}
else {
    currentPattern.innerHTML = patterns[0];
    localStorage.setItem("pattern", patterns[0]);
}

const leftBtn = document.getElementById("left");
leftBtn.addEventListener("click", function (){
    if(patternIndex == 0){
        patternIndex = patterns.length - 1;
    }
    else{
        patternIndex -= 1;
    }
    palette.innerHTML = "";
    swatches = [];
    emptySwatches = [];
    currentPattern.innerHTML = patterns[patternIndex];
    localStorage.setItem("pattern", currentPattern.innerHTML);
    generatePattern(currentPattern.innerHTML);

});

const rightBtn = document.getElementById("right");
rightBtn.addEventListener("click", function (){
    if(patternIndex >= patterns.length - 1){
        patternIndex = 0;
    }
    else{
        patternIndex += 1;
    }
    palette.innerHTML = "";
    swatches = [];
    emptySwatches = [];
    currentPattern.innerHTML = patterns[patternIndex];
    localStorage.setItem("pattern", currentPattern.innerHTML);
    generatePattern(currentPattern.innerHTML);
});

const regenPatternBtn = document.getElementById("current-pattern");
regenPatternBtn.addEventListener("click", () => {
    location.reload();
})


class Swatch {
    constructor(hue, sat, light){
        this.hue = hue;
        this.sat = sat;
        this.light = light;
        this.hex = chroma.hsl(hue, sat, light).hex();
        this.locked = false;
        this.div = document.createElement("div");
        this.div.classList.add("swatch");
        this.div.style.backgroundColor = this.hex;
        this.removeBtn = document.createElement("button");
        this.removeBtn.textContent = "-";
        this.removeBtn.addEventListener("click", () => {
        
            this.div.remove();
            for(let i = 0; i < swatches.length; i++){
                if(swatches[i].hex == this.hex){
                    swatches.splice(i, 1);
                }
            }
            addEmptySwatches();
            
        });
        this.hexLabel = document.createElement("p");
        let upperHex = this.hex.toUpperCase();
        this.hexLabel.innerHTML = upperHex;
        this.hexLabel.style.color = chroma.hsl(hue, sat, light - 0.3);
        this.removeBtn.id = "remove-btn";
        this.hexLabel.id = "hex-label";
        this.div.appendChild(this.removeBtn);
        this.div.appendChild(this.hexLabel);
        palette.appendChild(this.div);
    }

    
}

function addEmptySwatches() {
    // Clears previous empty swatches so it doesn't overfill
    while(emptySwatches.length > 0){
        for(let i = 0; i < emptySwatches.length; i++){
            emptySwatches[i].remove();
        }
        emptySwatches = [];
    }

    
    let remaining = 12 - swatches.length;
    for(let i = 0; i < remaining; i++){
        let emptySwatch = {};
        emptySwatch.div = document.createElement("div");
        emptySwatch.div.classList.add("empty-swatch");
        let addBtn = document.createElement("button");
        addBtn.innerHTML = "+";
        addBtn.addEventListener("click", function (){
            generatePattern(currentPattern.innerHTML);
            

        });
        addBtn.id = "add-btn";
        emptySwatch.div.appendChild(addBtn);
        palette.appendChild(emptySwatch.div);
        emptySwatches = document.querySelectorAll(".empty-swatch");
    }
}

function hueScale(){
    let hueScale = document.getElementById("hue-scale");

    for(let i = 0; i < 361; i++){
        const color = chroma.hsl(i, 1, 0.5);
        const colorDiv = document.createElement('div');
        colorDiv.style.backgroundColor = color.hex();
        colorDiv.style.width = '1px';
        colorDiv.style.height = '25px';
        hueScale.appendChild(colorDiv);
        for(let k = 0; k < swatches.length; k++){
            if(swatches[k].hue === i){
                console.log("hi")

                const hueMarker = document.createElement('div');
                hueMarker.style.backgroundColor = 'black';
                hueMarker.style.width = '3px';
                hueMarker.style.height = '50px';
                hueScale.appendChild(hueMarker);
            }
        }
    }
    
        

    
}

function generatePattern(pattern){
    
    switch(pattern){
        case 'analogous':
            analogous();
            break;
        case 'complementary':
            complementary();
            break;
        case 'monochromatic':
            monochromatic();
            break;
        case 'split-complementary':
            splitComp();
            break;
    }
    addEmptySwatches();
    
}

generatePattern(currentPattern.innerHTML);
hueScale();
