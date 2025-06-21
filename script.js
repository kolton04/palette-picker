const analogousSwatches = document.getElementById('analogous');
const complementarySwatches = document.getElementById('complementary');

const swatchCounts = {
        'analogous' : 2,
        'complementary' : 2,
    };


function addSwatch(color = '#3498db', paletteContainer){
    const swatch = document.createElement('div');
    const container = document.getElementById(paletteContainer.id);
    
    swatch.classList.add('swatch');
    swatch.style.backgroundColor = color
    swatch.style.color = chroma(color).luminance() > 0.5 ? '#000' : '#fff';


    const removeBtn = document.createElement('button');
    const removeColor = chroma(color).darken(1).hex();
    removeBtn.textContent = '−';
    removeBtn.style.backgroundColor = removeColor;
    removeBtn.classList.add('remove-button');
    removeBtn.addEventListener('click', (e) => {
        const id = container.id;
        if(swatchCounts[id] > 2){
            swatch.remove();
            swatchCounts[id] = Math.max(0, swatchCounts[id] - 1);

            if (id === 'analogous') {
                analogousPalette(swatchCounts[id]);
            } 
            else if (id === 'complementary') {
                complementaryPalette(swatchCounts[id]);
            }
        }
    });

    const hexLabel = document.createElement('span');
    const labelColor = chroma(color).darken(2).hex();
    hexLabel.classList.add('hex-label');
    hexLabel.style.color = labelColor;
    hexLabel.textContent = color.toUpperCase();

    hexLabel.addEventListener('click', () => {
        navigator.clipboard.writeText(color);
        hexLabel.textContent = 'Copied!';
        setTimeout(() => hexLabel.textContent = color, 1000);
    });

    swatch.appendChild(removeBtn);
    swatch.appendChild(hexLabel);
    paletteContainer.appendChild(swatch);

}

function fillEmptySwatches(container, count) {
  const remaining = 8 - count;

  for (let i = 0; i < remaining; i++) {
    const emptySwatch = document.createElement('div');
    emptySwatch.classList.add('swatch', 'emptySwatch');
    emptySwatch.textContent = '+';
    emptySwatch.addEventListener('click', () => {
        const id = container.id;

        if(swatchCounts[id] < 8){
            swatchCounts[id]++;
            if(id === 'analogous'){
                analogousPalette(swatchCounts[id]);
            }
            else if (id === 'complementary') {
                complementaryPalette(swatchCounts[id]);
            }
        }
        
    
    });
    container.appendChild(emptySwatch);
  }
}





function analogousPalette(count = swatchCounts['analogous']){
    swatchCounts['analogous'] = count;
    analogousSwatches.innerHTML = '';

    const startingHue = Math.floor(Math.random() * 360);
    const sat = Math.random() * 0.3 + 0.4; 

    for(let i = 0; i < count; i++){
        const nextHue = (startingHue + (i * 25)) % 360;
        const color = chroma.hsl(nextHue, sat, (Math.random() * 0.3 + 0.4)).hex();
        addSwatch(color, analogousSwatches);
    }
    fillEmptySwatches(analogousSwatches, count);
}





function complementaryPalette(count = swatchCounts['complementary']){
    swatchCounts['complementary'] = count;
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
    fillEmptySwatches(complementarySwatches, count);
}

analogousPalette();
complementaryPalette();
