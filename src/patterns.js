const defaultSwatchAmt = 6;
let h = Math.floor(Math.random() * 360); // Random hue from 0-360
let s = Math.random() * (0.77 - 0.3) + 0.3; // Random saturation from 0.2-0.65
let l = Math.random() * (0.7 - 0.3) + 0.3;

let hueSlider = document.getElementById("hueSlider");
let satSlider = document.getElementById("satSlider");
let lightSlider = document.getElementById("lightSlider");
let test = document.getElementById("test")
 test.innerHTML = hueSlider.value;

hueSlider.oninput = function() {
    h = Number(this.value);
    test.innerHTML = this.value;
    generatePattern(currentPattern.innerHTML);
}
satSlider.oninput = function() {
    s = Number(this.value) / 100;
    generatePattern(currentPattern.innerHTML);
}
lightSlider.oninput = function() {
    l = Number(this.value) / 100;
    generatePattern(currentPattern.innerHTML);
}

function analogous() {
    let hues = [];
    
    for(let i = 0; i < defaultSwatchAmt; i++){
        // Adds first three swatches in steps of 45 degrees (to span 90 degrees) from first random hue
        if(i < 3){
            swatches.push(new Swatch(((h + i * 45) % 360), s, l));
            hues.push(swatches[i].hue);
            console.log(hues)
        }
        else{
            varyL = [0.2, -0.2, 0.1];
            swatches.push(new Swatch((hues[(Math.floor(Math.random() * hues.length))]), s, l + varyL[i % 3]));
            console.log(swatches)
        }
    }
}

function complementary() {
    for(let i = 0; i < defaultSwatchAmt; i++){
        // Adds first random hue, then its complement 180 degrees around the color wheel
        if(i < 2){
            swatches.push(new Swatch(((h + i * 180) % 360), s, l));
        }
        else{
            varyL = [0.25, -0.1, 0.15, -0.18];
            swatches.push(new Swatch(swatches[Math.floor(Math.random() * 2)].hue, s, l + varyL[(i + 2) % 4]));
            console.log(swatches)
        }
    }
   
}


function monochromatic() {
    for(let i = 0; i < defaultSwatchAmt; i++){
        varyL = [0.2, 0.15, -0.05, -0.15, 0.27, -0.2];
        varyS = [0.3, -0.1, 0.2, -0.2, 0.15, -0.15];

        swatches.push(new Swatch(h, s + varyS[i], l + varyL[i]));
        console.log(swatches)
    }
}




function splitComp() {
    let varyL = [-0.15, 0.27, -0.2];

    for(let i = 0; i < defaultSwatchAmt; i++){
        if(i < 3){
            hues = [h, (h + 150) % 360, (h + 210) % 360];
            swatches.push(new Swatch(hues[i], s, l));
        }
        else{
            swatches.push(new Swatch(swatches[Math.floor(Math.random() * 3)].hue, s, l + varyL[(i - 3) % 3]));
        }
    }
}

function triadic() {
    let hues = [];
    for(let i = 0; i < defaultSwatchAmt; i++){
        // Adds first three swatches in steps of 45 degrees (to span 90 degrees) from first random hue
        if(i < 3){
            swatches.push(new Swatch(((h + i * 120) % 360), s, l));
            hues.push(swatches[i].hue);
            console.log(hues)
        }
        else{
            varyL = [0.2, -0.2, 0.1];
            swatches.push(new Swatch((hues[(Math.floor(Math.random() * hues.length))]), s, l + varyL[i % 3]));
            console.log(swatches)
        }
    }
}

function tetradic() {
    let hues = [];
    for(let i = 0; i < defaultSwatchAmt; i++){
        // Adds first three swatches in steps of 45 degrees (to span 90 degrees) from first random hue
        if(i < 4){
            swatches.push(new Swatch(((h + i * 90) % 360), s, l));
            hues.push(swatches[i].hue);
            console.log(hues)
        }
        else{
            varyL = [0.2, -0.2];
            swatches.push(new Swatch((hues[(Math.floor(Math.random() * hues.length))]), s, l + varyL[i % 2]));
            console.log(swatches)
        }
    }
}