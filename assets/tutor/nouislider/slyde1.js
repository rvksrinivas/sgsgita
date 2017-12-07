
$(document).ready(init);

function init() {

var slider = document.getElementById('slider');

/*
noUiSlider.create(slider, {
	start: [0, 100],
	connect: true,
	step: 1,
	tooltips: [true, true],
	format: wNumb({decimals: 0}),
	range: {
		'min': 0,
		'max': 100
	}
});
*/

var tooltipSlider = document.getElementById('slider-tooltips');

noUiSlider.create(tooltipSlider, {
	start: [20,  70],
	connect: false,
	step: 1,
	range: {
		'min': 0,
		'max': 80
	},
    tooltips: true,
	connect: true,
	format: {
        to: function (value) {
            return value + '';
        },
        from: function (value) {
            return value.replace('', '');
           }
        }
});

Array.prototype.forEach.call(document.querySelectorAll('.slider'), createSlider);

}


function data ( element, key ) {
	return element.getAttribute('data-' + key);   
}

function createSlider ( slider ) {
    
	console.log("ding");
	
        noUiSlider.create(slider, {
            start: [0, 50],
            connect: false,
            step: Number(data(slider, 'step')) || 1,
            range: {
                'min': 0,
                'max': 50
            },
            tooltips: true,
            connect: true,
            format: {
                to: function (value) {
                    return value + '';
                },
                from: function (value) {
                    return value.replace('', '');
                }
            }
        });
}


