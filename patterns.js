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
                console.log(swatches[i].hue)
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
        case 13:
        case 14:
        case 15:
        case 16:
            const randomIndex = Math.floor(Math.random() * swatches.length);
            const randomSwatch = swatches[randomIndex];
            let randomHue;

            minHue = swatches[0].hue;
            maxHue = swatches[2].hue;

            //wraps numbers around 360 if minHue is close to 360
            if(minHue <= maxHue){
                randomHue = Math.random() * (maxHue - minHue) + minHue;
            }
            else{
                let randomHueStep = Math.floor(Math.random() * 70)
                randomHue = (minHue + randomHueStep) % 360;
            }

            swatches.push(new Swatch(randomHue, 
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
            swatches.push(new Swatch(updateHue, s, l));
        }
    }
    else{
        if(Math.random() < 0.5){
            updateHue = swatches[0].hue;
        }
        else{
            updateHue = swatches[1].hue;
        }
        swatches.push(new Swatch(updateHue, s, l));
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