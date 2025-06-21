const analogousSwatches = document.getElementById('analogous-swatches');
const analogousBtn = document.getElementById('analogous-button');

const complementarySwatches = document.getElementById('complementary-swatches');
const complementaryBtn = document.getElementById('complementary-button');


function addSwatch(color = '#3498db', paletteContainer){
    const swatch = document.createElement('div');
    swatch.classList.add('swatch');
    swatch.style.backgroundColor = color
    swatch.style.color = chroma(color).luminance() > 0.5 ? '#000' : '#fff';
    paletteContainer.appendChild(swatch);
}


function analogousPalette(count = 5){
    analogousSwatches.innerHTML = '';

    const startingHue = Math.floor(Math.random() * 360);
    const sat = Math.random() * 0.3 + 0.4; 

    for(let i = 0; i < count; i++){
        const nextHue = (startingHue + (i * 25)) % 360;
        const color = chroma.hsl(nextHue, sat, (Math.random() * 0.3 + 0.4)).hex();
        addSwatch(color, analogousSwatches);
    }
}


function complementaryPalette(count = 5){
    complementarySwatches.innerHTML = ''

    const base = Math.floor(Math.random() * 360);
    const comp = (base + 180) % 360;

    const baseCount = Math.floor(count / 2);
    const compCount = count - baseCount;

    const sat = Math.random() * 0.3 + 0.5;
    const light = Math.random() * 0.2 + 0.4;

    for(let i = 0; i < baseCount; i++){
        const color = chroma.hsl(base, sat, light).hex();
        addSwatch(color, complementarySwatches);
    }

    for(let i = 0; i < compCount; i++){
        const color = chroma.hsl(comp, sat, light).hex();
        addSwatch(color, complementarySwatches);
    }
}



analogousBtn.addEventListener('click', () => analogousPalette())
analogousPalette();

complementaryBtn.addEventListener('click', () => complementaryPalette())
complementaryPalette();
