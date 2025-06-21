const patterns = ['analogous', 'complementary', 'triadic', 'monochromatic']; 
let currentIndex = 0;
const swatchContainer = document.getElementById('swatches');
const label = document.getElementById('current-pattern-label');
const prevBtn = document.getElementById('prev-pattern');
const nextBtn = document.getElementById('next-pattern');


const swatchCounts = {
        'analogous' : 5,
        'complementary' : 5,
    };


function generatePalette(pattern, count = swatchCounts[pattern]) {
  swatchCounts[pattern] = count;
  swatchContainer.innerHTML = '';

  if (pattern === 'analogous') {
    const hue = Math.floor(Math.random() * 360);
    const sat = Math.random() * 0.3 + 0.4;

    for (let i = 0; i < count; i++) {
      const h = (hue + i * 25) % 360;
      const l = Math.random() * 0.3 + 0.4;
      const color = chroma.hsl(h, sat, l).hex();
      addSwatch(color, swatchContainer, pattern);
    }
    
  }

  else if (pattern === 'complementary') {
    const hue = Math.floor(Math.random() * 360);
    const comp = (hue + 180) % 360;
    const sat = Math.random() * 0.3 + 0.5;
    const light = Math.random() * 0.2 + 0.4;

    const baseCount = Math.floor(count / 2);
    const compCount = count - baseCount;

    for (let i = 0; i < baseCount; i++) {
      const color = chroma.hsl(hue, sat, light).hex();
      addSwatch(color, swatchContainer, pattern);
    }
    for (let i = 0; i < compCount; i++) {
      const color = chroma.hsl(comp, sat, light).hex();
      addSwatch(color, swatchContainer, pattern);
    }
  }
  fillEmptySwatches(swatchContainer, count, pattern)
}


function addSwatch(color = '#3498db', swatchContainer, pattern){
    const swatch = document.createElement('div');
    swatch.classList.add('swatch');
    swatch.style.backgroundColor = color
    swatch.style.color = chroma(color).luminance() > 0.5 ? '#000' : '#fff';


    const removeBtn = document.createElement('button');
    const removeColor = chroma(color).darken(1).hex();
    removeBtn.textContent = '−';
    removeBtn.style.backgroundColor = removeColor;
    removeBtn.classList.add('remove-button');
    removeBtn.addEventListener('click', (e) => {
        swatchCounts[pattern]--;
        generatePalette(pattern, swatchCounts[pattern]);
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
    swatchContainer.appendChild(swatch);

}

function fillEmptySwatches(container, count, pattern) {
  const remaining = 8 - count;

  for (let i = 0; i < remaining; i++) {
    const emptySwatch = document.createElement('div');
    emptySwatch.classList.add('swatch', 'emptySwatch');
    emptySwatch.textContent = '+';
    emptySwatch.addEventListener('click', () => {
        if(swatchCounts[pattern] < 8){
            swatchCounts[pattern]++;
            generatePalette(pattern, swatchCounts[pattern]);
        }
        
    
    });
    container.appendChild(emptySwatch);
  }
}



function updatePattern(direction) {
  currentIndex = (currentIndex + direction + patterns.length) % patterns.length;
  const currentPattern = patterns[currentIndex];
  label.textContent = capitalize(currentPattern) + ' Pattern';
  generatePalette(currentPattern);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

prevBtn.addEventListener('click', () => updatePattern(-1));
nextBtn.addEventListener('click', () => updatePattern(1));

updatePattern(0);