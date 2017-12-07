var _currStTm = 0;
var _currEndTm = 0;
var _prevStTm = 0;
var _prevEndTm = 0;
var _nextStTm = 0;
var _prev_endTm = 0;

var _shlokaCntr = 0;
var _shlokaLine = 0;
var shl = "";
var numEntries = 0;

var _currJump = "N";
var _prevJump = "N";
var _nextJump = "N";
var jsonTeacher = "";
var jsonText = "";

function sliderPlayRangeTu(slSt, slEnd) {

	_shlokaCntr = slSt;
	_shlokaLine = 0;
	getShlokaStartTmAndWrdCntTu(_shlokaCntr);
	_mediaElementRef.currentTime = _currStTm;
}

 


 
	function populateAllSholkasTu() {

		 if (_secDtlsArrDisplay != null) { //empty it out
			 _secDtlsArrDisplay.splice(0, _secDtlsArrDisplay.length);
		 }



        for (i=0; i < _entireChapterData.shloka.length; i++) {
            var shl = _entireChapterData.shloka[i];
		    var numEntries = shl.entry.length;

            for (j=0; j < numEntries; j++) {
				if(shl.entry[j].teacher == "YS") {
					_secDtlsArrDisplay.push({
					  text    : shl.entry[j].text,
					  startTime  : shl.entry[j].startTime,
					  endTime : shl.entry[j].endTime,
					  swhtsp  : shl.entry[j].swhtsp
					});
				}
             }
        }

	 }

 //////////////////////////////////////////////////////////////
     // displayShlokaTu()
     //////////////////////////////////////////////////////////////
     function displayShlokaTu(index) {
          //console.log("displayShlokaTu()");
//         _stLn = +index;
//         _endLn = +index + (+_nbrOfLines);
         if(_endLn > _numShlokasInChap) {
             _endLn = _numShlokasInChap;
         }

//         populateSectionArrTu(index);
         //playRangeTextTu();
		 removeNonTextFromSecRefsTu();
         displayShlokaInitialTu();

         populateSecnsRefsTu();

         _prevHighlightedSec = -1;

         refreshShlokas();

         _wordCnt = _secDtlsArrDisplay.length;

		 if(!_testingMode) {
         	_currWrdPos = 0;
		 }

         if(_currRepeatGoing != _para) {
            _currRepeatGoing = _word;
            _modeChanged = false;
         }
         _currSwhtsp = _secDtlsArrDisplay[_currWrdPos].swhtsp;
     }

  //////////////////////////////////////////////////////////////
     // displayShlokaInitialTu()
     //////////////////////////////////////////////////////////////
     function displayShlokaInitialTu() {
       // console.log(bigStr);
         displayShlokaInitialPPTu();

     }

    function displayShlokaInitialPPTu() {
//console.log("displayShlokaInitial");

     $("#shloka-display").slideDown("slow");
       var bigStr = "";
       var secId = 0;
       for (i = 0; i < _secDtlsArrDisplay.length; i++) {
          var secDtls = _secDtlsArrDisplay[i];
          if ($.trim(secDtls.startTime) == "") {
            bigStr += "<span>";
            bigStr += secDtls.text;
            bigStr += "</span>";
          } else {

                bigStr += "<button class=\"secButton\" id=\"" + secId + "\" onclick=\"secBtnPressedTu('" + secId + "')\">";

            bigStr += secDtls.text;
            bigStr += "</button> &nbsp;"
            secId++;
          }

          var whtsp=secDtls.swhtsp;
          switch(whtsp) {
             case "w":
               bigStr += "&nbsp;";
               break;
             case "p":
               bigStr += "&nbsp;&nbsp;&nbsp;";
               break;
             case  "l":
               bigStr += "<br></br>";
               break;
             case  "":
               bigStr += "<br></br><p>";
               break;
             default:
               break;
          }
           document.getElementById("shloka-display").innerHTML = bigStr;
            $("#shloka-display").slideDown("slow");
       }
       // console.log(bigStr);
     }


     //////////////////////////////////////////////////////////////
     // secBtnPressed()
     // - If any section is chosen
	 //     - set repeat button to "repeat a shloka"/repeatOne
	 //     - pause the player
	 // - If sections have been cleared
	 //     - reset the repeat button status
     //////////////////////////////////////////////////////////////
     function secBtnPressedTu(btnId) {
//console.log("secBtnPressed");
        var btnObj = _secRefArr[btnId];
        //console.log('Id : ' + btnId + ', Class : ' + btnObj.className + ', text : ' + btnObj.innerHTML);
        if (processFurtherSectionClick(btnId)) {
          if (btnObj.className == 'secButton') {
             btnObj.className = 'secButton-pressed'
           } else {
             btnObj.className = 'secButton';
           }
         }

		 if (_chosenBtnArr.length == 0) {
			 setLastKnownRepeatStatus();
			 var shl = _entireChapterData.shloka[_shlokaCntr];
			 var numEntries = shl.entry.length;
             _startPos = +shl.entry[0].startTime;
             _endPos = +shl.entry[numEntries-1].endTime;
		 } else {
			 _mediaElementRef.pause();
			 updateRepeatButtonStatus("repeatOne");
			 _repeatStatus = "repeatOne";
			 _playsStatus = "notplaying";
			 //getTimingForText(btnObj.textContent, "");
             showPlay();
              $( "#plays_btn" ).click();
		 }

		 // console.log(_chosenBtnArr.length);
     }
    
function getTimingForText(txt, whichpnt) {
	 for (i=0; i < _numShlokasInChap; i++) {
		var shl = _entireChapterData.shloka[i];
		var numEntries = shl.entry.length;
		 
		 for(j=0;j<numEntries;j++) {
			 if(txt == shl.entry[j].text && shl.entry[j].teacher == "YS") {
				 if(whichpnt == "") {
//				 	_startPos = shl.entry[j].startTime;
//				 	_endPos = shl.entry[j].endTime;
//					 return true;
				 }
				 if(whichpnt == "S") {
					 _startPos = shl.entry[j].startTime;
					 return _startPos;
				 }
				 if(whichpnt == "E") {
					 _endPos = shl.entry[j].endTime;
					 return _endPos;
				 }
			 }
		 }
		 
		 
	 }
	
}
	 //////////////////////////////////////////////////////////////
	 // populateSectionArrTu()
	 //////////////////////////////////////////////////////////////
	 function populateSectionArrTu(indx) {
         //console.log("populateSectionArrTu()");
		 var index = +indx;
		 if (_secDtlsArr != null) { //empty it out
			 _secDtlsArr.splice(0, _secDtlsArr.length);
		 }

		 var shl = _entireChapterData.shloka[index];

		 var numEntries = shl.entry.length;

		 for (i=0; i < numEntries; i++) {
			_secDtlsArr.push({
			  text    : shl.entry[i].text,
			  startTime  : shl.entry[i].startTime,
			  endTime : shl.entry[i].endTime,
			  swhtsp  : shl.entry[i].swhtsp
		    });
		 }

 		 _startPos = +shl.entry[0].startTime;
		 _endPos = +shl.entry[numEntries-1].endTime;
	 }


     //////////////////////////////////////////////////////////////
     // removeNonTextFromSecRefsTu()
     // Initial section details has punctuation marks or content
     // that is not part of the shloka words. So, get rid of those
     // in the array.
     //////////////////////////////////////////////////////////////
     function removeNonTextFromSecRefsTu() {
         //console.log("removeNonTextFromSecRefsTu");
        for (var i = _secDtlsArrDisplay.length - 1; i >= 0; i--) {
           if (_secDtlsArrDisplay[i].startTime == "") {
             _secDtlsArrDisplay.splice(i, 1);
           }
        }

       // console.log("_secDtlsArr " || _secDtlsArr.length);
     }

     //////////////////////////////////////////////////////////////
     // highlightSec()
     // - Highlights the current section being played
     //////////////////////////////////////////////////////////////
     function highlightSecTu(txt) {
//         console.log("highlightSec");
        var sec = 0;
        var secFound = false;
        var secDtlsLen = _secDtlsArrDisplay.length;

        for (sec = 0; sec < secDtlsLen; sec++) {
           if (txt == _secDtlsArrDisplay[sec].text) {
              secFound = true;
              break;
           }
        }

        if (!secFound) {
           sec = secDtlsLen-1;
        }
         if(sec != -1)
            highlightCurSecTu(sec);
     }


     //////////////////////////////////////////////////////////////
     // highlightCurSec(sec)
     //////////////////////////////////////////////////////////////
     function highlightCurSecTu(sec) {
//console.log("highlightCurSec");
		 if(!_oneLine) {
			if (_teacher && _prevHighlightedSec == sec) {
			  return;
			} else {
			  unhighlightPrevSecTu(_prevHighlightedSec);
			  _prevHighlightedSec = sec;
			}
		 }
        var secObj = _secRefArr[sec];
		if (secObj != null) {
			if(_teacher)
				secObj.style.color = "blue";
			 else if(_student)
				secObj.style.color = "brown";
		}
        //secObj.style.fontWeight = "bold";
     }


     //////////////////////////////////////////////////////////////
     // unhighlightPrevSec(sec)
     //////////////////////////////////////////////////////////////
     function unhighlightPrevSecTu(sec) {
//console.log("unhighlightPrevSec");
        if (sec < 0) return;
        var secObj = _secRefArr[sec];
        if (secObj != null) {
            secObj.style.color = "black";
        	secObj.style.fontWeight = "inherit";
        }
     }


     //////////////////////////////////////////////////////////////
     // populateSecnsRefsTu()
     // - Prepopulate the references to the shlokla sections.
     // - Prepopulate the texts of the corresponding sections above.
     //
     // Above data will be useful
     //   - While selecting contiguous sections.
     //   - For highlighting appropriate section while the audio
     //     is running.
     //////////////////////////////////////////////////////////////
     function populateSecnsRefsTu() {
//console.log("populateSecnsRefs");
	    if(_secRefArr != null) {
			_secRefArr.splice(0, _secRefArr.length);
		}

       for (var i = 0; i < _secDtlsArrDisplay.length; i++) {
         var secRef = document.getElementById("" + i);
         _secRefArr.push(secRef);
       }

       //console.log(_secRefArr.length);
     }



     function resetToStarting() {
         console.log("resetToStarting...");
//            _stLn = 0;
//            _endLn = _nbrOfLines;
//            _stPlayLn = 0;
//            _endPlayLn = _endLn;
//            _gCounter = 0;
//            _playLine = 0;
//            _insideF = false;
//		 	$('#shloka-display').removeClass('shloka-display').addClass('shloka-display');
//            displayShlokaTu(0);
//           _mediaElementRef.currentTime = _shlokaStartTime;
     }

	function getShlokaStartTmAndWrdCntTu(lineNumber) {

		shl = _entireChapterData.shloka[lineNumber];
		numEntries = shl.entry.length;
		
		_prevStTm = _currStTm;
		_prevEndTm = _currEndTm;
		_prevJump = _currJump;
		
		if(_shlokaLine < numEntries) {
			_currStTm = +shl.entry[_shlokaLine].startTime;
			_currEndTm = +shl.entry[_shlokaLine].endTime;
			_currJump = shl.entry[_shlokaLine].jump;
			jsonTeacher = shl.entry[_shlokaLine].teacher;
			jsonText = shl.entry[_shlokaLine].text;
			if(jsonTeacher.includes("Y")) {
				_teacher = true;
				_student = false;
			}
			else {
				_teacher = false;
				_student = true;
			}
		}
  		
		if((_shlokaLine + 1) < numEntries) {
			_nextStTm = +shl.entry[_shlokaLine+1].startTime;
			_nextEndTm = +shl.entry[_shlokaLine+1].endTime;
			_nextJump = shl.entry[_shlokaLine+1].jump;
		}     
	}


function getCurrTimeText(curTm) {
	
		 for (i=0; i < _numShlokasInChap; i++) {
			var shl = _entireChapterData.shloka[i];
			var numEntries = shl.entry.length;

			for(j=0;j<numEntries;j++) {
				
				var stTm = +shl.entry[j].startTime;
				var endTm = +shl.entry[j].endTime;
				if(curTm > stTm && curTm < endTm) {
					return shl.entry[j].text;
				}
		 	}
	 }
	
	return "";
	
}
     //////////////////////////////////////////////////////////////
     // tmUpdLsr()
     // Time update listener for the media player.
     // IMPORTANT FUNCTION.
     //////////////////////////////////////////////////////////////
     function tmUpdLsrTu(mediaElement) {

		 if(_entireChapterData == null || _entireChapterData.shloka == null) { 
			 return false;
		 }
		 
		 _curTime = mediaElement.currentTime;
		 
		
		 
		 if(_repeatStatus == "repeatOne" ) {
			 if(_curTime > _endPos) {
				_mediaElementRef.currentTime = _startPos;
			 }
			 highlightSecTu(getCurrTimeText(_curTime));
			 return false;
          }
		 
		if(_onlyOnceTeacher) {
			getShlokaStartTmAndWrdCntTu(_shlokaCntr);
			_onlyOnceTeacher = false;
		}


		 if(_curTime > _currEndTm) {
			 if(_shlokaLine == (numEntries-1)) { 
				 _shlokaLine = 0;
				 _shlokaCntr++;
			 } else {
				 _shlokaLine++;
				 if(_currJump == "Y") {
					mediaElement.currentTime = _nextStTm;
				 }				 
			 }
			 getShlokaStartTmAndWrdCntTu(_shlokaCntr);
		 }
      
	
		 
		  highlightSecTu(jsonText);

		 
       _logMsg =  " Line#: " + (_shlokaLine) + " | Shlokas#: " + _shlokaCntr;
	   _logMsg = _logMsg + " | jsonTeacher = " + jsonTeacher;

		 if(_testingMode) {
		   _logMsg = _logMsg + " _currPlayShlokaStartTime = " + _currPlayShlokaStartTime;
		   _logMsg = _logMsg + " _currPlayShlokaEndTime = " + _currPlayShlokaEndTime;
		   _logMsg = _logMsg + " _currPlayShlokaStartTimeStu = " + _currPlayShlokaStartTimeStu;
		   _logMsg = _logMsg + " _currPlayShlokaEndTimeStu = " + _currPlayShlokaEndTimeStu;
		   _logMsg = _logMsg + " _currPlayLineInShloka = " + _currPlayLineInShloka;
		   _logMsg = _logMsg + " _nbrOfLineInShloka = " + _nbrOfLineInShloka;
		   _logMsg = _logMsg + " _currPlayLineStartTime = " + _currPlayLineStartTime;
		   _logMsg = _logMsg + " _currPlayLineEndTime = " + _currPlayLineEndTime;
		   _logMsg = _logMsg + " _currPlayLineStartTimeStu = " + _currPlayLineStartTimeStu;
		   _logMsg = _logMsg + " _currPlayLineEndTimeStu = " + _currPlayLineEndTimeStu;
		 }

       $('#logMsg').html(_logMsg); 
         
        

       if (_shlokaCntr > (_stLn + _endLn)/2 && !_insideF && _endLn < _numShlokasInChap) {
           _gCounter++;
           _stLn++;
           _endLn++;
           _insideF = true;

           _insideF = false;
		   tmpPos = 100;
           $('#shloka-display').animate({
                'marginTop' : '-=' + tmpPos //moves up
                });
       }
     }

	function playAudioRangesTu(start, end) {
          console.log("playAudioRanges()");
           _startPos   = +start;
           _endPos   = +end;

           _mediaElementRef.currentTime = _startPos;
		   _curTime = _startPos;
           _mediaElementRef.play();
     }