   function sliderPlayRangePl(slSt, slEnd) {

		_stLn = +slSt;
		if (_currentIndex < _stLn) { // || _currentIndex > _lastSlokaIndex2Render) should not happen
			_currentIndex = +slSt-1;

		}
		_lastSlokaIndex2Render = +slEnd-1;
		_endLn = _stLn + _nbrOfLines;

		if(slEnd < _endLn) {
			_endLn = slEnd;
		}

        for (i=_stLn; i < _endLn; i++) {
            var shl = _entireChapterData.shloka[i];
		    var numEntries = shl.entry.length;
			var stPos;
			var endPos;

            if(i == _stLn) {
                stPos = +shl.entry[0].startTime;
            }
            if(i == _endLn) {
		      endPos = +shl.entry[numEntries-1].endTime;
            }
        }
		if(endPos != _endPos) {
			_endPos = endPos;
		}
		if(stPos != _startPos) {
			_startPos = stPos;
			//gotoNext(_startPos, _endPos);
		}
		playAudioRangesPl(_startPos, _endPos);
//        console.log("_startPos  " + _startPos + " endPos " + _endPos);
	 }

    function getCurrentPlayLineInShlokaPl(currTime) {
        //console.log("getCurrentLine" + currTime);

        for (i=_stLn; i < _endLn; i++) {
            var shl = _entireChapterData.shloka[i];
		    var numEntries = shl.entry.length;
            var stTm  = +shl.entry[0].startTime;
            var endTm = +shl.entry[numEntries-1].endTime;
          //console.log("stTm  " + stTm + " endTm " + endTm);


            if(currTime >= stTm && currTime < endTm) {
                //_playLine = i;
                _currPlayShlokaEndTime = endTm;
                _currPlayShlokaStartTime = stTm;
				//_currPlayLineEndTime = endTm; // dummy assignment to pass the next line if cond

				//if(shl.entry[0].swhtsp != _n) {
					for(k=0; k<numEntries; k++) {

						var lstTm  = shl.entry[k].startTime;
						var lendTm = shl.entry[k].endTime;

						//if(currTime >= lstTm) {
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
						//}

					}
				//} else {
					//_currPlayLineStartTime = _currPlayShlokaStartTime;
					//_currPlayLineEndTime = _currPlayShlokaEndTime;
					//_currPlayLineInShloka = 1;
				//}
				break;
            }



        }
        //console.log("_playLine  " + _playLine);
	 }

	function getShlokaStartTmAndWrdCntPl(lineNumber) {

		var shl = _entireChapterData.shloka[lineNumber - 1];
		var numEntries = shl.entry.length;

		var stTm = shl.entry[0].startTime;
		var endTm = +shl.entry[numEntries-1].endTime;

		_currPlayShlokaStartTime = stTm;
		_currPlayLineStartTime = stTm;

		_currPlayShlokaEndTime = endTm;

		var wrdCnt = 0;
		for(i=0;i<lineNumber;i++) {
			var shl1 = _entireChapterData.shloka[lineNumber - 1];
			var numEntries = shl1.entry.length;

			wrdCnt = wrdCnt + numEntries;
		}

		_currWrdPos = wrdCnt;
	}

    function getCurrentLinePl(currTime) {
        //console.log("getCurrentLine" + currTime);
        _insideF = true;

        for (i=_stLn; i < _endLn; i++) {
            var shl = _entireChapterData.shloka[i];
		    var numEntries = shl.entry.length;
            var stTm  = +shl.entry[0].startTime;
            var endTm = +shl.entry[numEntries-1].endTime;
          //console.log("stTm  " + stTm + " endTm " + endTm);

			if(shl.entry[numEntries-1].text.includes('||')) {
				_nbrOfLineInShloka = 2;
			} else {
				_nbrOfLineInShloka = 1;
			}
            if(currTime > stTm && currTime < endTm) {
                _playLine = i;
                _currPlayShlokaEndTime = endTm;
                _currPlayShlokaStartTime = stTm;

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

    function playRangeTextPl() {
        //console.log("playRangeText");
        //console.log("_stPlayLn  " + _stPlayLn + " _endPlayLn " + _endPlayLn);
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

    function populateAllSholkasPl() {

		 if (_secDtlsArrDisplay != null) { //empty it out
			 _secDtlsArrDisplay.splice(0, _secDtlsArrDisplay.length);
		 }

        for (i=0; i < _entireChapterData.shloka.length; i++) {
            var shl = _entireChapterData.shloka[i];
		    var numEntries = shl.entry.length;

            for (j=0; j < numEntries; j++) {
                _secDtlsArrDisplay.push({
                  text    : shl.entry[j].text,
                  startTime  : shl.entry[j].startTime,
                  endTime : shl.entry[j].endTime,
                  swhtsp  : shl.entry[j].swhtsp
                });
             }
        }

	 }


     //////////////////////////////////////////////////////////////
     // displayShlokaPl()
     //////////////////////////////////////////////////////////////
     function displayShlokaPl(index) {
          //console.log("displayShlokaPl()");
//         _stLn = +index;
//         _endLn = +index + (+_nbrOfLines);
         if(_endLn > _numShlokasInChap) {
             _endLn = _numShlokasInChap;
         }

//         populateSectionArrPl(index);
         //playRangeTextPl();
		 removeNonTextFromSecRefsPl();
         displayShlokaInitial();

         populateSecnsRefsPl();
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
	 // gotoNextShlokaPl()
	 //
	 //////////////////////////////////////////////////////////////
	 function gotoNextShlokaPl() {
		 _methodInside = "gotoNextShlokaPl()";
         //console.log("gotoNextShloka");
        _stPlayLn = +_endLn;
        _endPlayLn = +_stPlayLn + 1;
	    _currentIndex++;
        _stLn++;
        _endLn++;

		if(_endLn > _numShlokasInChap) {
			if(_playsStatus != "noRepeat") {
                _stLn = 0;
				_endLn = _nbrOfLines;
                _currentIndex = 0;
                _stPlayLn = 0;
                _endPlayLn = +_nbrOfLines;
			}
		}

		//empty out any chosen sections
		_chosenBtnArr.splice(0, _chosenBtnArr.length);
		setLastKnownRepeatStatus();

		_mediaElementRef.pause(); sleep(200);
        displayShlokaPl(_currentIndex);
		_mediaElementRef.currentTime = _startPos;
		// console.log("gotoNextShlokaPl() :  " + _startPos + "   _mediaElementRef : " +  _mediaElementRef.currentTime);
		highlightSec(_startPos);
	    _mediaElementRef.play();
		//console.log("later  " + _startPos + "   _mediaElementRef : " +  _mediaElementRef.currentTime + " endPos " + _endPos);
	 }

	 //////////////////////////////////////////////////////////////
	 // populateSectionArrPl()
	 //////////////////////////////////////////////////////////////
	 function populateSectionArrPl(indx) {
         //console.log("populateSectionArrPl()");
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
     // removeNonTextFromSecRefs()
     // Initial section details has punctuation marks or content
     // that is not part of the shloka words. So, get rid of those
     // in the array.
     //////////////////////////////////////////////////////////////
     function removeNonTextFromSecRefsPl() {
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
     function highlightSecPl(curTime) {
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
            highlightCurSecPl(sec);
     }

     //////////////////////////////////////////////////////////////
     // highlightCurSec(sec)
     //////////////////////////////////////////////////////////////
     function highlightCurSecPl(sec) {
//console.log("highlightCurSec");
		 if(!_oneLine) {
			if (_prevHighlightedSec == sec) {
			  return;
			} else {
			  unhighlightPrevSecPl(_prevHighlightedSec);
			  _prevHighlightedSec = sec;
			}
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
     function unhighlightPrevSecPl(sec) {
//console.log("unhighlightPrevSec");
        if (sec < 0) return;
        var secObj = _secRefArr[sec];
        if (!secObj) {
            console.log(sec);
        }
        else {
	        secObj.style.color = "black";
	        secObj.style.fontWeight = "inherit";
		}
     }


     //////////////////////////////////////////////////////////////
     // populateSecnsRefsPl()
     // - Prepopulate the references to the shlokla sections.
     // - Prepopulate the texts of the corresponding sections above.
     //
     // Above data will be useful
     //   - While selecting contiguous sections.
     //   - For highlighting appropriate section while the audio
     //     is running.
     //////////////////////////////////////////////////////////////
     function populateSecnsRefsPl() {
//console.log("populateSecnsRefsPl");
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
     // displayShlokaInitial()
     //////////////////////////////////////////////////////////////
     function displayShlokaInitial() {
       // console.log(bigStr);
         displayShlokaInitialPP();

         var container = document.querySelector('.shloka-display')
        container.classList.add('pre-animation');
        setTimeout(function(){
            container.classList.remove('pre-animation')
         },100);
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
     // tmUpdLsr()
     // Time update listener for the media player.
     // IMPORTANT FUNCTION.
     //////////////////////////////////////////////////////////////
     function tmUpdLsrPl(mediaElement) {

		 if(_testingMode && _gCounter == 0) {
			 //test();
			 _gCounter++;
		 }

        var curTime = mediaElement.currentTime;

        if((_tutorialMode && !_modeChanged) || _currRepeatGoing == _para) {
            //logic for tutorial functionality
            playTutorialNewPl(curTime);
        }

       highlightSecPl(curTime);


          if(_repeatStatus == "repeatOne"  && curTime > _endPos) {
			_mediaElementRef.currentTime = _startPos;
          }


       _logMsg =  " Playing Line number: " + (_playLine + 1) + " | Number of Shlokas: " + _numShlokasInChap;
	   _logMsg = _logMsg + " | _currRepeatGoing = " + _currRepeatGoing;

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
           //displayShlokaPl(0);
           _insideF = false;
		   tmpPos = 200;
           $('#shloka-display').animate({
                'marginTop' : '-=' + tmpPos //moves up
                });
       }

       if(curTime > 2 && !_insideF) {
          getCurrentLinePl(curTime);
       }

       _insideF = false;

       if (curTime > _shlokaEndTime) {
            //resetToStarting();
       }
     }

     function resetToStarting() {
         //console.log("resetToStarting...");
            _stLn = 0;
            _endLn = _nbrOfLines;
            _stPlayLn = 0;
            _endPlayLn = _endLn;
            _gCounter = 0;
            _playLine = 0;
            _insideF = false;
		 	$('#shloka-display').removeClass('shloka-display').addClass('shloka-display');
            displayShlokaPl(0);
           _mediaElementRef.currentTime = _shlokaStartTime;
     }


/////// TUTORIAL FUNCTIONALITY



function playTutorialNewPl(curTm) {

    //Word by word repeation with exception of Uvaca
        if(_currRepeatGoing == _word && curTm > _secDtlsArrDisplay[_currWrdPos].endTime) {

			if(_secDtlsArrDisplay[(_currWrdPos)].text.includes(Sanscript.t("उवाच", "devanagari", _lang))) {
				_uvacha = true;
			}

            if(exceptionToContinuePl()) {
                return false;
            }
            if(_teacher) {
                _teacher = false;
                _student = true;
                _mediaElementRef.volume = _studenVolume;
                _currStudentRptCntr = 0;
                 if(_uvacha && _secDtlsArrDisplay[(_currWrdPos-1)].text.includes(Sanscript.t("उवाच", "devanagari", _lang))) {
                     _mediaElementRef.currentTime = _secDtlsArrDisplay[(_currWrdPos-1)].startTime;
					 _uvacha = false;
                 } else {
                    _mediaElementRef.currentTime = _secDtlsArrDisplay[_currWrdPos].startTime;
                 }
                //console.log(_secDtlsArr[_currWrdPos])
            } else if(_student) {
                _currStudentRptCntr++;
                if(_currStudentRptCntr < _studentRepeat) {
                    if(_uvacha && _secDtlsArrDisplay[(_currWrdPos-1)].text.includes(Sanscript.t("उवाच", "devanagari", _lang))) {
                        _mediaElementRef.currentTime = _secDtlsArrDisplay[(_currWrdPos-1)].startTime;
						_uvacha = false;
                    } else {
                        _mediaElementRef.currentTime = _secDtlsArrDisplay[_currWrdPos].startTime;
                    }
                } else {
                    _teacher = true;
                    _student = false;
                    _mediaElementRef.volume = _teacherVolume;
                    _prevSwhtsp = _currSwhtsp;

                    if(_currWrdPos < (_wordCnt -1))
                        _currWrdPos++;

                    _currSwhtsp = _secDtlsArrDisplay[_currWrdPos].swhtsp;
                    if(_prevSwhtsp == _empty) {

						if(_oneLine && curTm > _shlokaEndTime) {
							resetToStarting();
							//break;
						} else {

							_mediaElementRef.currentTime = _currPlayShlokaStartTime;

							if(_nbrOfLineInShloka == 1)
								_currRepeatGoing = _sholka;
							else {
								_currRepeatGoing = _line; //end of sholka
								curTm = _currPlayShlokaStartTime;
								getCurrentPlayLineInShlokaPl(curTm);
							}
							_currStudentRptCntr = 0;
							curTm = _currPlayShlokaStartTime;
						}
                    }
                }
            }

        }

    //Line repeation
        if(_currRepeatGoing == _line && curTm > _currPlayLineEndTime) {
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

                    if(_currPlayLineInShloka != 2 && curTm > _currPlayLineEndTime) {
							getCurrentPlayLineInShlokaPl(curTm);
                        	curTm = _currPlayLineStartTime;
                    } else {
                           	_currRepeatGoing = _sholka;
						   	_mediaElementRef.currentTime = _currPlayShlokaStartTime;
							curTm = _currPlayShlokaStartTime;
                   	}

                }
            }
        }


    //sholka repeation
        if(_currRepeatGoing == _sholka && curTm > _currPlayShlokaEndTime) {
            if(_teacher) {
                _teacher = false;
                _student = true;
                _mediaElementRef.volume = _studenVolume;
                _mediaElementRef.currentTime = _currPlayShlokaStartTime;
                _currStudentRptCntr = 0;
            } else if(_student) {
                _currStudentRptCntr++;
                if(_currStudentRptCntr < _studentRepeat) {
                    _mediaElementRef.currentTime = _currPlayShlokaStartTime;
                } else {
                    _teacher = true;
                    _student = false;
                    _mediaElementRef.volume = _teacherVolume;

                    if(_pagePlayLine < (_numShlokasInChap)) {
                        _currRepeatGoing = _word; //end of the sholka
                        _pagePlayLine++;
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


function exceptionToContinuePl() {
    if(_secDtlsArrDisplay[_currWrdPos].text.includes(Sanscript.t("उवाच", "devanagari", _lang))) {
        _currWrdPos++;
        return true;
    }
    else
        return false;
}

function playAudioRangesPl(start, end) {
          console.log("playAudioRanges()");
           _startPos   = +start;
           _endPos   = +end;

           _mediaElementRef.currentTime = _startPos;
           _mediaElementRef.play();
     }
