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
		 parseShlokaFromJSONFile("./" + selChap + "/chapter.json");

		 _mediaElementRef.src = "./" + selChap + "/chapter.mp3";
		 _mediaElementRef.load();

         showPause();
		 _mediaElementRef.play();

         $('#stLine').prop('disabled', false);
         $('#endLine').prop('disabled', false);

         _stLn = 0;
         _endLn = +_nbrOfLines;
         _stPlayLn = 0;
         _endPlayLn = +_nbrOfLines;
	 }


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

        });
    });


	function sliderPlayRange(slSt, slEnd) {

		_pagePlayLine = slSt;
		
		getShlokaStartTmAndWrdCnt(_pagePlayLine);
		_curTime = _currPlayShlokaStartTime;
		_mediaElementRef.currentTime = _currPlayShlokaStartTime;
		if(_tutorialMode) {
			_currRepeatGoing = _word;
		}
		
//        for (i=slSt; i <= slEnd; i++) {
//            var shl = _entireChapterData.shloka[i];
//		    var numEntries = shl.entry.length;
//			var stPos;
//			var endPos;
//
//            if(i == slSt) {
//                stPos = +shl.entry[0].startTime;
//            }
//            if(i == slEnd) {
//		      endPos = +shl.entry[numEntries-1].endTime;
//            }
//        }
//		if(endPos != _endPos) {
//			_endPos = endPos;
//		}
//		if(stPos != _startPos) {
//			_startPos = stPos;
//			//gotoNext(_startPos, _endPos);
//		}
//        console.log("_startPos  " + _startPos + " endPos " + _endPos);
	 }

    function getCurrentPlayLineInShloka(currTime, aNbr) {
        //console.log("getCurrentLine" + currTime);

        for (i=_stLn; i < _endLn; i++) {
            var shl = _entireChapterData.shloka[i];
		    var numEntries = shl.entry.length;

            var stTm  = +shl.entry[0].startTime;
            var endTm = +shl.entry[numEntries-1].endTime;

            for(m=0;m<numEntries;m++){
                if(shl.entry[m].teacher == 'Y')
                    endTm = +shl.entry[m].endTime;
            }

            if(currTime >= stTm && currTime < endTm) {
                _currPlayShlokaEndTime = endTm;
                _currPlayShlokaStartTime = stTm;
				//_currPlayLineEndTime = endTm; // dummy assignment to pass the next line if cond

				for(k=0; k<numEntries; k++) {

					var lstTm  = shl.entry[k].startTime;
					var lendTm = shl.entry[k].endTime;
                    var lTea = shl.entry[k].teacher;

                    if(lTea == 'Y') {
						if(aNbr == 2) {
							if(shl.entry[k].swhtsp == _p && shl.entry[k+1].swhtsp == _empty) {
							   		_currPlayLineStartTime = lstTm;
									_currPlayLineEndTime = shl.entry[k+1].endTime;
									_currPlayLineInShloka = 2;
							 }

						} else {
							if ((shl.entry[k].text.includes(Sanscript.t("उवाच", "devanagari", _lang)) && shl.entry[k].swhtsp == _l) || (k != 0 && shl.entry[k].swhtsp == _p && !shl.entry[k-1].text.includes(Sanscript.t("उवाच", "devanagari", _lang))) || (k == 0 && shl.entry[k].swhtsp == _p ) )  {

									_currPlayLineStartTime = lstTm;
									if(_currPlayLineStartTime == _currPlayShlokaStartTime)
										_currPlayLineInShloka = 1;
									else
										_currPlayLineInShloka = 2;
									continue;
							}

							if(shl.entry[k].swhtsp == _l || shl.entry[k].swhtsp == _empty)  {
								if(currTime < shl.entry[k].endTime) {
									_currPlayLineEndTime = shl.entry[k].endTime;
									break;
								}
							}
						}
                    }
				}
				break;
            }
        }


		 for (i=_stLn; i < _endLn; i++) {
            var shl = _entireChapterData.shloka[i];
		    var numEntries = shl.entry.length;
            var stTm  = +shl.entry[0].startTime;
            var endTm = +shl.entry[numEntries-1].endTime;
            var mm = true;
            var stTm2  = +shl.entry[0].startTime;

            for(m=0;m<numEntries;m++){
                if(shl.entry[m].teacher == 'N'){
                    if(mm) {
                        stTm2 = +shl.entry[m].startTime;
                        mm = false;
                    }
                    endTm = +shl.entry[m].endTime;
                }
            }

            if(currTime >= stTm && currTime < endTm) {
                _currPlayShlokaEndTimeStu = endTm;
                _currPlayShlokaStartTimeStu = stTm2;
				//_currPlayLineEndTime = endTm; // dummy assignment to pass the next line if cond

				for(k=0; k<numEntries; k++) {

					var lstTm  = shl.entry[k].startTime;
					var lendTm = shl.entry[k].endTime;
                    var lTea = shl.entry[k].teacher;

                    if(lTea == 'N') {
						if(aNbr == 2) {
						   	if(shl.entry[k].swhtsp == _p && shl.entry[k+1].swhtsp == _empty) {
							   		_currPlayLineStartTimeStu = lstTm;
									_currPlayLineEndTimeStu = shl.entry[k+1].endTime;
									_currPlayLineInShloka = 2;
							 }
						 } else {
							if ((shl.entry[k].text.includes(Sanscript.t("उवाच", "devanagari", _lang)) && shl.entry[k].swhtsp == _l) || (k != 0 && shl.entry[k].swhtsp == _p && !shl.entry[k-1].text.includes(Sanscript.t("उवाच", "devanagari", _lang))) || (k == 0 && shl.entry[k].swhtsp == _p ) )  {

									_currPlayLineStartTimeStu = lstTm;
									if(_currPlayLineStartTimeStu == _currPlayShlokaStartTimeStu)
										_currPlayLineInShloka = 1;
									else
										_currPlayLineInShloka = 2;
									continue;
							}

							if(shl.entry[k].swhtsp == _l || shl.entry[k].swhtsp == _empty)  {
								if(currTime < shl.entry[k].endTime) {
									_currPlayLineEndTimeStu = shl.entry[k].endTime;
									break;
								}
							}
						}
                    }
				}
				break;
            }
        }

        //console.log("_playLine  " + _playLine);
	 }


	function getShlokaStartTmAndWrdCnt(lineNumber) {

		var shl = _entireChapterData.shloka[lineNumber];
		var numEntries = shl.entry.length;

		var stTm = shl.entry[0].startTime;
		var endTm = +shl.entry[numEntries-1].endTime;


        for(m=0;m<numEntries;m++){
            if(shl.entry[m].teacher == 'Y')
                endTm = +shl.entry[m].endTime;
        }
		_currPlayShlokaStartTime = stTm;
        _currPlayShlokaEndTime = endTm;

        _currPlayLineStartTime = stTm;

        var mm = true;

        for(m=0;m<numEntries;m++){
            if(shl.entry[m].teacher == 'N'){
                if(mm) {
                    stTm = +shl.entry[m].startTime;
                    mm = false;
                }
                endTm = +shl.entry[m].endTime;
            }
        }
        _currPlayShlokaEndTimeStu = endTm;
        _currPlayShlokaStartTimeStu = stTm;


		var wrdCnt = 0;
		for(i=0;i<lineNumber;i++) {
			var shl1 = _entireChapterData.shloka[i];
			var numEntries = shl1.entry.length;

			wrdCnt = wrdCnt + (numEntries/2);
		}

		_currWrdPos = wrdCnt;
	}

    function getCurrentLine(currTime) {
        //console.log("getCurrentLine" + currTime);
        _insideF = true;

        for (i=_stLn; i < _endLn; i++) {
            var shl = _entireChapterData.shloka[i];
		    var numEntries = shl.entry.length;
            var stTm  = +shl.entry[0].startTime;
            var endTm = +shl.entry[numEntries-1].endTime;

			if(shl.entry[numEntries-1].text.includes('||')) {
				_nbrOfLineInShloka = 2;
			} else {
				_nbrOfLineInShloka = 1;
			}

            if(currTime > stTm && currTime < endTm) {
                _playLine = i;
                //_currPlayShlokaEndTime = endTm;
                //_currPlayShlokaStartTime = stTm;
				_currentIndex = _playLine;
				if(shl.entry[0].swhtsp == _empty) {
				   _oneLine = true;
				 } else {
				   _oneLine = false;
				 }
				break;
            }
        }
        //console.log("_playLine  " + _playLine);
	 }

    function playRangeText() {
        //console.log("playRangeText");
        //console.log("_stPlayLn  " + _stPlayLn + " _endPlayLn " + _endPlayLn);
        console.log("_stLn  " + _stLn + " _endLn " + _endLn);
		 if (_secDtlsArr != null) { //empty it out
			 _secDtlsArr.splice(0, _secDtlsArr.length);
		 }

        if (_secDtlsArrMng != null) { //empty it out
			 _secDtlsArrMng.splice(0, _secDtlsArrMng.length);
		 }

        for (i=_stLn; i < _endLn; i++) {
            var shl = _entireChapterData.shloka[i];
            var shlMng = _entireChapterDataMng.shloka[i];
		    var numEntries = shl.entry.length;

            if(i == _stLn) {
                _startPos = +shl.entry[0].startTime;
            }
            if(i == (_endLn-1)) {
		      _endPos = +shl.entry[numEntries-1].endTime;
            }

            for (j=0; j < numEntries; j++) {
                _secDtlsArr.push({
                  text    : shl.entry[j].text,
                  startTime  : shl.entry[j].startTime,
                  endTime : shl.entry[j].endTime,
                  swhtsp  : shl.entry[j].swhtsp
                });

                _secDtlsArrMng.push({
                  text    : shlMng.entry[j].text,
                  startTime  : shlMng.entry[j].startTime,
                  endTime : shlMng.entry[j].endTime,
                  swhtsp  : shlMng.entry[j].swhtsp
                });
             }
        }
        console.log("_startPos  " + _startPos + " _endPos " + _endPos);
	 }

	function populateAllSholkas() {

		 if (_secDtlsArrDisplay != null) { //empty it out
			 _secDtlsArrDisplay.splice(0, _secDtlsArrDisplay.length);
		 }

		 if (_secDtlsArrDisplayStu != null) { //empty it out
			 _secDtlsArrDisplayStu.splice(0, _secDtlsArrDisplayStu.length);
		 }

        for (i=0; i < _entireChapterData.shloka.length; i++) {
            var shl = _entireChapterData.shloka[i];
		    var numEntries = shl.entry.length;

            for (j=0; j < numEntries; j++) {
				if(shl.entry[j].teacher == "Y") {
					_secDtlsArrDisplay.push({
					  text    : shl.entry[j].text,
					  startTime  : shl.entry[j].startTime,
					  endTime : shl.entry[j].endTime,
					  swhtsp  : shl.entry[j].swhtsp
					});
				}
				if(shl.entry[j].teacher == "N") {
					_secDtlsArrDisplayStu.push({
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
     // displayShloka()
     //////////////////////////////////////////////////////////////
     function displayShloka(index) {
          //console.log("displayShloka()");
//         _stLn = +index;
//         _endLn = +index + (+_nbrOfLines);
         if(_endLn > _numShlokasInChap) {
             _endLn = _numShlokasInChap;
         }

//         populateSectionArr(index);
         //playRangeText();
		 removeNonTextFromSecRefs();
         displayShlokaInitial();

         populateSecnsRefs();

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

     function displayShlokaMng(index) {
          var bigStr = "";
       var secId = 0;
       for (i = 0; i < _secDtlsArrMng.length; i++) {
          var secDtls = _secDtlsArrMng[i];
          if ($.trim(secDtls.startTime) == "") {
            bigStr += "<span>";
            bigStr += secDtls.text;
            bigStr += "</span>";
          } else {
//            bigStr += "<button class=\"secButton\" id=\"" + secId + "\" onclick=\"secBtnPressed('" + secId + "')\">";
            bigStr += secDtls.text;
//            bigStr += "</button>"
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
               bigStr += "<p>";
               break;
             default:
               break;
          }
       }

       document.getElementById("shlokaMeaning").innerHTML = bigStr;
     }

	 //////////////////////////////////////////////////////////////
	 // populateSectionArr()
	 //////////////////////////////////////////////////////////////
	 function populateSectionArr(indx) {
         //console.log("populateSectionArr()");
		 var index = +indx;
		 if (_secDtlsArr != null) { //empty it out
			 _secDtlsArr.splice(0, _secDtlsArr.length);
		 }

        if (_secDtlsArrMng != null) { //empty it out
			 _secDtlsArrMng.splice(0, _secDtlsArrMng.length);
		 }


		 var shl = _entireChapterData.shloka[index];
          var shlMng = _entireChapterDataMng.shloka[index];
		 var numEntries = shl.entry.length;

		 for (i=0; i < numEntries; i++) {
			_secDtlsArr.push({
			  text    : shl.entry[i].text,
			  startTime  : shl.entry[i].startTime,
			  endTime : shl.entry[i].endTime,
			  swhtsp  : shl.entry[i].swhtsp
		    });
            _secDtlsArrMng.push({
			  text    : shlMng.entry[i].text,
			  startTime  : shlMng.entry[i].startTime,
			  endTime : shlMng.entry[i].endTime,
			  swhtsp  : shlMng.entry[i].swhtsp
		    });
		 }

 		 _startPos = +shl.entry[0].startTime;
		 _endPos = +shl.entry[numEntries-1].endTime;
	 }


     //////////////////////////////////////////////////////////////
     // removeNonTextFromSecRefs()
     // Initial section details has punctuation marks or content
     // that is not part of the shloka words. So, get rid of those
     // in the array.
     //////////////////////////////////////////////////////////////
     function removeNonTextFromSecRefs() {
         //console.log("removeNonTextFromSecRefs");
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
     function highlightSec(curTime) {
//         console.log("highlightSec");
        var sec = 0;
        var secFound = false;
        var secDtlsLen = _secDtlsArrDisplay.length;

        for (sec = 0; sec < secDtlsLen; sec++) {
           if (curTime < _secDtlsArrDisplay[sec].endTime) {
              secFound = true;
              break;
           }
        }

        if (!secFound) {
           sec = secDtlsLen-1;
        }
         if(sec != -1)
            highlightCurSec(sec);
     }

    function highlightSecStu(curTime) {
//         console.log("highlightSec");
        var sec = 0;
        var secFound = false;
        var secDtlsLen = _secDtlsArrDisplayStu.length;

        for (sec = 0; sec < secDtlsLen; sec++) {
           if (curTime < _secDtlsArrDisplayStu[sec].endTime) {
              secFound = true;
              break;
           }
        }

        if (!secFound) {
           sec = secDtlsLen-1;
        }
         if(sec != -1)
            highlightCurSec(sec);
     }

     //////////////////////////////////////////////////////////////
     // highlightCurSec(sec)
     //////////////////////////////////////////////////////////////
     function highlightCurSec(sec) {
//console.log("highlightCurSec");
		 if(!_oneLine) {
			if (_teacher && _prevHighlightedSec == sec) {
			  return;
			} else {
			  unhighlightPrevSec(_prevHighlightedSec);
			  _prevHighlightedSec = sec;
			}
		 }
        var secObj = _secRefArr[sec];
        if(secObj != null){
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
     function unhighlightPrevSec(sec) {
//console.log("unhighlightPrevSec");
        if (sec < 0) return;
        var secObj = _secRefArr[sec];
        if (secObj != null) {
             secObj.style.color = "black";
        	secObj.style.fontWeight = "inherit";
        }
     }


     //////////////////////////////////////////////////////////////
     // populateSecnsRefs()
     // - Prepopulate the references to the shlokla sections.
     // - Prepopulate the texts of the corresponding sections above.
     //
     // Above data will be useful
     //   - While selecting contiguous sections.
     //   - For highlighting appropriate section while the audio
     //     is running.
     //////////////////////////////////////////////////////////////
     function populateSecnsRefs() {
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
		 setMaxValForShlokaBox(_numShlokasInChap-2);
         //$('#stLine').attr('max', _numShlokasInChap-2);
         //$('#endLine').attr('max', _numShlokasInChap-2);
//         $('#nbrOfLines').attr('max', _numShlokasInChap-2);

         _shlokaStartTime = +_entireChapterData.shloka[0].entry[0].startTime;
		 _shlokaEndTime = _entireChapterData.shloka[_numShlokasInChap-1].entry[_entireChapterData.shloka[_numShlokasInChap-1].entry.length - 1].endTime;

         populateAllSholkas();

         displayShloka(_currentIndex);
         //displayShlokaMng(0);
	 }


	 //////////////////////////////////////////////////////////////
	 //
	 //////////////////////////////////////////////////////////////
	 function setMaxValForShlokaBox(numShlokas) {
		 if(numShlokas > 0) {
		 	createSlider(1, numShlokas);
		 }
	 }



     //////////////////////////////////////////////////////////////
     // displayShlokaInitial()
     //////////////////////////////////////////////////////////////
     function displayShlokaInitial() {
       // console.log(bigStr);
         displayShlokaInitialPP();

         //var container = document.querySelector('.shloka-display')
        //container.classList.add('pre-animation');
        //setTimeout(function(){
            //container.classList.remove('pre-animation')
         //},100);
     }

    function displayShlokaInitialPP() {
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

                bigStr += "<button class=\"secButton\" id=\"" + secId + "\" onclick=\"secBtnPressed('" + secId + "')\">";

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
               bigStr += "<p>";
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
     // playAudioRanges()
     // Common function for range or section play back
     //////////////////////////////////////////////////////////////
     function playAudioRanges(start, end) {
          console.log("playAudioRanges()");
           _startPos   = +start;
           _endPos   = +end;

           _mediaElementRef.currentTime = _startPos;
           _mediaElementRef.play();
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
					var start = _secDtlsArrDisplay[_chosenBtnArr[0]].startTime;
                    var end = _secDtlsArrDisplay[_chosenBtnArr[_chosenBtnArr.length-1]].endTime;
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

	 function showPlay() {
		 $('#plays_btn').attr('src','bg/icons/ic_play_circle_outline_white_24dp.png');
	 }

	 function showPause() {
		 $('#plays_btn').attr('src','bg/icons/ic_pause_circle_outline_white_24dp.png');
	 }

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


     function resetToStarting() {
         console.log("resetToStarting...");
            _stLn = 0;
            _endLn = _nbrOfLines;
            _stPlayLn = 0;
            _endPlayLn = _endLn;
            _gCounter = 0;
            _playLine = 0;
            _insideF = false;
		 	$('#shloka-display').removeClass('shloka-display').addClass('shloka-display');
            displayShloka(0);
            displayShlokaMng(0);
           _mediaElementRef.currentTime = _shlokaStartTime;
     }


     function test() {
         console.log("resetToStarting...");
		 	_stLn = 2;
		 	_endLn = _stLn + _nbrOfLines;
		 	getShlokaStartTmAndWrdCnt(_stLn);
		 	getCurrentLine(_currPlayLineStartTime);
		 	_mediaElementRef.currentTime = _currPlayLineStartTime;
            displayShloka(0);
            displayShlokaMng(0);
		 	moveToPos = (_stLn * 100);
			$('#shloka-display').animate({
				'marginTop' : '-=' + moveToPos //moves up
			});
     }


     //////////////////////////////////////////////////////////////
     // tmUpdLsr()
     // Time update listener for the media player.
     // IMPORTANT FUNCTION.
     //////////////////////////////////////////////////////////////
     function tmUpdLsr(mediaElement) {

		 if(_testingMode && _gCounter == 0) {
			 //test();
			 _gCounter++;
		 }

        _curTime = mediaElement.currentTime;

        if((_tutorialMode && !_modeChanged) || _currRepeatGoing == _para) {
            //logic for tutorial functionality
            playTutorialNew(_curTime);
        } else if(!_tutorialMode){
			playTutorialNonTutorialMd(_curTime)
		}

        if(_teacher)
            highlightSec(_curTime);

        if(_student)
            highlightSecStu(_curTime);

          if(_repeatStatus == "repeatOne"  && _curTime > _endPos) {
			_mediaElementRef.currentTime = _startPos;
          }


       _logMsg =  " Playing Line number: " + (_playLine + 1) + " | Number of Shlokas: " + _numShlokasInChap;
	   _logMsg = _logMsg + " | _currRepeatGoing = " + _currRepeatGoing;

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

        if(_prevPlayLine != _playLine) {
            _prevPlayLine = _playLine;
			_currPlayLineInShloka = 0;
           // $('.shloka-displayWrapper').rollup({speed:18000});
        }

       if (_playLine > (_stLn + _endLn)/2 && !_insideF && _endLn < _numShlokasInChap) {
           _gCounter++;
           _stLn++;
           _endLn++;
           _insideF = true;
           //displayShloka(0);
           _insideF = false;
		   tmpPos = 150;
           $('#shloka-display').animate({
                'marginTop' : '-=' + tmpPos //moves up
                });
       }

       if(_curTime > 2 && !_insideF) {
          getCurrentLine(_curTime);
       }

       _insideF = false;

       if (_curTime > _shlokaEndTime) {
            //resetToStarting();
       }
     }


/////// TUTORIAL FUNCTIONALITY
    function playTutorialNew(curTm) {

        //Word by word repeation with exception of Uvaca
        if(_currRepeatGoing == _word && ((_teacher && curTm > _secDtlsArrDisplay[_currWrdPos].endTime) || (_student && curTm > _secDtlsArrDisplayStu[_currWrdPos].endTime))) {

            if(_onlyOnceTeacher || _onlyOnceStudent) {
                getCurrentPlayLineInShloka(curTm, 0);
                if(_teacher)
                    _onlyOnceTeacher = false;
                if(_student)
                    _onlyOnceStudent = false;
            }
			if(_secDtlsArrDisplay[(_currWrdPos)].text.includes(Sanscript.t("उवाच", "devanagari", _lang))) {
				_uvacha = true;
			}

            if(exceptionToContinue()) {
                return false;
            }
            if(_teacher) {
                _teacher = false;
                _student = true;
                //_mediaElementRef.volume = _studenVolume;
                _currStudentRptCntr = 0;
                 if(_uvacha && _secDtlsArrDisplayStu[(_currWrdPos-1)].text.includes(Sanscript.t("उवाच", "devanagari", _lang))) {
                     _mediaElementRef.currentTime = _secDtlsArrDisplayStu[(_currWrdPos-1)].startTime;
					 _uvacha = false;
                 } else {
                    _mediaElementRef.currentTime = _secDtlsArrDisplayStu[_currWrdPos].startTime;
                 }
                //console.log(_secDtlsArr[_currWrdPos])
            } else if(_student) {
                _currStudentRptCntr++;
                if(_currStudentRptCntr < _studentRepeat) {
                    if(_uvacha && _secDtlsArrDisplay[(_currWrdPos-1)].text.includes(Sanscript.t("उवाच", "devanagari", _lang))) {
                        _mediaElementRef.currentTime = _secDtlsArrDisplayStu[(_currWrdPos-1)].startTime;
						_uvacha = false;
                    } else {
                        _mediaElementRef.currentTime = _secDtlsArrDisplayStu[_currWrdPos].startTime;
                    }
                } else {
                    _teacher = true;
                    _student = false;
                    //_mediaElementRef.volume = _teacherVolume;
                    _prevSwhtsp = _currSwhtsp;

                    if(_currWrdPos < (_wordCnt -1))
                        _currWrdPos++;

                    _currSwhtsp = _secDtlsArrDisplay[_currWrdPos].swhtsp;
                    _mediaElementRef.currentTime = _secDtlsArrDisplay[_currWrdPos].startTime;

                    if(_prevSwhtsp == _empty) {

						if(_oneLine && curTm > _shlokaEndTime) {
							resetToStarting();
							//break;
						} else {

							_mediaElementRef.currentTime = _currPlayShlokaStartTime;

							if(_nbrOfLineInShloka == 1) {
								_currRepeatGoing = _sholka;
                            } else {
								_currRepeatGoing = _line; //end of sholka
								curTm = _currPlayShlokaStartTime;
								getCurrentPlayLineInShloka(curTm, 0);
							}
							_currStudentRptCntr = 0;
							curTm = _currPlayShlokaStartTime;
						}
                    }
                }
            }

        }

    //Line repeation
        if(_currRepeatGoing == _line && ((_teacher && curTm > _currPlayLineEndTime) || (_student && curTm > _currPlayLineEndTimeStu))) {
			if(_teacher) {
                _teacher = false;
                _student = true;
                //_mediaElementRef.volume = _studenVolume;
                _mediaElementRef.currentTime = _currPlayLineStartTimeStu;
                _currStudentRptCntr = 0;
            } else if(_student) {
                _currStudentRptCntr++;
                if(_currStudentRptCntr < _studentRepeat) {
                    _mediaElementRef.currentTime = _currPlayLineStartTimeStu;
                } else {
                    _teacher = true;
                    _student = false;
                    //_mediaElementRef.volume = _teacherVolume;

                    if(_currPlayLineInShloka != 2 && curTm > _currPlayLineEndTimeStu) {
                        	curTm = _currPlayLineStartTime;
							getCurrentPlayLineInShloka(curTm, 2);
							_mediaElementRef.currentTime = _currPlayLineStartTime;
                    } else {
                           	_currRepeatGoing = _sholka;
						   	_mediaElementRef.currentTime = _currPlayShlokaStartTime;
							curTm = _currPlayShlokaStartTime;
                   	}

                }
            }
        }


    //sholka repeation
        if(_currRepeatGoing == _sholka && ((_teacher && curTm > _currPlayShlokaEndTime) || (_student && curTm > _currPlayShlokaEndTimeStu))) {
            if(_teacher) {
                _teacher = false;
                _student = true;
                //_mediaElementRef.volume = _studenVolume;
                _mediaElementRef.currentTime = _currPlayShlokaStartTimeStu;
                _currStudentRptCntr = 0;
            } else if(_student) {
                _currStudentRptCntr++;
                if(_currStudentRptCntr < _studentRepeat) {
                    _mediaElementRef.currentTime = _currPlayShlokaStartTimeStu;
                } else {
                    _teacher = true;
                    _student = false;
                    //_mediaElementRef.volume = _teacherVolume;

                    if(_pagePlayLine < (_numShlokasInChap)) {
                        _currRepeatGoing = _word; //end of the sholka
                        _pagePlayLine++;
                        _onlyOnceStudent = true;
                        _onlyOnceTeacher = true;
                        getShlokaStartTmAndWrdCnt(_pagePlayLine);
                        _mediaElementRef.currentTime = _currPlayShlokaStartTime;
                        curTm = _currPlayShlokaStartTime;
                    } else {
                        _modeChanged = true; //end of the page
                        _pageNumber++;
                        _pagePlayLine = 0;
                        if(_playLine == (_numShlokasInChap - 1)) {
//                            _pageNumber = 1;
//                            _currRepeatGoing = _para;
//                            curTm = _shlokaEndTime;

							_currRepeatGoing = _word;
                            curTm = 0;
                            _mediaElementRef.currentTime = 0;
                        }
                    }
                }
            }
        }


    // all shloka's repeation
        if(_currRepeatGoing == _para && curTm > _shlokaEndTime) {
             if(_teacher) {
                _teacher = false;
                _student = true;
                //_mediaElementRef.volume = _studenVolume;
                _mediaElementRef.currentTime = _shlokaStartTime;
                _currStudentRptCntr = 0;
            } else if(_student) {
                _currStudentRptCntr++;
                if(_currStudentRptCntr < _studentRepeat) {
                    _mediaElementRef.currentTime = _shlokaStartTime;
                } else {
                     _teacher = true;
                     _student = false;
                     //_mediaElementRef.volume = _teacherVolume;
                     _currRepeatGoing = _word;
                     _pagePlayLine = 0;
                     _modeChanged = true;  //finished one round of tutorial
                }
            }
        }

    }


function exceptionToContinue() {
    if((_teacher && _secDtlsArrDisplay[_currWrdPos].text.includes(Sanscript.t("उवाच", "devanagari", _lang))) || (_student && _secDtlsArrDisplayStu[_currWrdPos].text.includes(Sanscript.t("उवाच", "devanagari", _lang)))) {
        _currWrdPos++;
        return true;
    }
    else
        return false;
}

function playTutorialNonTutorialMd(curTm) {

	if(_onlyOnceTeacher) {
		getShlokaStartTmAndWrdCnt(0);
		_onlyOnceTeacher = false;
	}
	if(curTm > _currPlayShlokaEndTime) {
		getShlokaStartTmAndWrdCnt(++_pagePlayLine);
		_mediaElementRef.currentTime = _currPlayShlokaStartTime;

	}

}
