//  var _sliderStartPos;
//  var _sliderEndPos;


$(document).ready(init);
var sliderElement = 'slider-tooltips';

function init() {
   createSlider(0,1);
}

function updateSlider (min, max) {
	var tooltipSlider = document.getElementById(sliderElement);
	
   	//createSlider(min, max);
	tooltipSlider.noUiSlider.set([min, max]);
	_sliderStartPos = _currentIndex = min;
	_sliderEndPos = max;
	
	//initializeShlokaRange();
}

function hideSlider() {
	document.getElementById(sliderElement).style.display="none";
}

function createSlider(startNum, endNum) {
	_sliderStartPos = startNum;
	_sliderEndPos = endNum;
	
	var tooltipSlider = document.getElementById(sliderElement);
	tooltipSlider.style.display = "";
	
    var slider = tooltipSlider.noUiSlider;
    if (slider != null) slider.destroy(); 
   
	var varValues = range2Array(startNum, endNum);
	
	noUiSlider.create(tooltipSlider, {
		animate: true,
		animationDuration: 300,
		start: [startNum,  endNum],
		connect: [false, true, false],
		orientation: 'vertical',
		behaviour: 'drag-tap-snap',
		step: 1,
		range: {
			'min': startNum,
			'max': endNum
		},
		tooltips: [ true, true],
		format: wNumb({ decimals: 0 }),
		/*pips: {
		  mode: 'steps',
		  values: varValues,
		  density: 10
		}
		pips: {
		  	mode: 'positions',
			values: [0,25,50,75,100],
			density: 10,
			stepped: true
		}*/

	}, true);
	
	tooltipSlider.noUiSlider.on('update', function( values, handle ) {
	  var value = values[handle];
	  if ( handle ) {
		  _sliderEndPos = value;
	  } else {
		  _sliderStartPos = value;
		//alert("left" + value + ' ;;;  Handle = ' + handle);
	  }
	  if(_currentChapter != "")
			gotoShloka(_sliderStartPos, _sliderEndPos);
    });
}

function range2Array(start, count) {
      return Array.apply(0, Array(count))
        .map(function (element, indx) { 
          return indx + start;  
      });
}

function gotoShloka(sliderStartPos, sliderEndPos) {
	// set lower value for shloka range
	//console.log("GOTO Sloka: " + sliderStartPos + " (& _sliderEndPos = " + sliderEndPos + ")");
	
	sliderPlayRange(sliderStartPos, sliderEndPos);
	//playRangeText();
	//gotoNextShloka();
} 

function setHighestShloka(val) {
	//if already at higher than set?
}

function initializeShlokaRange() {
	// if nothing is done, that means header and footer must also be
	// rendered.
	
	//_highest = _lowest = -1;
}