const lockedSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path d="M12 1a5 5 0 0 0-5 5v4H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5zm0 2a3 3 0 0 1 3 3v4H9V6a3 3 0 0 1 3-3z"/>
</svg>
`;

const unlockedSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path d="M17 8V6a5 5 0 0 0-10 0h2a3 3 0 1 1 6 0v2H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1z"/>
</svg>
`;
const lockIcon = document.createElement('div');


const patterns = ['analogous', 'complementary', 'triadic', 'monochromatic', 'split-complementary', 'tetradic', 'custom'];
const swatchContainer = document.getElementById('swatches');
const lastPattern = JSON.parse(sessionStorage.getItem('lastPattern'));
const label = document.getElementById('current-pattern-label');
const prevBtn = document.getElementById('prev-pattern');
const nextBtn = document.getElementById('next-pattern');

// Saves current amount of color swatches so pattern regenerates with the same amount
// of color swatches
const savedSwatchCount = JSON.parse(sessionStorage.getItem('swatchCounts'));
const swatchCounts = savedSwatchCount || {
  'analogous' : 3,
  'complementary' : 2,
  'triadic' : 3,
  'monochromatic' : 4,
  'split-complementary' : 3,
  'tetradic' : 4,
  'custom' : 0,
};

// Sets minimum color swatch amount since certains patterns wouldn't be correct without minimums 
const minRequired = {
  'analogous': 1,
  'complementary': 2,
  'triadic': 3,
  'monochromatic': 1,
  'split-complementary': 3,
  'tetradic': 4,
  'custom' : 0,
};

let currentPattern = patterns[0];
let currentSwatches = swatchCounts[currentPattern];
let currentIndex = 0;

let swatches = [];

const lockedHues = swatches
  .filter(s => s.isLocked)
  .map(s => s.hsl[0]);

function generatePalette() {
  currentSwatches = swatchCounts[currentPattern];
  swatchContainer.innerHTML = '';

  swatches = swatches.filter(s => s.isLocked);
  for (let swatch of swatches) {
    addSwatch(swatch);
  }
  
  makePattern();
  
  // Populates remaining swatches up to max amount (8)
  const remaining = 8 - currentSwatches;

  for (let i = 0; i < remaining; i++) {
    const emptySwatch = document.createElement('div');
    emptySwatch.classList.add('swatch', 'emptySwatch');
    emptySwatch.textContent = '+';
    emptySwatch.addEventListener('click', () => {
        if(swatchCounts[currentPattern] < 8){
            swatchCounts[currentPattern]++;
            saveSwatchCounts();
            generatePalette();
        }
    });
    swatchContainer.appendChild(emptySwatch);
  }
  saveSwatchCounts();
}

function analogous(){
  const baseHue = Math.floor(Math.random() * 360);
  const s = Math.random() * 0.3 + 0.6;
  const l = Math.random() * 0.2 + 0.5;

  if(lockedHues.length > 0){
    for (let i = 0; i < currentSwatches; i++) {
      if(!swatches[i].isLocked){
        const leftLock = findLeftLock(i);
        const rightLock = findRightLock(i);

        let hue;
        if(leftLock && rightLock){
          hue = ((leftLock.hsl[0] + rightLock.hsl[0]) / 2) % 360;
        }
        else if(leftLock){
          hue = (leftLock.hsl[0] + 15) % 360;
        }
        else if(rightLock){
          hue = (leftLock.hsl[0] - 15) % 360;
        }
        else{
          hue = Math.floor(Math.random() * 360);
        }

        const color = chroma.hsl(hue, s, l).hex();
        swatches[i] = {
          color,
          hsl: [hue, s, l],
          isLocked: false,
          element: null,
        };
        addSwatch(swatches[i]);
      } 
      else {
        addSwatch(swatches[i]);
      }
    }
  } 
  else {
    for (let i = 0; i < currentSwatches; i++) {
      const hue = (baseHue + i * 15) % 360;
      const color = chroma.hsl(hue, s, l).hex();

      swatches[i] = {
        color,
        hsl: [hue, s, l],
        isLocked: false,
        element: null,
      };
      addSwatch(swatches[i]);
    }
  }
}


function complementary(){
  const firstHue = Math.floor(Math.random() * 360);
    const secondHue = (firstHue + 180) % 360;
    const s = Math.random() * 0.3 + 0.5;
    const l = Math.random() * 0.2 + 0.4;

    const colors = chroma.scale([chroma.hsl(firstHue, s, l), chroma.hsl(secondHue, s, l)]).mode('lch').colors(currentSwatches);

    for(let i = 0; i < currentSwatches; i++){
        addSwatch(colors[i], currentPattern);
      }
}

function triadic(){
  const baseHue = Math.floor(Math.random() * 360);
    const sBase = Math.random() * 0.3 + 0.5;
    const lBase = Math.random() * 0.2 + 0.5;

    const hues = [
      baseHue,
      (baseHue + 120) % 360,
      (baseHue + 240) % 360
    ];

    const baseCount = Math.floor(currentSwatches / 3);
    const remVariants = currentSwatches % 3;
    const hueCounts = [baseCount, baseCount, baseCount];
    for (let i = 0; i < remVariants; i++) {
      hueCounts[i]++;
    }

    for (let h = 0; h < hues.length; h++) {
      for (let i = 0; i < hueCounts[h]; i++) {
        const sat = sBase + (Math.random() * 0.6 - 0.3);  
        const light = lBase + (Math.random() * 0.6 - 0.3); 
        const color = chroma.hsl(hues[h], Math.min(Math.max(sat, 0), 1), Math.min(Math.max(light, 0), 1)).hex();
        addSwatch(color, currentPattern);
      }
    }
}

function monochromatic(){
  const baseHue = Math.floor(Math.random() * 360);
    const s = Math.random() * 0.3 + 0.3;

    for (let i = 0; i < currentSwatches; i++) {
      const varLight = Math.random() * 0.5 + 0.3;
      const color = chroma.hsl(baseHue, s, varLight).hex();
      addSwatch(color, currentPattern);
    }
}

function splitComp(){
  const baseHue = Math.floor(Math.random() * 360);
  
    const hues = [
      baseHue,
      (baseHue + 150) % 360,
      (baseHue + 210) % 360
    ];

    const baseCount = Math.floor(currentSwatches / 3);
    const remVariants = currentSwatches % 3;
    const hueCounts = [baseCount, baseCount, baseCount];
    for (let i = 0; i < remVariants; i++) {
      hueCounts[i]++;
    }

    for (let h = 0; h < hues.length; h++) {
      for (let i = 0; i < hueCounts[h]; i++) {
        const sat = Math.random() * 0.3 + 0.5;  
        const light = Math.random() * 0.2 + 0.4; 
        const color = chroma.hsl(hues[h], Math.min(Math.max(sat, 0), 1), Math.min(Math.max(light, 0), 1)).hex();
        addSwatch(color, currentPattern);
      }
    }
}

function tetradic(){
  const baseHue = Math.floor(Math.random() * 360);
  
    const hues = [
      baseHue,
      (baseHue + 90) % 360,
      (baseHue + 180) % 360,
      (baseHue + 270) % 360
    ];

    const baseCount = Math.floor(currentSwatches / 4);
    const remVariants = currentSwatches % 4;
    const hueCounts = [baseCount, baseCount, baseCount, baseCount];
    for (let i = 0; i < remVariants; i++) {
      hueCounts[i]++;
    }
    for (let h = 0; h < hues.length; h++) {
      for (let i = 0; i < hueCounts[h]; i++) {
        const sat = Math.random() * 0.3 + 0.5;  
        const light = Math.random() * 0.2 + 0.4; 
        const color = chroma.hsl(hues[h], Math.min(Math.max(sat, 0), 1), Math.min(Math.max(light, 0), 1)).hex();
        addSwatch(color, currentPattern);
      }
    }
}

function customPalette(){

}

function makePattern(){
  switch(currentPattern) {
    case 'analogous' : return analogous();
    case 'complementary' : return complementary();
    case 'triadic' : return triadic();
    case 'monochromatic' : return monochromatic();
    case 'split-complementary' : return splitComp();
    case 'tetradic' : return tetradic();
    case 'custom' : return customPalette();

  }
}



function addSwatch(swatch){
    const { color, hsl, isLocked, element } = swatch;
    const swatchDiv = document.createElement('div');
    swatchDiv.classList.add('swatch');
    swatchDiv.style.backgroundColor = color
    swatchDiv.style.color = chroma(color).luminance() > 0.5 ? '#000' : '#fff';
    swatch.element = swatchDiv;


    const removeBtn = document.createElement('button');
    const removeColor = chroma(color).darken(1).hex();
    removeBtn.textContent = '−';
    removeBtn.style.backgroundColor = removeColor;
    removeBtn.classList.add('remove-btn');

    const lockBtn = document.createElement('button');
    lockBtn.classList.add('lock-btn');
    lockBtn.innerHTML = unlockedSVG;

    const hexLabel = document.createElement('span');
    const labelColor = chroma(color).darken(2).hex();
    hexLabel.classList.add('hex-label');
    hexLabel.style.color = labelColor;
    hexLabel.textContent = color.toUpperCase();

    if (swatchCounts[currentPattern] <= minRequired[currentPattern]) {
      removeBtn.disabled = true;
      removeBtn.style.opacity = '0.5';
      removeBtn.style.cursor = 'not-allowed';
    } 
    else {
      removeBtn.disabled = false;
      removeBtn.style.opacity = '1';
      removeBtn.style.cursor = 'pointer';
    }

    removeBtn.addEventListener('click', (e) => {
        swatchCounts[currentPattern]--;
        saveSwatchCounts();
        generatePalette();
    });

    lockBtn.addEventListener('click', () => {
        swatch.isLocked = !swatch.isLocked;

        if (swatch.isLocked) {
          lockBtn.innerHTML = lockedSVG;
          removeBtn.disabled = true;
          removeBtn.style.opacity = '0.5';
          removeBtn.style.cursor = 'not-allowed';
    
        } 
        else {
          lockBtn.innerHTML = unlockedSVG;
          removeBtn.disabled = false;
          removeBtn.style.opacity = '1';
          removeBtn.style.cursor = 'pointer';
        }
  });

    hexLabel.setAttribute('contenteditable', 'true');
    hexLabel.setAttribute('spellcheck', 'false');

    let currentHex = color.toUpperCase(); 

    hexLabel.contentEditable = true;
    hexLabel.addEventListener('blur', () => {
    let input = hexLabel.textContent.trim().toUpperCase();
    
    if (/^#[0-9A-F]{6}$/.test(input)) {
      currentHex = input;
      swatch.color = input;
      swatchDiv.style.backgroundColor = input;
      hexLabel.style.border = 'none';
    } 
    else {
      hexLabel.textContent = currentHex;

      setTimeout(() => {
        hexLabel.style.border = 'none';
      }, 1000);
    }
    });

    hexLabel.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();        
      hexLabel.blur();           
    }
    });

    swatchDiv.appendChild(lockBtn)
    swatchDiv.appendChild(removeBtn);
    swatchDiv.appendChild(hexLabel);
    swatchContainer.appendChild(swatchDiv);
}

function findLeftLock(index){
  for(let k = index; k < currentSwatches; k--){
    if(swatches[k].isLocked){
      return swatches[k];
    }
  }
  return null;
}

function findRightLock(){
  for (let k = index + 1; k < swatches.length; k++) {
      if (swatches[k].isLocked) {
        return swatches[k];
      }
    }
    return null;
}

function saveSwatchCounts(){
  sessionStorage.setItem('swatchCounts', JSON.stringify(swatchCounts));
}

function updatePattern(direction) {
  currentIndex = (currentIndex + direction + patterns.length) % patterns.length;
  currentPattern = patterns[currentIndex];
  const formattedPattern = currentPattern.charAt(0).toUpperCase() + currentPattern.slice(1);

  label.textContent = formattedPattern + ' Pattern';
  sessionStorage.setItem('lastPattern', JSON.stringify(currentPattern));
  generatePalette();
}


prevBtn.addEventListener('click', () => updatePattern(-1));
nextBtn.addEventListener('click', () => updatePattern(1));

if (lastPattern && patterns.includes(lastPattern)) {
  currentIndex = patterns.indexOf(lastPattern);
} else {
  currentIndex = 0;
}

updatePattern(0);