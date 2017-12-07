	 var _testingMode = false;

	 //////////////////////////////////////////////////////////////
     // GLOBAL VARIABLES
     //////////////////////////////////////////////////////////////
     var _sectionPressed = false;
     var _startPos   = 0;
     var _endPos   = 100000;
     var _secDtlsArr  = new Array();
     var _secDtlsArrDisplay  = new Array();

     var _secDtlsArrDisplayStu  = new Array();

     var _secDtlsArrMng  = new Array();
     var _secRefArr = new Array();
     var _chosenBtnArr = new Array();

     var _prevHighlightedSec = -1;

	 var _playsStatus = "notplaying";
	 var _repeatStatus = "repeatChapter";
	 var _currentChapter = "";
	 var _currentIndex = "";
	 var _mediaElementRef = "";
	 var _entireChapterData = "";
	 var _entireChapterDataMng = "";
     var _numShlokasInChap = 0;
	 var _lastKnownRepeatStatus=_repeatStatus;
     var _nbrOfLines = 3;
     var _logMsg = "";
     var _methodInside = "";
     var _stLn = 0;
     var _endLn = _stLn + _nbrOfLines;
     var _stPlayLn = 0;
     var _endPlayLn = _endLn;
     var _gCounter = 0;
     var _playLine = 0;
     var _prevPlayLine = 0;
     var _insideF = false;
     var _lang = 'devanagari';
	 var _prevLang = 'devanagari';

     var _tutorialMode = false;


     var _repeatWord = false;
     var _repeatLine = false;
     var _repeatSholka = false;

     var _teacher = true;
     var _student = false;

     var _teacherRepeat = 1;
     var _studentRepeat = 2;

     var _wordCnt = _secDtlsArr.length;
     var _currWrdPos = 0;
     var _startWordPos = 0;
     var _currTeacherRptCntr = 0;
     var _currStudentRptCntr = 0;

     var _currSwhtsp = "";
     var _prevSwhtsp = "";

     var _word = "WORD";
     var _line = "LINE";
     var _sholka = "SHOLKA";
     var _para = "PARA";

     var _empty = "";
     var _n = "n";
     var _p = "p";
     var _l = "l";

     var _currRepeatGoing = _word; // [WORD --> SHOLKA --> PARA]

     var _currPlayShlokaEndTime = 0;
     var _currPlayShlokaStartTime = 0;

     var _currPlayShlokaEndTimeStu = 0;
     var _currPlayShlokaStartTimeStu = 0;

     var _modeChanged = false;
     var _pageNumber = 1;
     var _pagePlayLine = 0;
     var _shlokaStartTime = 0;
     var _shlokaEndTime = 100000;

     var _shlokaStartTimeStu = 0;
     var _shlokaEndTimeStu = 100000;

     var _currPlayLineEndTime = 0;
     var _currPlayLineStartTime = 0;

     var _currPlayLineEndTimeStu = 0;
     var _currPlayLineStartTimeStu = 0;

     var _currPlayLineInShloka = 0;

     var _uvacha = false;
     var _nbrOfLineInShloka = 0;

	 var _oneLine = false;
     var _onlyOnceTeacher = true;
     var _onlyOnceStudent = true;

     var _curTime = 0;
     var _tutorJSONFileName = "tutor_chapter.json";
     var _tutorMP3FileName = "tutor_chapter.mp3";
     var _plainJSONFileName = "plain_chapter.json";
     var _plainMP3FileName = "plain_chapter.mp3";
     var _tutorFile = false;
     var _tutotJSONFile = false;
     var _tutorMP3File = false;

	if(_testingMode) {
		_studentRepeat = 1;
	}
     //////////////////////////////////////////////////////////////
     // code begin
     //////////////////////////////////////////////////////////////

     $(document).ready(init);

     //////////////////////////////////////////////////////////////
     // init()
     //////////////////////////////////////////////////////////////
     function init() {
         //console.log("init");
       //$("#shloka").hide();
       //displayShlokaInitial();
       //removeNonTextFromSecRefs();
       //populateSecnsRefs();
	   _mediaElementRef = $("#my-audio")[0];
       hideSlider();
	 }

    function langSel() {

			var lang = $("#langSel").val();
			//console.log(lang + "   prev " + _prevLang);
			_lang = lang;
			changeChapterDrop();
            if(_currentChapter != "")
                refreshShlokas();
	    }

		function refreshShlokas() {

			if (_prevLang == _lang) return;

			var secBtnArr = document.getElementsByClassName("secButton");
			for (i = 0; i < secBtnArr.length; i++) {
				var txt = Sanscript.t(secBtnArr[i].innerHTML, _prevLang, _lang);
				secBtnArr[i].innerHTML = txt;
			}
			_prevLang = _lang;
		}



		function changeChapterDrop() {
			var textArr  = ("ध्यानश्लोकाः|01 अर्जुनविषाद|02 साङ्ख्य|03 कर्म|04 ज्ञान|05 कर्मसन्न्यास|06 आत्मसंयम|07 ज्ञानविज्ञान|" +
			               "08 अक्षरब्रह्म|09 राजविद्याराजगुह्य|10 विभूति|11 विश्वरूपदर्शन|12 भक्ति|13 क्षेत्रक्षेत्रज्ञविभाग|14 गुणत्रयविभाग|" +
						   "15 पुरुषोत्तम|16 दैवासुरसम्पद्विभाग|17 श्रद्धात्रयविभाग|18 मोक्षसन्न्यास|गीतामाहात्म्यम्|गीतासारम्").split("|");
			/*
			var valArr = "bg/dhyana bg/01 bg/02 bg/03 bg/04 bg/05 bg/06 bg/07 bg/08 bg/09 \
			              bg/10 bg/11 bg/12 bg/13 bg/14 bg/15 bg/16 bg/17 bg/18 \
						  bg/mahatmyam bg/saaram".split(" ");
			*/
			if (_lang != 'devanagari') {
				for (i=0; i < textArr.length; i++) {
					textArr[i] = Sanscript.t(textArr[i], "devanagari", _lang);
				}
			}

			// console.log(textArr);

			for (i=0; i < textArr.length; i++) {
				$("#chapSel option").eq(i+1).text(textArr[i]);
			}
		}

function verifyFileAvailable(fileName) {
	
	$.ajax({
		url: fileName, 
		data:_currentChapter,
		error: function(xhr){
			if(fileName == "./" + _currentChapter + "/" + _tutorJSONFileName)
				_tutorJSONFile = false;
	
			if(fileName == "./" + _currentChapter + "/" + _tutorMP3FileName)
				_tutorMP3File = false;
        }, 
		success: function(result){
            if(fileName == "./" + _currentChapter + "/" + _tutorJSONFileName)
				_tutorJSONFile = true;
	
			if(fileName == "./" + _currentChapter + "/" + _tutorMP3FileName)
				_tutorMP3File = true;
        }
	});
	
}



	 //////////////////////////////////////////////////////////////
	 // chapSel()
	 //
	 // - Call back for chapter selection dropdown
	 // - Navigates to a chapter
	 // - Populates the number of shlokas within the chapter
	 //////////////////////////////////////////////////////////////
	 function chapSel() {
         //console.log("chapSel");
         _numShlokasInChap = 0;
		 var selChap = $("#chapSel").val();
		 _currentChapter = selChap;
         //parseShlokaFromJSONFileMng("./" + selChap + "/meaning.json");
         
        
//		verifyFileAvailable("./" + selChap + "/" + _tutorJSONFileName);
//		verifyFileAvailable("./" + selChap + "/" + _tutorMP3FileName);
		 
         if(_tutorialMode) {
             _tutorFile = true;
             parseShlokaFromJSONFile("./" + selChap + "/" + _tutorJSONFileName);
		     _mediaElementRef.src = "./" + selChap + "/" + _tutorMP3FileName;                          
         } else {
             parseShlokaFromJSONFile("./" + selChap + "/" + _plainJSONFileName);
		     _mediaElementRef.src = "./" + selChap + "/" + _plainMP3FileName;             
             
         }
         
		 _mediaElementRef.load();

         showPause();
		 _mediaElementRef.play();

         _stLn = 0;
         _endLn = +_nbrOfLines;
         _stPlayLn = 0;
         _endPlayLn = +_nbrOfLines;
	 }
	 //////////////////////////////////////////////////////////////
	 // testing()
	 //////////////////////////////////////////////////////////////
    $(document).ready(function(){
        $('input[type="checkbox"]').click(function(){
            if($("#testing").prop("checked") == true){
                //reset to the starting
                if(_currentChapter != "")
                _testingMode = true;
				_studentRepeat = 1;
                $("#testing").prop("disabled", true);
                setTimeout(function(){
                    $("#testing").prop("disabled", false);
                }, 2000);
            }
            else if($("#testing").prop("checked") == false){
                //reset repeat
                _testingMode = false;
				_studentRepeat = 2;
                $("#testing").prop("disabled", true);
                setTimeout(function(){
                    $("#testing").prop("disabled", false);
                }, 2000);
            }

        });
    });

	 //////////////////////////////////////////////////////////////
	 // tutorialMode()
	 //////////////////////////////////////////////////////////////
    $(document).ready(function(){
        $('input[type="checkbox"]').click(function(){
            if($("#tutorialMode").prop("checked") == true){
                //reset to the starting
                if(_currentChapter != "") 
                    resetToStarting();
                 _tutorialMode = true;
                $("#tutorialMode").prop("disabled", true);
                setTimeout(function(){
                    $("#tutorialMode").prop("disabled", false);
                }, 2000);
            }
            else if($("#tutorialMode").prop("checked") == false){
                //reset repeat
                _tutorialMode = false;
                $("#tutorialMode").prop("disabled", true);
                setTimeout(function(){
                    $("#tutorialMode").prop("disabled", false);
                }, 2000);
            }
			if(_currentChapter != "") 
				chapSel();
        });
    });

     //////////////////////////////////////////////////////////////
     // parseShlokaFromJSONFile()
     //////////////////////////////////////////////////////////////
	 function parseShlokaFromJSONFile(fileURI) {
//console.log("parseShlokaFromJSONFile");
		 var xmlhttp = new XMLHttpRequest();
		 var url = fileURI;

		 xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                _entireChapterData = JSON.parse(xmlhttp.responseText);
                processJSONData(_entireChapterData);
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
	 }

	 function parseShlokaFromJSONFileMng(fileURI) {
//console.log("parseShlokaFromJSONFileMng");
		 var xmlhttp = new XMLHttpRequest();
		 var url = fileURI;

		 xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                _entireChapterDataMng = JSON.parse(xmlhttp.responseText);
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
	 }
     //////////////////////////////////////////////////////////////
     // processJSONData()
     //////////////////////////////////////////////////////////////
	 function processJSONData(chapter) {
//console.log("processJSONData");
		 _currentChapter = chapter.name;
		 var chapNum = chapter.chapterNum;
		 _numShlokasInChap = chapter.shloka.length; // includes header and end footer
		 _currentIndex = 0;
		 setSlider(_numShlokasInChap);
         //$('#stLine').attr('max', _numShlokasInChap-2);
         //$('#endLine').attr('max', _numShlokasInChap-2);
//         $('#nbrOfLines').attr('max', _numShlokasInChap-2);

         _shlokaStartTime = +_entireChapterData.shloka[0].entry[0].startTime;
		 _shlokaEndTime = _entireChapterData.shloka[_numShlokasInChap-1].entry[_entireChapterData.shloka[_numShlokasInChap-1].entry.length - 1].endTime;

		 if(_tutorialMode) {
         	populateAllSholkasTu();
         	displayShlokaTu(_currentIndex);
		 } else {
		    populateAllSholkasPl();
         	displayShlokaPl(_currentIndex);	 
		 }
         //displayShlokaMng(0);
	 }


	 //////////////////////////////////////////////////////////////
	 //
	 //////////////////////////////////////////////////////////////
	 function setSlider(numShlokas) {
		 if(numShlokas > 0) {
		 	createSlider(0, numShlokas);
		 }
		 else {
		 	hideSlider();
		 }
	 }



   

    

     //////////////////////////////////////////////////////////////
     // secBtnPressed()
     // - If any section is chosen
	 //     - set repeat button to "repeat a shloka"/repeatOne
	 //     - pause the player
	 // - If sections have been cleared
	 //     - reset the repeat button status
     //////////////////////////////////////////////////////////////
     function secBtnPressed(btnId) {
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
			 var shl = _entireChapterData.shloka[_currentIndex];
			 var numEntries = shl.entry.length;
             _startPos = +shl.entry[0].startTime;
             _endPos = +shl.entry[numEntries-1].endTime;
		 } else {
			 _mediaElementRef.pause();
			 updateRepeatButtonStatus("repeatOne");
			 _repeatStatus = "repeatOne";
			 _playsStatus = "notplaying";
             showPlay();
              $( "#plays_btn" ).click();
		 }

		 // console.log(_chosenBtnArr.length);
     }

     //////////////////////////////////////////////////////////////
     // processFurtherSectionClick()
     // - A user is to choose only contiguous sections of text.
     // - If a section is chosen within an already existing selection
     //   then false is returned.
     // - If a section is chosen beyond the contiguous chunks, then
     //   a clear to existing selection will be made. A retrun value
     //   of true is returned.
     // - If the last element of an existing selection is chosen,
     //   then a true will be returned with that section being removed
     //   from current selection.
     //////////////////////////////////////////////////////////////
     function processFurtherSectionClick(ipBtnId) {
//console.log("processFurtherSectionClick");
       var retVal = false;
       var btnId = +ipBtnId;

//       console.log("Begin of processFurtherSectionClick() : _chosenBtnArr :");
//       console.log(_chosenBtnArr);

       var lenArr = _chosenBtnArr.length;
       if(lenArr == 0) {
          _chosenBtnArr.push(btnId);
          retVal = true;
       } else if (btnId == _chosenBtnArr[0]) {
          // the left most has been clicked
          // which is already chosen. So deselect it.
          _chosenBtnArr = _chosenBtnArr.splice(1, lenArr-1);
          retVal = true;
       } else if (btnId == _chosenBtnArr[lenArr-1]) {
          // the right most has been clicked
          // which is already chosen. So deselect it.
          _chosenBtnArr.pop();
          retVal = true;
       } else if (btnId == _chosenBtnArr[0] - 1) {
          // section left of the current selection chosen.
          _chosenBtnArr.unshift(btnId);
          retVal = true;
       } else if (btnId == _chosenBtnArr[lenArr-1] + 1) {
          // section right of the current selection chosen.
          _chosenBtnArr.push(btnId);
          retVal = true;
       } else if (btnId < _chosenBtnArr[0] || btnId > _chosenBtnArr[lenArr-1]) {
          // New selection has been made, clear the rest of the selections
          // and chose this section afresh
          resetSelection();
          _chosenBtnArr.push(btnId);
          retVal = true;
       } else {
         // chosen somewhere in the middle
         window.alert("A section in the middle of a selection has been clicked.");
         retVal = false;
       }


//       console.log("End of processFurtherSectionClick() : _chosenBtnArr :");
//       console.log(_chosenBtnArr);

       return retVal;
     }

     //////////////////////////////////////////////////////////////
     // resetSelection()
     // Unselects every selection
     //////////////////////////////////////////////////////////////
     function resetSelection() {
//console.log("resetSelection");
        for (i = 0; i < _chosenBtnArr.length; i++) {
          var btnObj = _secRefArr[_chosenBtnArr[i]];
          btnObj.className = 'secButton';
        }

        _chosenBtnArr.splice(0, _chosenBtnArr.length);
     }





     //////////////////////////////////////////////////////////////
     // Section play/pause button call back
     //////////////////////////////////////////////////////////////
     $(document).ready(function() {
         var icon = $('.play');
         icon.click(function() {
         icon.toggleClass('active');
         return false;
       });
     });


	 //////////////////////////////////////////////////////////////
	 // handleEndAudio()
	 //
	 // - call back for end of audio
     //////////////////////////////////////////////////////////////
	 function handleEndAudio(mediaElement) {
		 _playsStatus = "notplaying";
		 showPlay();
	 }

     //////////////////////////////////////////////////////////////
     // sleep()
     //////////////////////////////////////////////////////////////
     function sleep(milliSecs) {
//console.log("sleep");
        setTimeout(doNothing, milliSecs);
     }

     //////////////////////////////////////////////////////////////
     // doNothing()
     //////////////////////////////////////////////////////////////
     function doNothing() {
     }

     //////////////////////////////////////////////////////////////
     // Call back for play/pause button
     //////////////////////////////////////////////////////////////
     $(document).ready(function(){
        $("#plays_btn").click(function(){
			if (_playsStatus == "notplaying") {
				_playsStatus = "playing";
				if(_chosenBtnArr != null && _chosenBtnArr.length > 0) {
					var start = "";
					var end = "";
					
					if(!_tutorFile) {
						start = _secDtlsArrDisplay[_chosenBtnArr[0]].startTime;
                    	end = _secDtlsArrDisplay[_chosenBtnArr[_chosenBtnArr.length-1]].endTime;
					} else {
						start = getTimingForText(_secDtlsArrDisplay[_chosenBtnArr[0]].text, "S");
						end = getTimingForText(_secDtlsArrDisplay[_chosenBtnArr[_chosenBtnArr.length-1]].text, "E");
					}
					playAudioRanges(start, end);
						
					
				} else {
					_mediaElementRef.play();
				}

                showPause();
			} else {
				_mediaElementRef.pause();
				_playsStatus = "notplaying";
                showPlay();
			}

			//_lastKnownRepeatStatus = _repeatStatus;
        });
     });

	 //////////////////////////////////////////////////////////////
     // Call back for repeat button
     //////////////////////////////////////////////////////////////
     $(document).ready(function(){
        $("#repeat_btn").click(function(){

		// If sections have been chosen, no playing around with this
		 // button
		if(_chosenBtnArr.length != null && _chosenBtnArr.length > 0) {
		 return;
		}

		if (_repeatStatus == "noRepeat") {
				_repeatStatus = "repeatChapter";
			} else if(_repeatStatus == "repeatChapter") {
				_repeatStatus = "repeatOne";
			} else {
				_repeatStatus = "noRepeat";
			}
			updateRepeatButtonStatus(_repeatStatus);
			_lastKnownRepeatStatus = _repeatStatus;

			console.log("_repeatStatus : " + _repeatStatus + "\tlastKnown : " + _lastKnownRepeatStatus);

        });
     });

	 //////////////////////////////////////////////////////////////
	 // updateRepeatButtonStatus()
	 //////////////////////////////////////////////////////////////
	 function updateRepeatButtonStatus(status) {
         //console.log("updateRepeatButtonStatus()");
		if (status == "repeatChapter") {
			$('#repeat_btn').attr('src','bg/icons/ic_repeat_white_24dp.png');
		} else if(status == "repeatOne") {
			$('#repeat_btn').attr('src','bg/icons/ic_repeat_one_white_24dp.png');
		} else {
			$('#repeat_btn').attr('src','bg/icons/ic_repeat_black_24dp.png');
		}
	 }

	 //////////////////////////////////////////////////////////////
	 // setLastKnownRepeatStatus()
	 //////////////////////////////////////////////////////////////
	 function setLastKnownRepeatStatus() {
//console.log("setLastKnownRepeatStatus");
		 console.log("setLast() : _repeatStatus : " + _repeatStatus + "\tlastKnown : " + _lastKnownRepeatStatus);
		 _repeatStatus = _lastKnownRepeatStatus;
		 updateRepeatButtonStatus(_repeatStatus);
	 }

	 //////////////////////////////////////////////////////////////
     // Call back for next button
     //////////////////////////////////////////////////////////////
     $(document).ready(function(){
        $("#next_btn").click(function(){

        });
     });


	 //////////////////////////////////////////////////////////////
     // Call back for prev button
     //////////////////////////////////////////////////////////////
     $(document).ready(function(){
        $("#prev_btn").click(function(){
			if (_currentIndex > 0) {
				_currentIndex -= 2;

			}
        });
     });
    
	 function showPlay() {
		 $('#plays_btn').attr('src','bg/icons/ic_play_circle_outline_white_24dp.png');
	 }

	 function showPause() {
		 $('#plays_btn').attr('src','bg/icons/ic_pause_circle_outline_white_24dp.png');
	 }

function sliderPlayRange(slSt, slEnd) {
	if(_tutorFile)
		sliderPlayRangeTu(slSt, slEnd);
	else
		sliderPlayRangePl(slSt, slEnd);
}

function tmUpdLsr(mediaElement) {
	if(_tutorFile)
		tmUpdLsrTu(mediaElement);
	else
		tmUpdLsrPl(mediaElement);
}

     //////////////////////////////////////////////////////////////
     // playAudioRanges()
     // Common function for range or section play back
     //////////////////////////////////////////////////////////////
     function playAudioRanges(start, end) {
		 
		if(_tutorFile)
			playAudioRangesTu(start, end);
		else
			playAudioRangesPl(start, end);
     }