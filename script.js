const palette = document.getElementById("palette");
const patterns = ['analogous', 'complementary'];
let userSwatches = localStorage.getItem('swatch-count');
let swatchCount = userSwatches ?? 5;
let patternIndex = 0;
let currentPattern = document.getElementById("current-pattern");
let swatches = [];
let emptySwatches = document.querySelectorAll(".empty-swatch");
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
        this.swatch = {};
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
            if(swatches.length > 2){
                this.div.remove();
                for(let i = 0; i < swatches.length; i++){
                    if(this.hue == swatches[i].hue){
                        swatches.splice(i, 1);
                    }
                }
                addEmptySwatches();
                localStorage.setItem('swatch-count', swatches.length);

            }
        });
        this.div.appendChild(this.removeBtn);
        palette.appendChild(this.div);
    }

    
}

function addEmptySwatches() {
    // Clears previous empty swatches so it doesn't overfill
    while(emptySwatches.length > 0){
        for(let i = 0; i < emptySwatches.length; i++){
            emptySwatches[i].div.remove();
        }
        emptySwatches = [];
    }


    let remaining = 8 - swatches.length;
    for(let i = 0; i < remaining; i++){
        let emptySwatch = {};
        emptySwatch.div = document.createElement("div");
        emptySwatch.div.classList.add("empty-swatch");
        let addBtn = document.createElement("button");
        addBtn.innerHTML = "+";
        addBtn.addEventListener("click", function (){
            addSwatch(currentPattern.innerHTML);
            addEmptySwatches();
            localStorage.setItem('swatch-count', swatches.length);

        });
        emptySwatch.div.appendChild(addBtn);
        palette.appendChild(emptySwatch.div);
        emptySwatches[i] = emptySwatch;
    }
}

function addSwatch(pattern){
    switch(pattern){
        case 'analogous':
            let hueStep = Math.floor(Math.random() * 15) + 10;
            if(swatches.length < 9){
                let h = (swatches[swatches.length - 1].hue + 15 )% 360;
                let s = swatches[0].sat;
                let l = swatches[0].light;
                swatches[swatches.length] = new Swatch(h, s, l);
            }
            else if(swatches.length < 6){
                console.log("test");
            }
            break;
        case 'complementary':

            break;
    }
    
}




function analogous(){
    let h = Math.floor(Math.random() * 361);
    let s = Math.random() * (0.6 - 0.4) + 0.4;
    let l = Math.random() * (0.7 - 0.3) + 0.3;
    for(let i = 0; i < swatchCount; i++){
        const updateHue = (h + i * 15) % 360;
        swatches[i] = new Swatch(updateHue, s, l);
    }
}

function generatePattern(pattern){
    palette.innerHTML = "";
    swatches = [];
    emptySwatches = [];
    switch(pattern){
        case 'analogous':
            analogous();
        case 'complementary':
            //complementary();
    }
    addEmptySwatches();
    localStorage.setItem('swatch-count', swatches.length);
}

generatePattern(currentPattern.innerHTML);
