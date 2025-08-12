function analogous() {
    let updateHue;
    let minHue;
    let maxHue;

    switch(swatches.length){
        case 0:
            let h = Math.floor(Math.random() * 360);
            let s = Math.random() * (0.65 - 0.2) + 0.2;
            let l = Math.random() * (0.6 - 0.2) + 0.2;
            for(let i = 0; i < 3; i++){
                updateHue = (h + i * 35) % 360;
                swatches.push(new Swatch(updateHue, s, l));
            }
            break;
        case 1:
        case 2:
            minHue = swatches[0].hue;
            maxHue = swatches[swatches.length - 1].hue;

            if(Math.random() < 0.5){
                minHue -= 35;
                swatches.push(new Swatch(minHue,
                    swatches[swatches.length - 1].sat,
                    swatches[swatches.length - 1].light));
            }
            else{
                maxHue += 35;
                swatches.push(new Swatch(maxHue,
                    swatches[swatches.length - 1].sat,
                    swatches[swatches.length - 1].light));
            }
            break;
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
            const randomIndex = Math.floor(Math.random() * swatches.length);
            const randomSwatch = swatches[randomIndex];

            let hues = new Set();
            for(let i = 0; i < swatches.length; i++){
                hues.add(swatches[i].hue);
            }

            minHue = Math.min(...hues);
            maxHue = Math.max(...hues);
            
            console.log(hues.size);
            if(hues.size <= 2){
                updateHue = (randomSwatch.hue - 35);
                if(hues.has(updateHue)){
                    updateHue = (randomSwatch.hue + 35);
                }
            }
            else{
                //wraps numbers around 360 if minHue is close to 360
                if(minHue <= maxHue){
                    updateHue = Math.round((Math.random() * (maxHue - minHue) + minHue) % 360);
                }
                else{
                    updateHue = (minHue + (Math.floor(Math.random() * 70))) % 360;
                }

            }
            console.log(swatches);
            console.log(updateHue)

            swatches.push(new Swatch(updateHue, 
                Math.random() * ((randomSwatch.sat + 0.1) - (randomSwatch.sat - 0.1)) + (randomSwatch.sat - 0.1),
                Math.random() * ((randomSwatch.light + 0.1) - (randomSwatch.light - 0.1)) + (randomSwatch.light - 0.1)
            ))
            break;    
    }
}





function complementary() {
    let updateHue;
    let s = Math.random() * (0.65 - 0.2) + 0.2;
    let l = Math.random() * (0.6 - 0.2) + 0.2;

    if(swatches.length === 0){
        let h = Math.floor(Math.random() * 360);
        for(let i = 0; i < 2; i++){
            updateHue = (h + i * 180) % 360;
        }
    }
    else if(swatches.length === 1){
        updateHue = (swatches[0].hue + 180) % 360;
    }
    else{
        if(Math.random() < 0.5){
            updateHue = swatches[0].hue;
        }
        else{
            updateHue = swatches[1].hue;
        }
    }
    swatches.push(new Swatch(updateHue, s, l));

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
    let hues = [];

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
                console.log(swatches[i].hue)

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
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
            const randomIndex = Math.floor(Math.random() * 3);
            const randomSwatch = swatches[randomIndex];
            hues = [];
            for(let i = 0; i < 3; i++){
                hues.push(swatches[i].hue);
            }

            console.log(hues);

            let checkUnique = new Set(hues);

            if(checkUnique.size === 3){
                swatches.push(new Swatch(randomSwatch.hue, 
                Math.random() * ((randomSwatch.sat + 0.1) - (randomSwatch.sat - 0.1)) + (randomSwatch.sat - 0.1),
                Math.random() * ((randomSwatch.light + 0.1) - (randomSwatch.light - 0.1)) + (randomSwatch.light - 0.1)
            ))
            }
            else {

            }
            break;    
    }
}