const palette = document.getElementById("palette");
let swatches = [];
let emptySwatches = [];

const patterns = ['analogous', 'complementary'];
let patternIndex = 0;
let currentPattern = document.getElementById("current-pattern");
currentPattern.innerHTML = patterns[patternIndex];

const leftBtn = document.getElementById("left");
leftBtn.addEventListener("click", function (){
    if(patternIndex == 0){
        patternIndex = patterns.length - 1;
    }
    else{
        patternIndex -= 1;
    }
    currentPattern.innerHTML = patterns[patternIndex];
});

const rightBtn = document.getElementById("right");
rightBtn.addEventListener("click", function (){
    if(patternIndex >= patterns.length - 1){
        patternIndex = 0;
    }
    else{
        patternIndex += 1;
    }
    currentPattern.innerHTML = patterns[patternIndex];
});




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

    
    let remaining = 16 - swatches.length;
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

function generatePattern(pattern){
    switch(pattern){
        case 'analogous':
            analogous();
            break;
        case 'complementary':
            //complementary();
    }
    addEmptySwatches();
}

generatePattern(currentPattern.innerHTML);

