     //////////////////////////////////////////////////////////////
     // GLOBAL VARIABLES
     //////////////////////////////////////////////////////////////
     var _sectionPressed = false;
     var _startPos   = 0;
     var _endPos   = 100000;
     var _secDtlsArr  = new Array();
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
     var _endLn = _nbrOfLines;
     var _stPlayLn = 0;
     var _endPlayLn = _endLn;
     var _gCounter = 0;
     var _playLine = 0;
     var _prevPlayLine = 0;
     var _insideF = false;
     var _lang = 'devanagari';
	 var _prevLang = 'devanagari';

     var _tutorialMode = false;
     
     var _repeatCounter = 1;
     var _TUTORIAL_REPEAT = 3;
     var _tutorialStartPos = 0;
     var _tutorialEndPos = 100000;
     var _tutorialLastRound = false;
     
     var _teacherVolume = 1;
     var _studenVolume = 0.3;

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
     var _sholka = "SHOLKA";
     var _para = "PARA";

     var _empty = "";
     var _n = "n";
     var _p = "p";
     var _l = "l";

     var _currRepeatGoing = _word; // [WORD --> SHOLKA --> PARA]

     var _currPlayLineEndTime = 0;
     var _currPlayLineStartTime = 0;
     var _modeChanged = false;
     var _pageNumber = 1;
     var _pagePlayLine = 0;
     var _shlokaStartTime = 0;
     var _shlokaEndTime = 100000;


     //////////////////////////////////////////////////////////////
     // code begin
     //////////////////////////////////////////////////////////////

     $(document).ready(init);

     //////////////////////////////////////////////////////////////
     // init()
     //////////////////////////////////////////////////////////////
     function init() {
         console.log("init");
       //$("#shloka").hide();
       //parseShloka();
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
	 
    function getCurrentLine(currTime) {
        //console.log("getCurrentLine" + currTime);
        _insideF = true;

        for (i=_stLn; i < _endLn; i++) {
            var shl = _entireChapterData.shloka[i];
		    var numEntries = shl.entry.length;
            var stTm  = +shl.entry[0].startTime;
            var endTm = +shl.entry[numEntries-1].endTime;
          //console.log("stTm  " + stTm + " endTm " + endTm);
            if(currTime > stTm && currTime < endTm) {
                _playLine = i;
                _currPlayLineEndTime = endTm;
                _currPlayLineStartTime = stTm;
            }
        }
        //console.log("_playLine  " + _playLine);
	 }

    function changeContentsDisplay() {
        console.log("changeContentsDisplay");
         lines = $("#nbrOfLines").val();
         if(lines != null && lines > 0) {
             _nbrOfLines = lines;
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
         console.log("chapSel");
         _numShlokasInChap = 0;
		 var selChap = $("#chapSel").val();
		 _currentChapter = selChap;
		 parseShlokaFromJSONFile("./" + selChap + "/chapter.json");
		 trasliterateChapter();
		 _mediaElementRef.src = "./" + selChap + "/chapter.mp3";
		 _mediaElementRef.load();
		 				
         showPause();
		 _mediaElementRef.play();
         
         $('#stLine').prop('disabled', false);
         $('#endLine').prop('disabled', false);

//         if(_entireChapterData != "")
//            tutorialTimeRange();

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
//    function tutorialTimeRange() {
//        
//		 if (_secDtlsArr != null) { //empty it out
//			 _secDtlsArr.splice(0, _secDtlsArr.length);
//		 }		 
//            
//         var numEntries = _entireChapterData.shloka.length;		 
//            
//          _tutorialStartPos = +_entireChapterData.entry[0].startTime;
//		  _tutorialEndPos = +_entireChapterData.entry[numEntries-1].endTime;	 
//    
//         console.log("_tutorialStartPos  " + _startPos + " _tutorialEndPos " + _endPos);
//	 
//    }
	 //////////////////////////////////////////////////////////////
	 // shlokaSel()
	 //////////////////////////////////////////////////////////////
    function shlokaSel() {
         console.log("shlokaSel");
		_currentIndex = $("#shlokaSel").val();
		gotoNextShloka();
	}
	 


    //////////////////////////////////////////////////////////////
	 // shlokaSelRange()
	 //////////////////////////////////////////////////////////////
    function shlokaSelRange() {
        console.log("shlokaSelRange");
        if(_currentChapter != "") {
            
            _stLn = $("#stLine").val();
            _endLn = $("#endLine").val();
            
            if(_stLn <= _numShlokasInChap && _endLn <= _numShlokasInChap) {
                $('#errorMsg').html("").removeClass("errorMsg");
                if(_stLn == "") {
                    _stLn = +1;
                }

                if(_endLn == "") {
                    _endLn = _stLn;
                } 

                
                if(_stLn <= _endLn) {        
                    _currentIndex = _stLn;
                    playRangeText();
                    gotoNext(_startPos, _endPos);
                }
                
            } else {
                var msg = "Please enter number less than the # of sholak's " + _numShlokasInChap;
                
                $('#errorMsg').html(msg).addClass("errorMsg");
            }
        }
	}

    function playRangeText() {
        console.log("playRangeText");
        console.log("_stLn  " + _stLn + " _endLn " + _endLn);
		 if (_secDtlsArr != null) { //empty it out
			 _secDtlsArr.splice(0, _secDtlsArr.length);
		 }		 
            
        for (i=_stLn; i < _endLn; i++) {
            var shl = _entireChapterData.shloka[i];
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
             }		 
        }
        console.log("_startPos  " + _startPos + " _endPos " + _endPos);
	 }

    function gotoNext(stTm, EndTm) {
            console.log("gotoNext");
            if(_currentIndex >= _numShlokasInChap) {
                if(_playsStatus != "noRepeat") {
                    _currentIndex = 0;
                }
            }

            //empty out any chosen sections
            _chosenBtnArr.splice(0, _chosenBtnArr.length);
            setLastKnownRepeatStatus();

            _mediaElementRef.pause(); sleep(200);
            
            displayShlokaNew(_currentIndex);

            _mediaElementRef.currentTime = stTm;
            // console.log("gotoNextShloka() :  " + _startPos + "   _mediaElementRef : " +  _mediaElementRef.currentTime);
            _startPos = stTm;
            _endPos = EndTm;
            highlightSec(_startPos);
            _mediaElementRef.play();
            console.log("later  " + _startPos + "   _mediaElementRef : " +  _mediaElementRef.currentTime + " endPos " + _endPos);
    }

     //////////////////////////////////////////////////////////////
     // displayShlokaNew()
     //////////////////////////////////////////////////////////////
     function displayShlokaNew(index) { 
        console.log("displayShlokaNew");
		 removeNonTextFromSecRefs();
         displayShlokaInitialNew();		 
         populateSecnsRefsNew();
		 _prevHighlightedSec = -1;
         refreshShlokas();
        _wordCnt = _secDtlsArr.length;
         _currSwhtsp = _secDtlsArr[_currWrdPos].swhtsp;
     }

     //////////////////////////////////////////////////////////////
     // displayShlokaInitial()
     //////////////////////////////////////////////////////////////
     function displayShlokaInitialNew() {
         console.log("displayShlokaInitialNew");
       var bigStr = "";
       var secId = 0;
       for (i = 0; i < _secDtlsArr.length; i++) {
          var secDtls = _secDtlsArr[i];
          if ($.trim(secDtls.startTime) == "") {
            bigStr += "<span>";
            bigStr += secDtls.text;
            bigStr += "</span>";
          } else {
            bigStr += "<button class=\"secButton\" id=\"" + secId + "\" onclick=\"secBtnPressed('" + secId + "')\">";
            bigStr += secDtls.text;
            bigStr += "</button>"
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

       console.log("bigStr " || bigStr.toString());
       document.getElementById("shloka-display").innerHTML = bigStr;
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
     function populateSecnsRefsNew() {
		 console.log("populateSecnsRefsNew");
	    if(_secRefArr != null) {
			_secRefArr.splice(0, _secRefArr.length);
		}

       for (var i = 0; i < _secDtlsArr.length; i++) {
         var secRef = document.getElementById("" + i);
         _secRefArr.push(secRef);
       }

       console.log("_secRefArr " || _secRefArr.length);
     }






     //////////////////////////////////////////////////////////////
     // displayShloka()
     //////////////////////////////////////////////////////////////
     function displayShloka(index) {
          console.log("displayShloka()");
         _stLn = +index;
         _endLn = +index + (+_nbrOfLines);
         if(_endLn > _numShlokasInChap) {
             _endLn = _numShlokasInChap;
         }
             
         populateSectionArr(index);
         playRangeText();
		 removeNonTextFromSecRefs();
         displayShlokaInitial();		 
         populateSecnsRefs();
		 _prevHighlightedSec = -1;
         refreshShlokas();
         
         _wordCnt = _secDtlsArr.length;
         _currWrdPos = 0;
         if(_currRepeatGoing != _para) {
            _currRepeatGoing = _word;
            _modeChanged = false;
         }
         _currSwhtsp = _secDtlsArr[_currWrdPos].swhtsp;
     }

	 //////////////////////////////////////////////////////////////
	 // gotoNextShloka()
	 //
	 //////////////////////////////////////////////////////////////	 
	 function gotoNextShloka() {
		 _methodInside = "gotoNextShloka()";
         console.log("gotoNextShloka");
	    _currentIndex = _endLn;
		if(_endLn >= _numShlokasInChap) {
			if(_playsStatus != "noRepeat") {
                _stLn = 0;
				_endLn = _nbrOfLines;
                _currentIndex = 0;
			}
		}
		
		//empty out any chosen sections
		_chosenBtnArr.splice(0, _chosenBtnArr.length);
		setLastKnownRepeatStatus();

		_mediaElementRef.pause(); sleep(200);
        displayShloka(_currentIndex);
		_mediaElementRef.currentTime = _startPos;
		// console.log("gotoNextShloka() :  " + _startPos + "   _mediaElementRef : " +  _mediaElementRef.currentTime);
		highlightSec(_startPos);
	    _mediaElementRef.play();
		console.log("later  " + _startPos + "   _mediaElementRef : " +  _mediaElementRef.currentTime + " endPos " + _endPos);
	 }

	 //////////////////////////////////////////////////////////////
	 // populateSectionArr()
	 //////////////////////////////////////////////////////////////
	 function populateSectionArr(indx) {
         console.log("populateSectionArr()");
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
		 
		 //console.log("CurrentIndex : " + _currentIndex + "  StartPos : " + _startPos + " EndPos : " + _endPos);

	 }
	 
	 
	 //////////////////////////////////////////////////////////////
	 // trasliterateChapter()
	 //
	 //////////////////////////////////////////////////////////////
	 function trasliterateChapter() {
		 // to be implemented
	 }
	 
	 	 
	 //////////////////////////////////////////////////////////////
	 // shlokaSel()
	 //
	 // - Call back for shloka selection dropdown
	 // - Navigates to a particular shloka within the chapter.
	 //////////////////////////////////////////////////////////////
//	 function shlokaSel() {
//		 
//	 }	 
	 
     //////////////////////////////////////////////////////////////
     // removeNonTextFromSecRefs()
     // Initial section details has punctuation marks or content
     // that is not part of the shloka words. So, get rid of those
     // in the array.
     //////////////////////////////////////////////////////////////
     function removeNonTextFromSecRefs() {
         console.log("removeNonTextFromSecRefs");
        for (var i = _secDtlsArr.length - 1; i >= 0; i--) {
           if (_secDtlsArr[i].startTime == "") {
             _secDtlsArr.splice(i, 1);
           }
        }

        console.log("_secDtlsArr " || _secDtlsArr.length);
     }

     //////////////////////////////////////////////////////////////
     // highlightSec()
     // - Highlights the current section being played 
     //////////////////////////////////////////////////////////////
     function highlightSec(curTime) {
//         console.log("highlightSec");
        var sec = 0;
        var secFound = false;
        var secDtlsLen = _secDtlsArr.length;

        for (sec = 0; sec < secDtlsLen; sec++) {
           if (curTime < _secDtlsArr[sec].endTime) {
              secFound = true;
              break;
           }
        }

        if (!secFound) {
           sec = secDtlsLen-1;
        }

        highlightCurSec(sec);
     }

     //////////////////////////////////////////////////////////////
     // highlightCurSec(sec)
     //////////////////////////////////////////////////////////////
     function highlightCurSec(sec) {
//console.log("highlightCurSec");
        if (_prevHighlightedSec == sec) {
          return;
        } else {
          unhighlightPrevSec(_prevHighlightedSec);
          _prevHighlightedSec = sec;
        }

        var secObj = _secRefArr[sec];
        if(_teacher)
            secObj.style.color = "blue";
         else if(_student)
            secObj.style.color = "brown";
        //secObj.style.fontWeight = "bold";
     }

     //////////////////////////////////////////////////////////////
     // unhighlightPrevSec(sec)
     //////////////////////////////////////////////////////////////
     function unhighlightPrevSec(sec) {
//console.log("unhighlightPrevSec");
        if (sec < 0) return;
        var secObj = _secRefArr[sec];
        if (secObj == null) {
            console.log(sec);
        }
        secObj.style.color = "inherit";
        secObj.style.fontWeight = "inherit";
     }


     //////////////////////////////////////////////////////////////
     // parseShloka()
     // This will need to be modified depending on how
     // the shloka text is acquired. Shloka can be acquired from 
     // within the MP3 itself or from the HTML body filled in at
     // server side.
     //////////////////////////////////////////////////////////////
     function parseShloka() {
console.log("parseShloka");
        // parseShlokaFromHTML();
        parseShlokaFromJSONFile("./bg/01/chapter.json");       

        //console.log(_secDtlsArr);
     
	 
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
console.log("populateSecnsRefs");
	    if(_secRefArr != null) {
			_secRefArr.splice(0, _secRefArr.length);
		}

       for (var i = 0; i < _secDtlsArr.length; i++) {
         var secRef = document.getElementById("" + i);
         _secRefArr.push(secRef);
       }

       //console.log(_secRefArr.length);
     }

	 
     //////////////////////////////////////////////////////////////
     // parseShlokaFromJSONFile()
     //////////////////////////////////////////////////////////////
	 function parseShlokaFromJSONFile(fileURI) {
console.log("parseShlokaFromJSONFile");
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

     //////////////////////////////////////////////////////////////
     // processJSONData()
     //////////////////////////////////////////////////////////////
	 function processJSONData(chapter) {
console.log("processJSONData");
		 _currentChapter = chapter.name;
		 var chapNum = chapter.chapterNum;
		 _numShlokasInChap = chapter.shloka.length; // includes header and end footer
		 _currentIndex = 0;
		 setMaxValForShlokaBox(_numShlokasInChap-2);
         $('#stLine').attr('max', _numShlokasInChap-2);
         $('#endLine').attr('max', _numShlokasInChap-2);
         $('#nbrOfLines').attr('max', _numShlokasInChap-2);
         
        // var shl = _entireChapterData.shloka[0];
		 //var numEntries = shl.entry.length;
		 
 		 _shlokaStartTime = +_entireChapterData.shloka[0].entry[0].startTime;
		 _shlokaEndTime = _entireChapterData.shloka[_numShlokasInChap-1].entry[_entireChapterData.shloka[_numShlokasInChap-1].entry.length - 1].endTime;
         displayShloka(_currentIndex);
	 }


	 //////////////////////////////////////////////////////////////
	 //
	 //////////////////////////////////////////////////////////////
	 function setMaxValForShlokaBox(numShlokas) {
		 // to be implemented
	 }
	 

     //////////////////////////////////////////////////////////////
     // parseShlokaFromHTML()
     //////////////////////////////////////////////////////////////
     function parseShlokaFromHTML() {
console.log("parseShlokaFromHTML");
        var shElm = document.getElementById("shloka");

        var iterator = document.evaluate('//entry', shElm, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null );

        try {
          var thisNode = iterator.iterateNext();
  
          while (thisNode) {
              _secDtlsArr.push({
                                text    : thisNode.textContent,
                                startTime  : thisNode.getAttribute("startTime"),
                                endTime : thisNode.getAttribute("endTime"),
                                swhtsp  : thisNode.getAttribute("swhtsp")
                             });

            thisNode = iterator.iterateNext();
          }
        } catch (e) {
          dump( 'Error: Document tree modified during iteration ' + e );
        }
        // console.log(_secDtlsArr);
     }

     //////////////////////////////////////////////////////////////
     // displayShlokaInitial()
     //////////////////////////////////////////////////////////////
     function displayShlokaInitial() {
console.log("displayShlokaInitial");
       var bigStr = "";
       var secId = 0;
       for (i = 0; i < _secDtlsArr.length; i++) {
          var secDtls = _secDtlsArr[i];
          if ($.trim(secDtls.startTime) == "") {
            bigStr += "<span>";
            bigStr += secDtls.text;
            bigStr += "</span>";
          } else {
            bigStr += "<button class=\"secButton\" id=\"" + secId + "\" onclick=\"secBtnPressed('" + secId + "')\">";
            bigStr += secDtls.text;
            bigStr += "</button>"
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

       // console.log(bigStr);
       document.getElementById("shloka-display").innerHTML = bigStr;
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
console.log("secBtnPressed");
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
console.log("processFurtherSectionClick");
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
console.log("resetSelection");
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
     // tmUpdLsr()
     // Time update listener for the media player.
     // IMPORTANT FUNCTION.
     //////////////////////////////////////////////////////////////
     function tmUpdLsr(mediaElement) {
       //if (_sectionPressed == false) { return; }

       var curTime = mediaElement.currentTime;
         
        if((_tutorialMode && !_modeChanged) || _currRepeatGoing == _para) {
            //logic for tutorial functionality
            playTutorial(curTime);
        }
       
       highlightSec(curTime);

       if(curTime > 2 && !_insideF) {
          getCurrentLine(curTime);
       }

       _insideF = false;

         
    _logMsg =  " Playing Line number: " + (_playLine + 1) + " | Number of Shlokas: " + _numShlokasInChap;
                
       $('#logMsg').html(_logMsg);
         
       if (_modeChanged && curTime > _endPos) {
         //mediaElement.pause();
		 _currentIndex = _nbrOfLines;
		 //console.log(_repeatStatus);
		 
		 if(_repeatStatus == "repeatOne" ) {
			_mediaElementRef.currentTime = _startPos;
             
             if(!_tutorialLastRound && _tutorialMode) {
//                     if(!_tutorialLastRound && _repeatCounter == _TUTORIAL_REPEAT) {
                         _repeatCounter = 0;
                         if(curTime > _tutorialEndPos) {
                            _tutorialLastRound = true;
                         }
                         gotoNextShloka();
//                     }
                     _repeatStatus = "repeatOne";
                     _mediaElementRef.currentTime = _startPos;
                     _repeatCounter++;
                   
             }
             
			//mediaElement.play(); 
		 } else if (_sectionPressed == true) {
			 return;
		 } else {
			 //_mediaElementRef.pause();
             var minVal =  $("#stLine").val();
             if(minVal == "") {
                 
                 if(!_tutorialLastRound && _tutorialMode) {
//                     if(!_tutorialLastRound && _repeatCounter == _TUTORIAL_REPEAT) {
                         _repeatCounter = 0;
                         if(curTime > _tutorialEndPos) {
                            _tutorialLastRound = true;
                         }
                         gotoNextShloka();
//                     }
                     _repeatStatus = "repeatOne";
                     _mediaElementRef.currentTime = _startPos;
                     _repeatCounter++;
                 }else {
			         gotoNextShloka();
                }
                 
             } else {
                 _mediaElementRef.pause();
				_playsStatus = "notplaying";
                showPlay();
                 _mediaElementRef.currentTime = _startPos;
             }
		 }
		 
       }
     }

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
console.log("sleep");
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
					var start = _secDtlsArr[_chosenBtnArr[0]].startTime;
                    var end = _secDtlsArr[_chosenBtnArr[_chosenBtnArr.length-1]].endTime;
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
			
			_lastKnownRepeatStatus = _repeatStatus;
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
         console.log("updateRepeatButtonStatus()");
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
console.log("setLastKnownRepeatStatus");
		 console.log("setLast() : _repeatStatus : " + _repeatStatus + "\tlastKnown : " + _lastKnownRepeatStatus);
		 _repeatStatus = _lastKnownRepeatStatus;
		 updateRepeatButtonStatus(_repeatStatus);
	 }
	 
	 //////////////////////////////////////////////////////////////
     // Call back for next button
     //////////////////////////////////////////////////////////////
     $(document).ready(function(){          
        $("#next_btn").click(function(){
			gotoNextShloka();
        });
     });
	 
	 
	 //////////////////////////////////////////////////////////////
     // Call back for prev button
     //////////////////////////////////////////////////////////////
     $(document).ready(function(){          
        $("#prev_btn").click(function(){
			if (_currentIndex > 0) {
				_currentIndex -= 2;
				gotoNextShloka();
			}
        });
     });

/////// TUTORIAL FUNCTIONALITY

    function playTutorial(curTm) {
       
        if(_currRepeatGoing == _word && curTm > _secDtlsArr[_currWrdPos].endTime) {
            if(_teacher) {
                _teacher = false;
                _student = true;
                _mediaElementRef.volume = _studenVolume;
                _currStudentRptCntr = 0;
                _mediaElementRef.currentTime = _secDtlsArr[_currWrdPos].startTime;
                //console.log(_secDtlsArr[_currWrdPos])
            } else if(_student) {
                _currStudentRptCntr++;
                if(_currStudentRptCntr < _studentRepeat) {
                    _mediaElementRef.currentTime = _secDtlsArr[_currWrdPos].startTime;
                } else {
                    _teacher = true;
                    _student = false;
                    _mediaElementRef.volume = _teacherVolume;
                    _prevSwhtsp = _currSwhtsp;
                    
                    if(_currWrdPos < (_wordCnt -1))
                        _currWrdPos++;
                    
                    _currSwhtsp = _secDtlsArr[_currWrdPos].swhtsp;
                    if(_prevSwhtsp == _empty) {
                        _mediaElementRef.currentTime = _currPlayLineStartTime;
                        _currRepeatGoing = _sholka; //end of sholka
                        _currStudentRptCntr = 0;
                       curTm = _currPlayLineStartTime;
                    }
                }
            }
            
        }
        
        if(_currRepeatGoing == _sholka && curTm > _currPlayLineEndTime) {
            if(_teacher) {
                _teacher = false;
                _student = true;
                _mediaElementRef.volume = _studenVolume;
                _mediaElementRef.currentTime = _currPlayLineStartTime;
                _currStudentRptCntr = 0;
            } else if(_student) {
                _currStudentRptCntr++;
                if(_currStudentRptCntr < _studentRepeat) {
                    _mediaElementRef.currentTime = _currPlayLineStartTime;
                } else {
                    _teacher = true;
                    _student = false;
                    _mediaElementRef.volume = _teacherVolume;
                    
                    if(_pagePlayLine < (_nbrOfLines - 1)) {
                        _currRepeatGoing = _word; //end of the sholka
                        _pagePlayLine++;
                    } else {
                        _modeChanged = true; //end of the page
                        _pageNumber++;
                        _pagePlayLine = 0;
                        if(_playLine == (_numShlokasInChap - 1)) {
                            _pageNumber = 1;
                            _currRepeatGoing = _para;
                            curTm = _shlokaEndTime;
                        }
                    }
                }
            }
        }
        
        if(_currRepeatGoing == _para && curTm > _shlokaEndTime) {
             if(_teacher) {
                _teacher = false;
                _student = true;
                _mediaElementRef.volume = _studenVolume;
                _mediaElementRef.currentTime = _shlokaStartTime;
                _currStudentRptCntr = 0;
            } else if(_student) {
                _currStudentRptCntr++;
                if(_currStudentRptCntr < _studentRepeat) {
                    _mediaElementRef.currentTime = _shlokaStartTime;
                } else {
                     _teacher = true;
                     _student = false;
                     _mediaElementRef.volume = _teacherVolume;
                     _currRepeatGoing = _word;
                     _pagePlayLine = 0;
                     _modeChanged = true;  //finished one round of tutorial
                }
            }
        }
        
    }