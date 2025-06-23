const patterns = ['analogous', 'complementary', 'triadic', 'monochromatic', 'split-complementary', 'tetradic']; 
let currentIndex = 0;
const swatchContainer = document.getElementById('swatches');
const label = document.getElementById('current-pattern-label');
const prevBtn = document.getElementById('prev-pattern');
const nextBtn = document.getElementById('next-pattern');

const savedSwatchCount = JSON.parse(sessionStorage.getItem('swatchCounts'));
const swatchCounts = savedSwatchCount || {
        'analogous' : 4,
        'complementary' : 4,
        'triadic' : 4,
        'monochromatic' : 4,
        'split-complementary' : 4,
        'tetradic' : 4,
};

const minRequired = {
  'analogous': 1,
  'complementary': 2,
  'triadic': 3,
  'monochromatic': 1,
  'split-complementary': 3,
  'tetradic': 4,
};


function generatePalette(pattern, count = swatchCounts[pattern]) {
  swatchCounts[pattern] = count;
  swatchContainer.innerHTML = '';

  if (pattern === 'analogous') {
    const firstHue = Math.floor(Math.random() * 360);
    const s = Math.random() * 0.3 + 0.6;
    const l = Math.random() * 0.2 + 0.5;

    for (let i = 0; i < count; i++) {
      const nextHue = (firstHue + i * 15) % 360;
      const color = chroma.hsl(nextHue, s, l).hex();
      addSwatch(color, pattern);
    }
  }

  else if (pattern === 'complementary') {
    const firstHue = Math.floor(Math.random() * 360);
    const secondHue = (firstHue + 180) % 360;
    const s = Math.random() * 0.3 + 0.5;
    const l = Math.random() * 0.2 + 0.4;

    const colors = chroma.scale([chroma.hsl(firstHue, s, l), chroma.hsl(secondHue, s, l)]).mode('lch').colors(count);

    for(let i = 0; i < count; i++){
        addSwatch(colors[i], pattern);
      }
  }

  else if(pattern == 'triadic'){
    const baseHue = Math.floor(Math.random() * 360);
    const sBase = Math.random() * 0.3 + 0.5;
    const lBase = Math.random() * 0.2 + 0.5;

    const hues = [
      baseHue,
      (baseHue + 120) % 360,
      (baseHue + 240) % 360
    ];

    const baseCount = Math.floor(count / 3);
    const remVariants = count % 3;
    const hueCounts = [baseCount, baseCount, baseCount];
    for (let i = 0; i < remVariants; i++) {
      hueCounts[i]++;
    }

    for (let h = 0; h < hues.length; h++) {
      for (let i = 0; i < hueCounts[h]; i++) {
        const sat = sBase + (Math.random() * 0.6 - 0.3);  
        const light = lBase + (Math.random() * 0.6 - 0.3); 
        const color = chroma.hsl(hues[h], Math.min(Math.max(sat, 0), 1), Math.min(Math.max(light, 0), 1)).hex();
        addSwatch(color, pattern);
      }
    }
  }

  else if(pattern == 'monochromatic'){
    const baseHue = Math.floor(Math.random() * 360);
    const s = Math.random() * 0.3 + 0.3;

    for (let i = 0; i < count; i++) {
      const varLight = Math.random() * 0.5 + 0.3;
      const color = chroma.hsl(baseHue, s, varLight).hex();
      addSwatch(color, pattern);
    }
  }

  else if(pattern == 'split-complementary'){
    const baseHue = Math.floor(Math.random() * 360);
  
    const hues = [
      baseHue,
      (baseHue + 150) % 360,
      (baseHue + 210) % 360
    ];

    const baseCount = Math.floor(count / 3);
    const remVariants = count % 3;
    const hueCounts = [baseCount, baseCount, baseCount];
    for (let i = 0; i < remVariants; i++) {
      hueCounts[i]++;
    }

    for (let h = 0; h < hues.length; h++) {
      for (let i = 0; i < hueCounts[h]; i++) {
        const sat = Math.random() * 0.3 + 0.5;  
        const light = Math.random() * 0.2 + 0.4; 
        const color = chroma.hsl(hues[h], Math.min(Math.max(sat, 0), 1), Math.min(Math.max(light, 0), 1)).hex();
        addSwatch(color, pattern);
      }
    }
  }

  else if(pattern == 'tetradic'){
    const baseHue = Math.floor(Math.random() * 360);
  
    const hues = [
      baseHue,
      (baseHue + 90) % 360,
      (baseHue + 180) % 360,
      (baseHue + 270) % 360
    ];

    

    const baseCount = Math.floor(count / 4);
    const remVariants = count % 4;
    const hueCounts = [baseCount, baseCount, baseCount, baseCount];
    for (let i = 0; i < remVariants; i++) {
      hueCounts[i]++;
    }

    for (let h = 0; h < hues.length; h++) {
      for (let i = 0; i < hueCounts[h]; i++) {
        const sat = Math.random() * 0.3 + 0.5;  
        const light = Math.random() * 0.2 + 0.4; 
        const color = chroma.hsl(hues[h], Math.min(Math.max(sat, 0), 1), Math.min(Math.max(light, 0), 1)).hex();
        addSwatch(color, pattern);
      }
    }
  }

  fillEmptySwatches(count, pattern);
  saveSwatchCounts();
}


function addSwatch(color = '#3498db', pattern){
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
        saveSwatchCounts();
        generatePalette(pattern, swatchCounts[pattern]);
    });

    if (swatchCounts[pattern] <= minRequired[pattern]) {
      removeBtn.disabled = true;
      removeBtn.style.opacity = '0.5';
      removeBtn.style.cursor = 'not-allowed';
    } 
    else {
      removeBtn.disabled = false;
      removeBtn.style.opacity = '1';
      removeBtn.style.cursor = 'pointer';
    }

    const hexLabel = document.createElement('span');
    const labelColor = chroma(color).darken(2).hex();
    hexLabel.classList.add('hex-label');
    hexLabel.style.color = labelColor;
    hexLabel.textContent = color.toUpperCase();

    hexLabel.addEventListener('click', () => {
        hexLabel.setAttribute('text');
        
        setTimeout(() => hexLabel.textContent = color, 1000);
    });

    swatch.appendChild(removeBtn);
    swatch.appendChild(hexLabel);
    swatchContainer.appendChild(swatch);

}

function fillEmptySwatches(count, pattern) {
  const remaining = 8 - count;

  for (let i = 0; i < remaining; i++) {
    const emptySwatch = document.createElement('div');
    emptySwatch.classList.add('swatch', 'emptySwatch');
    emptySwatch.textContent = '+';
    emptySwatch.addEventListener('click', () => {
        if(swatchCounts[pattern] < 8){
            swatchCounts[pattern]++;
            saveSwatchCounts();
            generatePalette(pattern, swatchCounts[pattern]);
        }
    });
    swatchContainer.appendChild(emptySwatch);
  }
}



function updatePattern(direction) {
  currentIndex = (currentIndex + direction + patterns.length) % patterns.length;
  const currentPattern = patterns[currentIndex];
  label.textContent = formatPattern(currentPattern) + ' Pattern';
  generatePalette(currentPattern);
}

function formatPattern(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function saveSwatchCounts(){
  sessionStorage.setItem('swatchCounts', JSON.stringify(swatchCounts));
}

prevBtn.addEventListener('click', () => updatePattern(-1));
nextBtn.addEventListener('click', () => updatePattern(1));

updatePattern(0);