const palette = document.getElementById("palette");
let swatchCount = 5;
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
        this.swatch = {};
        this.hue = hue;
        this.sat = sat;
        this.light = light;
        this.hex = chroma.hsl(hue, sat, light).hex();
        this.locked = false;
        this.swatch.div = document.createElement("div");
        this.swatch.div.classList.add("swatch");
        this.swatch.div.style.backgroundColor = this.hex;
        palette.appendChild(this.swatch.div);
    }
    
}



function analogous(){
    let h = Math.floor(Math.random() * 361);
    let s = Math.random() * (0.6 - 0.4) + 0.4;
    let l = Math.random() * (0.7 - 0.3) + 0.3;

    for(let i = 0; i < swatchCount; i++){
        const updateHue = (h + i * 15) % 360;
        new Swatch(updateHue, s, l, false);
        
    }
    swatchCount = palette.childElementCount;
}

function generatePattern(pattern){
    switch(pattern){
        case 'analogous':
            analogous();
        case 'complementary':
            //complementary();
    }
    swatchCount = palette.childElementCount;

    
}
generatePattern(currentPattern.innerHTML);
emptySwatch = {};
emptySwatch.div = document.createElement("div");
emptySwatch.div.classList.add("empty-swatch");
addBtn = document.createElement("button");
addBtn.innerHTML = '+';
addBtn.addEventListener("click", function() {

});
    for(let i = swatchCount; i < 8; i++){
    emptySwatch.div.append(addBtn);
    }