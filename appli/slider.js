/*****************************************
*********** INIT SLIDER  *****************
****************************************/
 
// Create a slider
var slidervar = document.getElementById('slider');
var inputNumber = document.getElementById('input-number');
//Set default value on input number
inputNumber.setAttribute("value", 1810);

noUiSlider.create(slidervar, {
    start: [1813], //Période proposée à l'utilisateur par défaut
    step:1,                //Pas de déplacement : 1 an
    range: {
        min: 1813,         //Année minimale proposée à l'utilisateur
        max: 1848          //Année maximale proposée à l'utilisateur
    },
    format: wNumb({
        decimals: 0
    }),
    tooltips: false,
    pips: {                // Choix des années repères sur l'axe X du slider
        mode: 'positions',
        values: [0,100],
        density: 10
    }
});

slidervar.noUiSlider.on('update', function (values, handle) {
    document.getElementById('input-number').value = values[handle];
});

inputNumber.addEventListener('change', function(){
    slidervar.noUiSlider.set([this.value, null]);
  });


// Function to update the slider range
function updateSliderRange(min, max) {
    slidervar.noUiSlider.updateOptions({
        range: {
            min: min,
            max: max
        },
        start: [min],  // Optionally, reset the start value to the new min
        pips: {              
            mode: 'positions',
            values: [0,100],
            density: 10
        }
    });

    // Remove the current pips
    const pipsElements = slidervar.querySelectorAll('.noUi-value, .noUi-marker');
    pipsElements.forEach(pip => pip.remove());

    // Re-add pips with the correct values
    slidervar.noUiSlider.pips({
        mode: 'positions',
        values: [0, 100],
        density: 10
    });
}

// Add event listeners to radio buttons
document.getElementById('cad-1810').addEventListener('change', function() {
    if (this.checked) {
        updateSliderRange(1810, 1848);
    }
});

document.getElementById('cad-1848').addEventListener('change', function() {
    if (this.checked) {
        updateSliderRange(1848, 1860);
    }
});

