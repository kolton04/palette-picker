

function analogous() {
    function findHueArc(hues) {
        let sorted = [...hues].sort((a, b) => a - b);
        let largestGap = -1;
        let gapIndex = 0;

        // Check gaps between hues. Finds the largest and saves the index
        for (let i = 0; i < sorted.length; i++) {
            let next = sorted[(i + 1) % sorted.length];
            let diff = (next - sorted[i] + 360) % 360;
            if (diff > largestGap) {
                largestGap = diff;
                gapIndex = i;
            }
        }
        // The range of hues is the opposite of the largest gap in the hues around a circle
        // So hue range is from the end of the largest gap to its start
        let startHue = sorted[(gapIndex + 1) % sorted.length];
        let endHue = sorted[gapIndex];
        // When hue wraps around circle this ensures no negatives
        if (endHue < startHue) {
            endHue += 360;
        }
        return { startHue, endHue, arcLength: endHue - startHue };
    }

    function vary(value, range = 0.1) {
        // adds a random variation up to ±range, clamped between 0 and 1
        let v = value + (Math.random() * 2 - 1) * range;
        return Math.min(1, Math.max(0, v));
    }

    let updateHue;
    let l;
    let s;
    switch(swatches.length){
        case 0:
            const defaultSwatchAmt = 3;
            let h = Math.floor(Math.random() * 360); // Random hue from 0-360
            s = Math.random() * (0.65 - 0.2) + 0.2; // Random saturation from 0.2-0.65
            l = Math.random() * (0.6 - 0.2) + 0.2; // Random light from 0.2-0.6
            for(let i = 0; i < defaultSwatchAmt; i++){
                // Adds base hue + index * 35 degrees
                swatches.push(new Swatch(((h + i * 35) % 360), s, l));
            }
            break;
        case 1:
        case 2:
            // Changes the default saturation and light values by 8% with helper function
            s = vary(swatches[0].sat, 0.08);
            l = vary(swatches[0].light, 0.08);
            minHue = swatches[0].hue;
            maxHue = swatches[swatches.length - 1].hue;

            if(Math.random() < 0.5){
                minHue -= 35;
                swatches.push(new Swatch(minHue, s, l));
            }
            else{
                maxHue += 35;
                swatches.push(new Swatch(maxHue, s, l));
            }
            break;
        default: {
            let hues = swatches.map(sw => sw.hue);
            s = vary(swatches[0].sat, 0.08);
            l = vary(swatches[0].light, 0.08);

            const {startHue, endHue, arcLength} = findHueArc(hues);
            
            if (arcLength < 70) {
                if (Math.random() < 0.5) {
                    updateHue = (endHue + 35) % 360;
                } else {
                    updateHue = (startHue - 35 + 360) % 360;
                }
            } else {
                updateHue = Math.round((Math.random() * (endHue - startHue) + startHue) % 360);
            }
            
            swatches.push(new Swatch(updateHue, s, l));
            console.log(swatches)
            break;
        }    
    }
}





function complementary() {
    let s = Math.random() * (0.65 - 0.2) + 0.2;
    let l = Math.random() * (0.6 - 0.2) + 0.2;

    let hues = swatches.map(sw => sw.hue);
    let baseHue = hues[0];
    let complement = (baseHue + 180) % 360;

    if(swatches.length === 0){
        let h = Math.floor(Math.random() * 360);
        swatches.push(new Swatch(h, s, l));
        swatches.push(new Swatch((h + 180) % 360, s, l));
    }
    else if(swatches.length === 1){
        swatches.push(new Swatch(complement, s, l));
    }
    else{
        let hasBase = hues.includes(baseHue)
        let hasComplement = hues.includes(complement)

        if(!hasComplement) {
            swatches.push(new Swatch(complement, s, l));
        } 
        else if(!hasBase) {
            swatches.push(new Swatch(baseHue, s, l));
        }
        else{
            if(Math.random() < 0.5){
                swatches.push(new Swatch(baseHue, s, l));
            }
            else{
                swatches.push(new Swatch(complement, s, l));
            }
        }
    }
}





function monochromatic() {
    let s = Math.random() * (0.75 - 0.2) + 0.2;
    let l = Math.random() * (0.7 - 0.2) + 0.2;

    if(swatches.length === 0){
        let h = Math.floor(Math.random() * 360);
        swatches.push(new Swatch(h, s, l));
        
    }
    else{
        swatches.push(new Swatch(swatches[0].hue, s, l));
    }
}




function splitComp() {
    let s = Math.random() * (0.75 - 0.2) + 0.2;
    let l = Math.random() * (0.7 - 0.2) + 0.2;
    //Step for going 20 degrees + or - initial hues complement so initial swatches are 
    // 1 [initial hue]
    // 2 [intial hue + (180 + offset)] 
    // 3 [intial hue + (180 - offset)]
    const hueOffset = 30;
    let hues = swatches.map(sw => sw.hue);


    switch(swatches.length){
        case 0:

            let h = Math.floor(Math.random() * 360);
            for(let i = 0; i < 3; i++){                
                if(i < 2){
                    updateHue = (h + (i * (180 + hueOffset))) % 360;
                }
                else{
                    updateHue = (h + (180 - hueOffset)) % 360;
                }
                swatches.push(new Swatch(updateHue, s, l));
            }
            break;
        // 33/33/33 to make next hue +200 OR +180 OR hue +0.
        case 1:
            if(Math.random() < 0.5){
                updateHue = ((swatches[0].hue + 180) + hueOffset) % 360;
                added = true;
            }
            else{
                updateHue = ((swatches[0].hue + 180) - hueOffset) % 360;
            }
            swatches.push(new Swatch(updateHue, s, l));
            break;
        case 2:
            hues = [];
            for(let i = 0; i < swatches.length; i++){
                hues.push(swatches[i].hue);
            }

            updateHue = ((swatches[0].hue + 180) - hueOffset) % 360;
            const duplicateHue = hues.includes(updateHue);

            if(duplicateHue){
                updateHue = ((swatches[0].hue + 180) + hueOffset) % 360;
            }
            swatches.push(new Swatch(updateHue, s, l));
            console.log(swatches)
            break;
        default: {
            let uniqueHues = new Set(hues);
            if(uniqueHues.size === 3){
                const randomSwatch = swatches[Math.floor(Math.random() * 3)];
                swatches.push(new Swatch(randomSwatch.hue, s, l));
            }
            else {
                const baseHue = hues[0];
                const firstComp = (baseHue + 180 + hueOffset) % 360;
                const secondComp = (baseHue + 180 - hueOffset) % 360;

                if(!hues.includes(firstComp)){
                    swatches.push(new Swatch(firstComp, s, l));         
                }
                else{
                    swatches.push(new Swatch(secondComp, s, l)); 
                }
            }
            break;    
        }   
    }
}