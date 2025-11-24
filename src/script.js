const palette = document.getElementById("palette");
const patterns = ['Analogous', 'Complementary', 'Monochromatic', 'Split-comp', 'Triadic', 'Tetradic'];
const savePalette = document.getElementById("saveBtn");
const paletteSelect = document.getElementById("paletteSelect");
let swatches = [];
let patternIndex = 0;
let currentPattern = document.getElementById("current-pattern");
let pattern = document.getElementById("pattern");
currentPattern.innerHTML = patterns[patternIndex];
pattern.innerHTML = patterns[patternIndex];
populateSavedPalettes();

savePalette.addEventListener("click", function () {
    let paletteSave = {
        pattern: currentPattern.innerHTML,
        colors: swatches
    };
    let saveSwatches = JSON.stringify(paletteSave);
    let paletteName = prompt("Please enter palette name");
    if(paletteName == null || paletteName == ""){
        alert("Palette must have a name");
    }
    else if(localStorage.getItem("palette_" + paletteName)){
         alert("Palette name already in use");
    }
    else{
        let opt = document.createElement("option")
        opt.innerHTML = paletteName
        opt.value = "palette_" + paletteName;
        localStorage.setItem("palette_" + paletteName, saveSwatches);
        paletteSelect.add(opt);
    }
})

paletteSelect.addEventListener("change", function () {
    let selectedPalette = this.value;

    if(!selectedPalette || selectedPalette === ""){
        return;
    }
    let savedPalette = localStorage.getItem(selectedPalette);
    let loadedPalette = JSON.parse(savedPalette);

    currentPattern.innerHTML = loadedPalette.pattern;
    pattern.innerHTML = loadedPalette.pattern;
    palette.innerHTML = "";
    swatches = [];

    palette.innerHTML = "";
    swatches = [];

    for(const swatch of Object.keys(loadedPalette)){
        swatches.push(new Swatch(swatch.hue, swatch.sat, swatch.light))
    }

})

// Pattern switcher carousel logic
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
    currentPattern.innerHTML = patterns[patternIndex];
    pattern.innerHTML = currentPattern.textContent;
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
    currentPattern.innerHTML = patterns[patternIndex];
    pattern.innerHTML = currentPattern.textContent;
    localStorage.setItem("pattern", currentPattern.innerHTML);
    generatePattern(currentPattern.innerHTML);
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
        this.hexLabel = document.createElement("p");
        let upperHex = this.hex.toUpperCase();
        this.hexLabel.innerHTML = upperHex;
        this.hexLabel.style.color = chroma.hsl(hue, sat, light - 0.3);
        this.hexLabel.id = "hex-label";
        this.div.appendChild(this.hexLabel);
        palette.appendChild(this.div);
    }
}

function generatePattern(pattern){
    swatches = [];
    palette.innerHTML = ''
    switch(pattern){
        case 'Analogous':
            analogous();
            break;
        case 'Complementary':
            complementary();
            break;
        case 'Monochromatic':
            monochromatic();
            break;
        case 'Split-comp':
            splitComp();
            break;
        case 'Triadic':
            triadic();
            break;
        case 'Tetradic':
            tetradic();
            break;
    }
}



function populateSavedPalettes(){
    const keys = Object.keys(localStorage);
    for(let i = 0; i < keys.length; i++){
        const key = keys[i];
        if(key.startsWith("palette_")){
            const userPalette = key.replace("palette_", "");
            let opt = document.createElement("option");
            opt.innerHTML = userPalette;
            opt.value = key;
            paletteSelect.add(opt);
        }
    }
}
console.log(Object.keys.length);

function openNav() {
  document.getElementById("mySidepanel").style.width = "22vw";
}

/* Set the width of the sidebar to 0 (hide it) */
function closeNav() {
  document.getElementById("mySidepanel").style.width = "0";
}

generatePattern(currentPattern.innerHTML || patterns[patternIndex]);