const palette = document.getElementById("palette");
const patterns = ['analogous', 'complementary'];
let swatchCount = 5 || palette.querySelectorAll('swatches');
let patternIndex = 0;
let currentPattern = document.getElementById("current-pattern");
let swatches = [];
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
            this.div.remove();
        });
        this.div.appendChild(this.removeBtn);
        palette.appendChild(this.div);
    }

    addSwatch() {
        for(let i = 0; i < swatches.length; i++){
            console.log(swatches[i].hue);
        }
    }
}

function emptySwatches(swatchNum) {
    let remaining = 8 - swatchNum;
    for(let i = 0; i < remaining; i++){
        let emptySwatch = {};
        emptySwatch.div = document.createElement("div");
        emptySwatch.div.classList.add("empty-swatch");
        let addBtn = document.createElement("button");
        addBtn.innerHTML = "+";
        addBtn.addEventListener("click", function (){
            swatchCount++;
            generatePattern(currentPattern.innerHTML);
        });
        emptySwatch.div.appendChild(addBtn);
        palette.appendChild(emptySwatch.div);
        swatches[swatches.length] = emptySwatch;
    }
}




function analogous(){
    let s = Math.random() * (0.6 - 0.4) + 0.4;
    let l = Math.random() * (0.7 - 0.3) + 0.3;
    if(swatches.length > 0){
        const newHue = swatches[swatches.length].hue + 15;
        swatches[swatches.length + 1] = new Swatch(newHue, s, l, false);
    }
    else {
        
        let h = Math.floor(Math.random() * 361);

        for(let i = 0; i < swatchCount; i++){
            const updateHue = (h + i * 15) % 360;
            swatches[i] = new Swatch(updateHue, s, l, false);
            console.log(swatches[i].hue);
        }
    }
}

function generatePattern(pattern){
    palette.innerHTML = "";
    swatches = [];
    switch(pattern){
        case 'analogous':
            analogous();
        case 'complementary':
            //complementary();
    }
    emptySwatches(swatchCount);
}
generatePattern(currentPattern.innerHTML);