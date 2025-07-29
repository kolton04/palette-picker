const palette = document.getElementById("palette");
const patterns = ['analogous', 'complementary'];
let userSwatches = parseInt(localStorage.getItem('swatch-count'));
if (isNaN(userSwatches) || userSwatches < 2){
    userSwatches = 2;
}
let swatchCount = userSwatches;
let patternIndex = 0;
let currentPattern = document.getElementById("current-pattern");
let swatches = [];
let emptySwatches = [];
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

    
    let remaining = 8 - swatches.length;
    for(let i = 0; i < remaining; i++){
        let emptySwatch = {};
        emptySwatch.div = document.createElement("div");
        emptySwatch.div.classList.add("empty-swatch");
        let addBtn = document.createElement("button");
        addBtn.innerHTML = "+";
        addBtn.addEventListener("click", function (){
            swatchCount++;
            generatePattern(currentPattern.innerHTML);
            localStorage.setItem('swatch-count', swatches.length);


        });
        emptySwatch.div.appendChild(addBtn);
        palette.appendChild(emptySwatch.div);
        emptySwatches = document.querySelectorAll(".empty-swatch");
    }
}




function analogous(){
    let h = Math.floor(Math.random() * 361);
    let s = Math.random() * (0.75 - 0.2) + 0.2;
    let l = Math.random() * (0.7 - 0.1) + 0.1;
    let hueStep;
    let updateHue;
    switch(swatchCount){
        case 2:
        case 3:
            hueStep = 35;
            break;
        case 4:
            hueStep = 23;
            break;
        case 5:
        case 6:
        case 7:
        case 8:
            hueStep = 15;
            break;
    }
    

    switch(swatches.length){
        case 0:
            for(let i = 0; i < swatchCount; i++){
                updateHue = (h + i * hueStep) % 360;
                swatches.push(new Swatch(updateHue, s, l));
                console.log(swatches.length);
            }
            break;
        case 1:
        case 2:
        case 3:
            updateHue = (h + hueStep) % 360;
            swatches.push(new Swatch(updateHue, s, l));
            break;
        case 4:
            const randomIndex = Math.floor(Math.random() * swatches.length);
            const randomSwatch = swatches[randomIndex];
            let newS = Math.random() * (0.8 - 0.2) + 0.2;
            let newL = Math.random() * (0.7 - 0.1) + 0.1;

            swatches.push(new Swatch(randomSwatch.hue, newS, newL));
            break;


        case 5:
        case 6:
        case 7:
        case 8:
            s = (swatches[swatches.length - 1].sat);
            l = (swatches[swatches.length - 1].light);

            if(Math.floor(Math.random() * 2) === 0){
                h = (swatches[1].hue) % 360;
                hueStep = (Math.floor(Math.random() * hueStep + 10) + (-hueStep));

            }
            else if(Math.floor(Math.random() * 2) === 1){
                h = (swatches[swatches.length - 1].hue) % 360;
                hueStep = (Math.floor(Math.random() * hueStep + 10) + hueStep);


            }
        
            updateHue = (h + hueStep) % 360;
            swatches.push(new Swatch(updateHue, s, l));
            break;
            
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
    localStorage.setItem('swatch-count', swatches.length);
}

generatePattern(currentPattern.innerHTML);
