
	//////////////////////////////////////////////////////////////
	// GLOBAL VARIABLES
	//////////////////////////////////////////////////////////////
	var _sectionPressed = false;
	var _startPos = 0;
	var _endPos = 100000;
	var _startWPos = 0;
	var _endWPos = 100000;
	//var _secDtlsArr  = new Array();
	var _secDtlsArrDisplay = new Array();

	//var _secDtlsArrDisplayStu  = new Array();

	// var _secDtlsArrMng  = new Array();
	var _secRefArr = new Array();
	var _chosenBtnArr = new Array();

	var _prevHighlightedSec = -1;

	var _playsStatus = "notplaying";
	var _repeatStatus = "repeatChapter";
	var _currentChapter = "";
	// var _currentIndex = "";
	var _mediaElementRef = "";
	var _entireChapterData = "";
	//var _entireChapterDataMng = "";
	var _numShlokasInChap = 0;
	var _lastKnownRepeatStatus = _repeatStatus;
	var _nbrOfLines = 5;

	var _stLn = 0;
	var _endLn = _stLn + _nbrOfLines;
	var _playLine = 0;
	var _prevPlayLine = 0;
	var _insideF = false;
	var _lang = 'devanagari';
	var _prevLang = 'devanagari';

	var _tutorialMode = false;

	var _teacher = true;
	var _student = false;

	var _wordCnt = _secDtlsArrDisplay.length;
//	var _currWrdPos = 0;
	var _startWordPos = 0;

//	var _currSwhtsp = "";
//	var _prevSwhtsp = "";

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
	var _pagePlayLine = 0;
	var _shlokaStartTime = 0;
	var _shlokaEndTime = 100000;

	var _currPlayLineEndTime = 0;
	var _currPlayLineStartTime = 0;

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

	var _sliderStartingtPos = 0;
	var _sliderEndingPos = 0;

	var _tmpPosForwardPl = 81;
	var _tmpPosFwdUvaPl = 36;
	var _tmpPosForwardTu = 81;
	var _tmpPosFwdUvaTu = 36;
	var _sliderDiff = 0;

	var _sliderSpeedDef = 300;
	var _sliderSpeed = 50;
	var _screenSize = 0;

	var _scrollText = false;
	var _sliderMove = false;

	var _defaultText = "";
	var _selectedChapter = "";

	//////////////////////////////////////////////////////////////
	// code begin
	//////////////////////////////////////////////////////////////
	$(document).ready(init);


	function resetSpeed() {
		if ($("#playSpeed").length > 0)
			_mediaElementRef.playbackRate = $("#playSpeed").val();
	}

	//////////////////////////////////////////////////////////////
	// init()
	//////////////////////////////////////////////////////////////
	function init() {
		_mediaElementRef = $("#my-audio")[0];
		hideSlider();
		_defaultText = $(".shloka-display").html();
		var scrHt = $(window).height();
		scrHt = scrHt - 220;
		var txt = 'max-height: ' + scrHt + 'px !important';
		var txt2 = "";
		$(".shloka-displayWrapper").attr('style',txt);
		//console.log('scrHt: ' + scrHt);
        var scrWd = $(window).width();
        if(scrWd < 768)
            txt = 'width: 40px; height: 40px;'    
        if(scrWd < 321)
            txt = 'width: 30px; height: 30px;'
        $(".logo img").attr('style', txt);
		
		if(scrWd > 768) {
			txt = 'margin-top: 23px !important; margin-bottom: 3px !important;'    
			txt2 = "padding: 10px 1px !important";
		} else {
			txt = 'margin-top: 9px !important; margin-bottom: -4px !important;'   
			txt2 = "padding: 1px 1px !important;";
		}
		$("h3").attr('style', txt);
		$(".navbar-brand").attr('style', txt2);
	}

	$(window).resize(function() {
        var scrHt = $(window).height();
		scrHt = scrHt - 220;
		var txt = 'max-height: ' + scrHt + 'px !important';
		var txt2 = "";
		$(".shloka-displayWrapper").attr('style',txt);
        var scrWd = $(window).width();
        if(scrWd < 768)
            txt = 'width: 40px; height: 40px;'    
        if(scrWd < 321)
            txt = 'width: 30px; height: 30px;'
        $(".logo img").attr('style', txt);
		
		if(scrWd > 768) {
			txt = 'margin-top: 23px !important; margin-bottom: 3px !important;'    
			txt2 = "padding: 10px 1px !important";
		} else {
			txt = 'margin-top: 9px !important; margin-bottom: -4px !important;'   
			txt2 = "padding: 1px 1px !important;";
		}
		$("h3").attr('style', txt);
		$(".navbar-brand").attr('style', txt2);
    });

	function langSel(lang, langTy) {
		$("#langSelD").text(langTy);
		_lang = lang;
		changeChapterDrop();
		if (_currentChapter != "") {
			refreshShlokas();
		}
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
		/*
		var textArr  = ("ध्यानश्लोकाः|01 अर्जुनविषाद योगः|02 साङ्ख्य योगः|03 कर्म योगः|04 ज्ञान योगः|05 कर्मसन्न्यास योगः|06 आत्मसंयम योगः|07 ज्ञानविज्ञान योगः|" +
					   "08 अक्षरब्रह्म योगः|09 राजविद्याराजगुह्य योगः|10 विभूति योगः|11 विश्वरूपदर्शन योगः|12 भक्ति योगः|13 क्षेत्रक्षेत्रज्ञविभाग योगः|14 गुणत्रयविभाग योगः|" +
					   "15 पुरुषोत्तम योगः|16 दैवासुरसम्पद्विभाग योगः|17 श्रद्धात्रयविभाग योगः|18 मोक्षसन्न्यास|गीतामाहात्म्यम्|गीतासारम्").split("|");
		*/
		var textArr  = ("08 अक्षरपरब्रह्म योगः|12 भक्ति योगः").split("|");
		

		if (_lang != 'devanagari') {
			for (i = 0; i < textArr.length; i++) {
				textArr[i] = Sanscript.t(textArr[i], "devanagari", _lang);
			}
		}

		if ($("#chapSelD").text().trim() != 'Choose Chapter') {
			$("#chapSelD").html(Sanscript.t($("#chapSelD").text().trim(), _prevLang, _lang) + ' <span class="caret"></span>');
			$("#chapSelD").val(Sanscript.t($("#chapSelD").text().trim(), _prevLang, _lang));
		}

		$("#chp .dropdown-menu li a").each(function(index) {
			if (typeof(textArr[index]) != "undefined") {
				$(this).val(textArr[index]);
				$(this).html(textArr[index]);
			}
		});

	}


	$(".dropdown-menu li a").click(function() {
		$(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
		$(this).parents(".dropdown").find('.btn').val($(this).data('value'));
	});

	//////////////////////////////////////////////////////////////
	// chapSel()
	//
	// - Call back for chapter selection dropdown
	// - Navigates to a chapter
	// - Populates the number of shlokas within the chapter
	//////////////////////////////////////////////////////////////
	function chapSel(chap, chapTx) {

		_numShlokasInChap = 0;
		_curTime = 0;
		_selectedChapter = chap; //$("#chapSel").val();
		if (chapTx != "") {
			$("#chapSelD").text(chapTx);
		}
		_currentChapter = _selectedChapter;
		//parseShlokaFromJSONFileMng("./" + selChap + "/meaning.json");

		if (_selectedChapter != _empty) {
			_mediaElementRef.type = "audio/mpeg";
			if (_tutorialMode) {
				_tutorFile = true;
				parseShlokaFromJSONFile("./" + _selectedChapter + "/" + _tutorJSONFileName);
				_mediaElementRef.src = "./" + _selectedChapter + "/" + _tutorMP3FileName;
			} else {
				parseShlokaFromJSONFile("./" + _selectedChapter + "/" + _plainJSONFileName);
				_mediaElementRef.src = "./" + _selectedChapter + "/" + _plainMP3FileName;
			}
			_sliderStartPos = 0;
			_sliderEndPos = 0;
			_sliderStartingtPos = 0;
			_sliderEndingPos = 0;
			_playLine = 0;
			_stLn = 0;
			_endLn = +_nbrOfLines;
			$('.shloka-display').css({
				marginTop: ""
			});
			_mediaElementRef.load();
			showPause();
			_mediaElementRef.play();
			resetSpeed();
			$('#stLine').prop('disabled', false);
         	$('#endLine').prop('disabled', false);
		} else {
			$(".shloka-display").html(_defaultText);
			_mediaElementRef.pause();
			_mediaElementRef.src = "";
		}
	}


	//////////////////////////////////////////////////////////////
	// tutorialMode()
	//////////////////////////////////////////////////////////////
	$(document).ready(function() {
		$('input[type="checkbox"]').click(function() {
			if ($("#tutorialMode").prop("checked") == true) {
				//reset if required
				_tutorialMode = true;
				$("#tutorialMode").prop("disabled", true);
				setTimeout(function() {
					$("#tutorialMode").prop("disabled", false);
				}, 1000);
			} else if ($("#tutorialMode").prop("checked") == false) {
				//reset repeat
				_tutorialMode = false;
				_tutorFile = false;
				_teacher = true;
				_student = false;
				$("#tutorialMode").prop("disabled", true);
				setTimeout(function() {
					$("#tutorialMode").prop("disabled", false);
				}, 1000);
			}
			if (_currentChapter != "")
				chapSel(_selectedChapter, "");
		});
	});

	//////////////////////////////////////////////////////////////
	// parseShlokaFromJSONFile()
	//////////////////////////////////////////////////////////////
	function parseShlokaFromJSONFile(fileURI) {
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
		_currentChapter = chapter.name;
		var chapNum = chapter.chapterNum;
		_numShlokasInChap = chapter.shloka.length; // includes header and end footer
		_playLine = 0;
		setSlider(_numShlokasInChap);

		_shlokaStartTime = +_entireChapterData.shloka[0].entry[0].startTime;
		_shlokaEndTime = _entireChapterData.shloka[_numShlokasInChap - 1].entry[_entireChapterData.shloka[_numShlokasInChap - 1].entry.length - 1].endTime;

		 $('#stLine').attr('max', _numShlokasInChap);
         $('#endLine').attr('max', _numShlokasInChap);
		
		if (_tutorialMode) {
			populateAllSholkasTu();
			displayShlokaTu();
			sliderPlayRangeTu(_sliderStartPos, _sliderEndPos, false);
		} else {
			populateAllSholkasPl();
			displayShlokaPl();
			sliderPlayRangePl(_sliderStartPos, _sliderEndPos, false);
		}

		var secBtnArr = document.getElementsByClassName("secButton");
		for (i = 0; i < secBtnArr.length; i++) {
			var txt = Sanscript.t(secBtnArr[i].innerHTML, "devanagari", _lang);
			secBtnArr[i].innerHTML = txt;
		}
	}


	//////////////////////////////////////////////////////////////
	//
	//////////////////////////////////////////////////////////////
	function setSlider(numShlokas) {
		if (numShlokas > 0) {
			createSlider(0, numShlokas);
		} else {
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
	function secBtnPressed(btnId, lineNbr) {
		var btnObj = _secRefArr[btnId];
		if (processFurtherSectionClick(btnId)) {
			if (btnObj.className == 'secButton') {
				btnObj.className = 'secButton-pressed'
			} else {
				btnObj.className = 'secButton';
			}
		}

		if (_chosenBtnArr.length == 0) {
			setLastKnownRepeatStatus();
			var shl = _entireChapterData.shloka[_playLine];
			var numEntries = shl.entry.length;
			_startWPos = +shl.entry[0].startTime;
			_endWPos = +shl.entry[numEntries - 1].endTime;
		} else {
			_mediaElementRef.pause();
			updateRepeatButtonStatus("repeatOne");
			_repeatStatus = "repeatOne";
			_playsStatus = "notplaying";
			showPlay();
			$("#plays_btn").click();
		}
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
		var retVal = false;
		var btnId = +ipBtnId;

		var lenArr = _chosenBtnArr.length;
		if (lenArr == 0) {
			_chosenBtnArr.push(btnId);
			retVal = true;
		} else if (btnId == _chosenBtnArr[0]) {
			// the left most has been clicked
			// which is already chosen. So deselect it.
			_chosenBtnArr = _chosenBtnArr.splice(1, lenArr - 1);
			retVal = true;
		} else if (btnId == _chosenBtnArr[lenArr - 1]) {
			// the right most has been clicked
			// which is already chosen. So deselect it.
			_chosenBtnArr.pop();
			retVal = true;
		} else if (btnId == _chosenBtnArr[0] - 1) {
			// section left of the current selection chosen.
			_chosenBtnArr.unshift(btnId);
			retVal = true;
		} else if (btnId == _chosenBtnArr[lenArr - 1] + 1) {
			// section right of the current selection chosen.
			_chosenBtnArr.push(btnId);
			retVal = true;
		} else if (btnId < _chosenBtnArr[0] || btnId > _chosenBtnArr[lenArr - 1]) {
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

		return retVal;
	}

	//////////////////////////////////////////////////////////////
	// resetSelection()
	// Unselects every selection
	//////////////////////////////////////////////////////////////
	function resetSelection() {
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
		setTimeout(doNothing, +milliSecs);
	}

	//////////////////////////////////////////////////////////////
	// doNothing()
	//////////////////////////////////////////////////////////////
	function doNothing() {}

	//////////////////////////////////////////////////////////////
	// Call back for play/pause button
	//////////////////////////////////////////////////////////////
	$(document).ready(function() {
		$("#plays_btn").click(function() {
			if (_playsStatus == "notplaying") {
				_playsStatus = "playing";
				if (_chosenBtnArr != null && _chosenBtnArr.length > 0) {
					var start = "";
					var end = "";
					if (!_tutorFile) {
						start = _secDtlsArrDisplay[_chosenBtnArr[0]].startTime;
						end = _secDtlsArrDisplay[_chosenBtnArr[_chosenBtnArr.length - 1]].endTime;
					} else {
						start = getTimingForText(_secDtlsArrDisplay[_chosenBtnArr[0]].text, "S");
						end = getTimingForText(_secDtlsArrDisplay[_chosenBtnArr[_chosenBtnArr.length - 1]].text, "E");
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
	$(document).ready(function() {
		$("#repeat_btn").click(function() {
			// If sections have been chosen, no playing around with this
			// button
			if (_chosenBtnArr.length != null && _chosenBtnArr.length > 0) {
				return;
			}
			if (_repeatStatus == "noRepeat") {
				_repeatStatus = "repeatChapter";
			} else if (_repeatStatus == "repeatChapter") {
				_repeatStatus = "repeatOne";
			} else {
				_repeatStatus = "noRepeat";
			}
			updateRepeatButtonStatus(_repeatStatus);
			_lastKnownRepeatStatus = _repeatStatus;
		});
	});

	//////////////////////////////////////////////////////////////
	// updateRepeatButtonStatus()
	//////////////////////////////////////////////////////////////
	function updateRepeatButtonStatus(status) {
		//console.log("updateRepeatButtonStatus()");
		if (status == "repeatChapter") {
			$('#repeat_btn').attr('src', 'bg/icons/ic_repeat_white_24dp.png');
		} else if (status == "repeatOne") {
			$('#repeat_btn').attr('src', 'bg/icons/ic_repeat_one_white_24dp.png');
		} else {
			$('#repeat_btn').attr('src', 'bg/icons/ic_repeat_black_24dp.png');
		}
	}

	//////////////////////////////////////////////////////////////
	// setLastKnownRepeatStatus()
	//////////////////////////////////////////////////////////////
	function setLastKnownRepeatStatus() {
		_repeatStatus = _lastKnownRepeatStatus;
		updateRepeatButtonStatus(_repeatStatus);
	}

	function showPlay() {
		$('#plays_btn').attr('src', 'bg/icons/ic_play_circle_outline_white_24dp.png');
	}

	function showPause() {
		$('#plays_btn').attr('src', 'bg/icons/ic_pause_circle_outline_white_24dp.png');
	}

	function sliderPlayRange(slSt, slEnd, isT) {
		console.log("start: " + slSt + " | end: " + slEnd + " | _slSt: " + _sliderStartPos + " | _slEnd: " + _sliderEndPos + " | _slSt: " + _sliderStartingtPos + " | _slEnd: " + _sliderEndingPos);

		if (_tutorFile)
			sliderPlayRangeTu(slSt, slEnd, isT);
		else
			sliderPlayRangePl(slSt, slEnd, isT);
	}

	function tmUpdLsr(mediaElement) {
		if (_tutorFile)
			tmUpdLsrTu(mediaElement);
		else
			tmUpdLsrPl(mediaElement);
	}

	//////////////////////////////////////////////////////////////
	// playAudioRanges()
	// Common function for range or section play back
	//////////////////////////////////////////////////////////////
	function playAudioRanges(start, end) {
		console.log("start: " + start + " | end: " + end + " | _slSt: " + _sliderStartPos + " | _slEnd: " + _sliderEndPos + " | _slSt: " + _sliderStartingtPos + " | _slEnd: " + _sliderEndingPos);
		
		if (_tutorFile)
			playAudioRangesTu(start, end);
		else
			playAudioRangesPl(start, end);
	}








	///////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/// plain_sp
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var _uvachaCount = 0;

	function sliderPlayRangePl(slSt, slEnd, isT) {
		var mm = false;
		if ((slSt == _sliderStartingtPos) && (slEnd == _sliderEndingPos)) {
			return false;
		}

		if (slSt == _numShlokasInChap) {
			slSt = slSt - 1;
			mm = true;
		}
		if (slEnd == 0) {
			slEnd = 1;
		}
		if (slSt == slEnd) {
			slEnd = slEnd + 1;
		}
		_stLn = +slSt;
		//		if (_playLine < _stLn) { // || _currentIndex > _lastSlokaIndex2Render) should not happen
		//			_playLine = +slSt-1;
		//		}
		_lastSlokaIndex2Render = +slEnd - 1;
		_endLn = _stLn + _nbrOfLines;

		if (slEnd < _endLn) {
			_endLn = slEnd;
		}

		if (_endLn == _numShlokasInChap) {
			_endLn = _endLn - 1;
		}

		for (i = slSt; i < slEnd; i++) {
			var shl = _entireChapterData.shloka[i];
			var numEntries = shl.entry.length;
			var stPos;
			var endPos;

			if (i == slSt) {
				stPos = +shl.entry[0].startTime;
			}
			if (i == (+slEnd - 1)) {
				endPos = +shl.entry[numEntries - 1].endTime;
			}
		}
		if (endPos != _endPos) {
			_endPos = endPos;
		}
		if (stPos != _startPos) {
			_startPos = stPos;
			_mediaElementRef.currentTime = _startPos;
			_curTime = _startPos;
			if (slSt > _sliderStartingtPos)
				_uvachaCount = getUvachaCount(+_sliderStartingtPos, +slSt);
			else
				_uvachaCount = getUvachaCount(+slSt, +_sliderStartingtPos);
		}


		_sliderDiff = slSt - _sliderStartingtPos;

		if ((+slSt + +_nbrOfLines) > _numShlokasInChap) {
			var b = (+slSt + +_nbrOfLines) - _numShlokasInChap;
			_sliderDiff = _sliderDiff - b;
		}

		if ((+slEnd + +slSt) == _numShlokasInChap) {
			_sliderDiff = (+slSt + +_nbrOfLines) - _numShlokasInChap;
		}

		if (isT || slEnd <= _endLn) {
			scrollDisplayPl(true, _sliderDiff, _sliderSpeed, _uvachaCount, "SLIEDR");
		}

		if (slSt == 0) {
			$('.shloka-display').css({
				marginTop: ""
			});
		}
		_sliderStartingtPos = slSt;
		if (mm) {
			_sliderStartingtPos = slSt + 1;
		}
		_sliderEndingPos = slEnd;

		_mediaElementRef.play();

		_sliderMove = isT;
		if(_sliderMove)
			_scrollText = false;
		
		$('#stLine').attr('value', _sliderStartingtPos);
        $('#endLine').attr('value', _sliderEndingPos);
	}
	
	function shlokaSelRange() {
		var astLn = $("#stLine").val();
        var aendLn = $("#endLine").val();
		
		if(+astLn <= +aendLn) {
//			_stLn = +astLn;
//			_endLn = +aendLn;
			sliderPlayRange(+astLn, +aendLn, false);
			updateSlider(+astLn, +aendLn);
		}
	}
	
	function getUvachaCount(st, en) {
		_uvachaCount = 0;
		for (i = st; i < en; i++) {
			var shl = _entireChapterData.shloka[i];
			var numEntries = shl.entry.length;

			for (j = 0; j < numEntries; j++) {
				if (shl.entry[j].text.includes(Sanscript.t("उवाच", "devanagari", _lang))) {
					_uvachaCount++;
				}
			}
		}
		return _uvachaCount;
	}

	function getCurrentLinePl(currTime) {
		_startWordPos = 0;
		for (i = 0; i < _numShlokasInChap; i++) {
			var shl = _entireChapterData.shloka[i];
			var numEntries = shl.entry.length;
			var stTm = +shl.entry[0].startTime;
			var endTm = +shl.entry[numEntries - 1].endTime;

			_startWordPos = _startWordPos + +numEntries;
			
			if (shl.entry[numEntries - 1].text.includes('||')) {
				_nbrOfLineInShloka = 2;
			} else {
				_nbrOfLineInShloka = 1;
			}
			if (currTime > stTm && currTime < endTm) {
				_playLine = i;
				_currPlayShlokaEndTime = endTm;
				_currPlayShlokaStartTime = stTm;
				if (_prevPlayLine != _playLine) {
					if (getUvachaCount(_prevPlayLine, _playLine) > 0) {
						_uvacha = true;
					} else {
						_uvacha = false;
					}
				}
				if (shl.shlokaNum == _empty) {
					_oneLine = true;
				} else {
					_oneLine = false;
				}
				_startWordPos = _startWordPos - +numEntries;
				break;
			}
		}
	}


	function populateAllSholkasPl() {
		if (_secDtlsArrDisplay != null) { //empty it out
			_secDtlsArrDisplay.splice(0, _secDtlsArrDisplay.length);
		}
		for (i = 0; i < _entireChapterData.shloka.length; i++) {
			var shl = _entireChapterData.shloka[i];
			var numEntries = shl.entry.length;

			for (j = 0; j < numEntries; j++) {
				_secDtlsArrDisplay.push({
					text: shl.entry[j].text,
					startTime: shl.entry[j].startTime,
					endTime: shl.entry[j].endTime,
					swhtsp: shl.entry[j].swhtsp,
					shlNbr: shl.entry[j].shlNbr,
					sty: shl.entry[j].sty
				});
			}
		}
	}


	//////////////////////////////////////////////////////////////
	// displayShlokaPl()
	//////////////////////////////////////////////////////////////
	function displayShlokaPl() {
		if (_endLn > _numShlokasInChap) {
			_endLn = _numShlokasInChap;
		}
		removeNonTextFromSecRefsPl();
		displayShlokaInitial();
		populateSecnsRefsPl();
		_prevHighlightedSec = -1;
		refreshShlokas();

		_wordCnt = _secDtlsArrDisplay.length;
//		_currWrdPos = 0;
		if (_currRepeatGoing != _para) {
			_currRepeatGoing = _word;
			_modeChanged = false;
		}
//		_currSwhtsp = _secDtlsArrDisplay[_currWrdPos].swhtsp;
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
		var sec = 0;
		var secFound = false;

		for (sec = _startWordPos; sec < _wordCnt; sec++) {
			if (curTime < _secDtlsArrDisplay[sec].endTime) {
				secFound = true;
				break;
			}
		}

		if (!secFound) {
			sec = _wordCnt - 1;
		}
		if (sec != -1)
			highlightCurSecPl(sec);
	}

	//////////////////////////////////////////////////////////////
	// highlightCurSec(sec)
	//////////////////////////////////////////////////////////////
	function highlightCurSecPl(sec) {
		if (!_oneLine) {
			if (_prevHighlightedSec == sec) {
				return;
			} else {
				unhighlightPrevSecPl(_prevHighlightedSec);
				_prevHighlightedSec = sec;
			}
		}
		var secObj = _secRefArr[sec];

		if (_teacher)
			secObj.style.color = "blue";
		else if (_student)
			secObj.style.color = "brown";
		//secObj.style.fontWeight = "bold";
	}

	//////////////////////////////////////////////////////////////
	// unhighlightPrevSec(sec)
	//////////////////////////////////////////////////////////////
	function unhighlightPrevSecPl(sec) {
		if (sec < 0) return;
		var secObj = _secRefArr[sec];
		if (!secObj) {
			console.log(sec);
		} else {
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
		if (_secRefArr != null) {
			_secRefArr.splice(0, _secRefArr.length);
		}

		for (var i = 0; i < _secDtlsArrDisplay.length; i++) {
			var secRef = document.getElementById("" + i);
			_secRefArr.push(secRef);
		}
	}


	//////////////////////////////////////////////////////////////
	// displayShlokaInitial()
	//////////////////////////////////////////////////////////////
	function displayShlokaInitial() {
		displayShlokaInitialPP();
	}

	function displayShlokaInitialPP() {
		var bigStr = "<p>";
		var secId = 0;
		for (i = 0; i < _secDtlsArrDisplay.length; i++) {
			var secDtls = _secDtlsArrDisplay[i];
			var sty = secDtls.sty;
			if ($.trim(secDtls.startTime) == "") {
				bigStr += "<span>";
				bigStr += secDtls.text;
				bigStr += "</span>";
			} else {
				bigStr += "<button class=\"secButton " + sty + "\" id=\"" + secId + "\" onclick=\"secBtnPressed('" + secId + "', '" + i + "')\">";
				bigStr += secDtls.text;
				bigStr += "</button> &nbsp;"
				secId++;
			}

			var whtsp = secDtls.swhtsp;
			switch (whtsp) {
				case "w":
					bigStr += "&nbsp;";
					break;
				case "p":
					bigStr += "&nbsp;&nbsp;&nbsp;";
					break;
				case "l":
					bigStr += "<br>";
					break;
				case "":
					bigStr += "<p>";
					break;
				default:
					break;
			}
			document.getElementById("shloka-display").innerHTML = bigStr;
		}
	}



	//////////////////////////////////////////////////////////////
	// tmUpdLsrPl()
	// Time update listener for the media player.
	// IMPORTANT FUNCTION.
	//////////////////////////////////////////////////////////////
	function tmUpdLsrPl(mediaElement) {

		_curTime = mediaElement.currentTime;
		getCurrentLinePl(_curTime);
		highlightSecPl(_curTime);


		if (_repeatStatus == "repeatOne" && _curTime > _endWPos) {
			mediaElement.currentTime = _startWPos;
		}

		if (_curTime > _endPos && _repeatStatus != "repeatOne") {
			mediaElement.currentTime = _startPos;
			_stLn = _sliderStartingtPos;
			_endLn = +_stLn + +_nbrOfLines;
			scrollDisplayPl(true, ((_sliderStartingtPos - _sliderEndingPos) + (_nbrOfLines - 3)), _sliderSpeed, getUvachaCount(+_sliderStartingtPos, +_sliderEndingPos), "TMP");
			_sliderMove = false;
			_scrollText = false;
			console.log("Reset to start...");
		}

		if (_prevPlayLine != _playLine) {
			_prevPlayLine = _playLine;
			updateSlider(_playLine, _sliderEndPos);
			if (_playLine != 0 && !_sliderMove) {
				_scrollText = true;
				_sliderMove = false;
			}
		}

		if (_scrollText && (_endLn - 2) <= _numShlokasInChap) {
			_stLn++;
			_endLn++;
			if (_uvacha)
				cnt = 1;
			else
				cnt = 0;

			scrollDisplayPl(true, 1, _sliderSpeedDef, cnt, "TMP");
			_scrollText = false;
		}
	}


	function playAudioRangesPl(start, end) {
		_startWPos = +start;
		_endWPos = +end;
		_mediaElementRef.currentTime = _startWPos;
		_mediaElementRef.play();
	}


	function scrollDisplayPl(autoT, slPos, speed, uvaCnt, whr) {
		if(_sliderStartPos == 0) {
		   	$('.shloka-display').css({
				marginTop: ""
			});
			console.log("Pointer Starting ...");
			return true;
		}
		if (autoT) {
			_screenSize = _tmpPosForwardPl;
			if($(window).width() < 768) {
				_screenSize = _tmpPosForwardPl * .8;
			}
			if($(window).width() < 321) {
				_screenSize = _tmpPosForwardPl * .9;
			}
			slPos = _screenSize * +slPos;
			if (+slPos < 0) {
				uvaCnt = uvaCnt * -1;
			}
			if (uvaCnt != 0) {
				slPos = slPos + (uvaCnt * _tmpPosFwdUvaPl * .7);
			}
			$('.shloka-display').animate({
				'marginTop': '-=' + slPos
			}, speed);
		}
		console.log('slPosPl: ' + slPos + " | whr: " + whr);
	}









	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//
	//    tutor_sp.js
	//
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

	function sliderPlayRangeTu(slSt, slEnd, isTop) {
		_shlokaCntr = slSt;
		_shlokaLine = 0;
		getShlokaStartTmAndWrdCntTu(_shlokaCntr);
		_mediaElementRef.currentTime = _currStTm;
		_sliderDiff = slSt - _sliderStartingtPos;

		scrollDisplayTu(true, _sliderDiff, _sliderSpeed, 0);

		_sliderStartingtPos = _playLine = slSt;
		_sliderEndingPos = slEnd;
	}

	function getUvachaCountTu(st, en) {
		_uvachaCount = 0;
		for (i = st; i < en; i++) {
			var shl = _entireChapterData.shloka[i];
			var numEntries = shl.entry.length;
			for (j = 0; j < numEntries; j++) {
				if (shl.entry[j].teacher == "YS") {
					if (shl.entry[j].text.includes(Sanscript.t("उवाच", "devanagari", _lang))) {
						_uvachaCount++;
					}
				}
			}
		}
		return _uvachaCount;
	}

	function scrollDisplayTu(autoT, slPos, speed, uvaCnt) {
		if(_sliderStartPos == 0) {
		   	$('.shloka-display').css({
				marginTop: ""
			});
			console.log("Pointer Starting ...");
			return true;
		}
		if (autoT) {
			_screenSize = _tmpPosForwardPl;
			if($(window).width() < 768) {
				_screenSize = _tmpPosForwardPl * .8;
			}
			if($(window).width() < 321) {
				_screenSize = _tmpPosForwardPl * .9;
			}
			slPos = _screenSize * +slPos;
			if (+slPos < 0) {
				uvaCnt = uvaCnt * -1;
			}
			if (uvaCnt != 0) {
				slPos = slPos + (uvaCnt * _tmpPosFwdUvaTu * .7);
			}
			$('.shloka-display').animate({
				'marginTop': '-=' + slPos
			}, speed);
		}
		console.log('slPosTu: ' + slPos);
	}


	function populateAllSholkasTu() {
		if (_secDtlsArrDisplay != null) { //empty it out
			_secDtlsArrDisplay.splice(0, _secDtlsArrDisplay.length);
		}

		for (i = 0; i < _entireChapterData.shloka.length; i++) {
			var shl = _entireChapterData.shloka[i];
			var numEntries = shl.entry.length;

			for (j = 0; j < numEntries; j++) {
				if (shl.entry[j].teacher == "YS") {
					_secDtlsArrDisplay.push({
						text: shl.entry[j].text,
						startTime: shl.entry[j].startTime,
						endTime: shl.entry[j].endTime,
						swhtsp: shl.entry[j].swhtsp,
						shlNbr: shl.entry[j].shlNbr,
						sty: shl.entry[j].sty
					});
				}
			}
		}

	}

	//////////////////////////////////////////////////////////////
	// displayShlokaTu()
	//////////////////////////////////////////////////////////////
	function displayShlokaTu() {
		if (_endLn > _numShlokasInChap) {
			_endLn = _numShlokasInChap;
		}

		removeNonTextFromSecRefsTu();
		displayShlokaInitialTu();
		populateSecnsRefsTu();
		_prevHighlightedSec = -1;
		refreshShlokas();
		_wordCnt = _secDtlsArrDisplay.length;
//		_currWrdPos = 0;

		if (_currRepeatGoing != _para) {
			_currRepeatGoing = _word;
			_modeChanged = false;
		}
//		_currSwhtsp = _secDtlsArrDisplay[_currWrdPos].swhtsp;
	}

	//////////////////////////////////////////////////////////////
	// displayShlokaInitialTu()
	//////////////////////////////////////////////////////////////
	function displayShlokaInitialTu() {
		displayShlokaInitialPPTu();
	}

	function displayShlokaInitialPPTu() {
		var bigStr = "<p>";
		var secId = 0;

		for (i = 0; i < _secDtlsArrDisplay.length; i++) {
			var secDtls = _secDtlsArrDisplay[i];
			var sty = secDtls.sty;

			if ($.trim(secDtls.startTime) == "") {
				bigStr += "<span>";
				bigStr += secDtls.text;
				bigStr += "</span>";
			} else {
				bigStr += "<button class=\"secButton " + sty + "\" id=\"" + secId + "\" onclick=\"secBtnPressedTu('" + secId + "', '" + i + "')\">";
				bigStr += secDtls.text;
				bigStr += "</button> &nbsp;"
				secId++;
			}

			var whtsp = secDtls.swhtsp;
			switch (whtsp) {
				case "w":
					bigStr += "&nbsp;";
					break;
				case "p":
					bigStr += "&nbsp;&nbsp;&nbsp;";
					break;
				case "l":
					bigStr += "<br>";
					break;
				case "":
					bigStr += "<p>";
					break;
				default:
					break;
			}
			document.getElementById("shloka-display").innerHTML = bigStr;
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
	function secBtnPressedTu(btnId, lineNbr) {
		var btnObj = _secRefArr[btnId];
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
			_endPos = +shl.entry[numEntries - 1].endTime;
		} else {
			_mediaElementRef.pause();
			updateRepeatButtonStatus("repeatOne");
			_repeatStatus = "repeatOne";
			_playsStatus = "notplaying";
			//getTimingForText(btnObj.textContent, "");
			showPlay();
			$("#plays_btn").click();
		}
	}

	function getTimingForText(txt, whichpnt) {
		for (i = 0; i < _numShlokasInChap; i++) {
			var shl = _entireChapterData.shloka[i];
			var numEntries = shl.entry.length;

			for (j = 0; j < numEntries; j++) {
				if (txt == shl.entry[j].text && shl.entry[j].teacher == "YS") {
					if (whichpnt == "") {

					}
					if (whichpnt == "S") {
						_startPos = shl.entry[j].startTime;
						return _startPos;
					}
					if (whichpnt == "E") {
						_endPos = shl.entry[j].endTime;
						return _endPos;
					}
				}
			}
		}
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

	}

	//////////////////////////////////////////////////////////////
	// highlightSec()
	// - Highlights the current section being played
	//////////////////////////////////////////////////////////////
	function highlightSecTu(txt, shlNbr) {
		var sec = 0;
		var secFound = false;

		for (sec = 0; sec < _wordCnt; sec++) {
			if (txt == _secDtlsArrDisplay[sec].text) {
				secFound = true;
				break;
			}
		}

		if (!secFound) {
			sec = _wordCnt - 1;
		}
		if (sec != -1)
			highlightCurSecTu(sec);
	}


	//////////////////////////////////////////////////////////////
	// highlightCurSec(sec)
	//////////////////////////////////////////////////////////////
	function highlightCurSecTu(sec) {
		if (!_oneLine) {
			if (_teacher && _prevHighlightedSec == sec) {
				return;
			} else {
				unhighlightPrevSecTu(_prevHighlightedSec);
				_prevHighlightedSec = sec;
			}
		}
		var secObj = _secRefArr[sec];
		if (secObj != null) {
			if (_teacher)
				secObj.style.color = "blue";
			else if (_student)
				secObj.style.color = "brown";
		}
	}


	//////////////////////////////////////////////////////////////
	// unhighlightPrevSec(sec)
	//////////////////////////////////////////////////////////////
	function unhighlightPrevSecTu(sec) {
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
		if (_secRefArr != null) {
			_secRefArr.splice(0, _secRefArr.length);
		}

		for (var i = 0; i < _secDtlsArrDisplay.length; i++) {
			var secRef = document.getElementById("" + i);
			_secRefArr.push(secRef);
		}
	}


	function getShlokaStartTmAndWrdCntTu(lineNumber) {
		if (lineNumber != _sliderEndPos) {
			shl = _entireChapterData.shloka[lineNumber];
			numEntries = shl.entry.length;

			_prevStTm = _currStTm;
			_prevEndTm = _currEndTm;
			_prevJump = _currJump;

			if (_shlokaLine < numEntries) {
				_currStTm = +shl.entry[_shlokaLine].startTime;
				_currEndTm = +shl.entry[_shlokaLine].endTime;
				_currJump = shl.entry[_shlokaLine].jump;
				jsonTeacher = shl.entry[_shlokaLine].teacher;
				jsonText = shl.entry[_shlokaLine].text;
				if (jsonTeacher.includes("Y")) {
					_teacher = true;
					_student = false;
				} else {
					_teacher = false;
					_student = true;
				}
			}

			if ((_shlokaLine + 1) < numEntries) {
				_nextStTm = +shl.entry[_shlokaLine + 1].startTime;
				_nextEndTm = +shl.entry[_shlokaLine + 1].endTime;
				_nextJump = shl.entry[_shlokaLine + 1].jump;
			}
		} else {}
	}


	function getCurrTimeText(curTm) {
		for (i = 0; i < _numShlokasInChap; i++) {
			var shl = _entireChapterData.shloka[i];
			var numEntries = shl.entry.length;

			for (j = 0; j < numEntries; j++) {
				var stTm = +shl.entry[j].startTime;
				var endTm = +shl.entry[j].endTime;
				if (curTm > stTm && curTm < endTm) {
					console.log("i: " + i + " j: " + j);
					return shl.entry[j].text;
				}
				
			}
		}

		return "";
	}
	//////////////////////////////////////////////////////////////
	// tmUpdLsrTu()
	// Time update listener for the media player.
	// IMPORTANT FUNCTION.
	//////////////////////////////////////////////////////////////
	function tmUpdLsrTu(mediaElement) {
		if (_entireChapterData == null || _entireChapterData.shloka == null) {
			return false;
		}
		_curTime = mediaElement.currentTime;

		if (_repeatStatus == "repeatOne") {
			if (_curTime > _endPos) {
				_mediaElementRef.currentTime = _startPos;
			}
			highlightSecTu(getCurrTimeText(_curTime), "");
			return false;
		}

		if (_onlyOnceTeacher) {
			getShlokaStartTmAndWrdCntTu(_shlokaCntr);
			_onlyOnceTeacher = false;
		}

		if (_curTime > _currEndTm) {
			if (_shlokaLine == (numEntries - 1)) {
				_shlokaLine = 0;
				_shlokaCntr++;
				updateSlider(_shlokaCntr, _sliderEndPos);
				if ((_shlokaCntr + 1) < _sliderEndPos) {
					scrollDisplayTu(true, 1, _sliderSpeedDef, getUvachaCountTu(_shlokaCntr - 1, _shlokaCntr));
				}
			} else {
				_shlokaLine++;
				if (_currJump == "Y") {
					if (_teacher)
						mediaElement.currentTime = _nextStTm;
					if (_student)
						mediaElement.currentTime = (_nextStTm - 0.3000);
				}
			}
			getShlokaStartTmAndWrdCntTu(_shlokaCntr);
		}



		if (_shlokaCntr == _sliderEndingPos && _sliderStartingtPos != _sliderEndingPos) {
			//			sliderPlayRangeTu(_sliderStartingtPos, _sliderEndingPos, false);
			scrollDisplayTu(true, ((_sliderStartingtPos - _sliderEndingPos) + (_nbrOfLines - 3)), _sliderSpeed, getUvachaCountTu(+_sliderStartingtPos, +_sliderEndingPos));
			console.log("Tu Reset to start...");
			_shlokaLine = 0;
			_shlokaCntr = _sliderStartingtPos;
			getShlokaStartTmAndWrdCntTu(_shlokaCntr);
			mediaElement.currentTime = _currStTm;
			_stLn = _sliderStartingtPos;
			_endLn = +_stLn + +_nbrOfLines;
			updateSlider(_shlokaCntr - 1, _sliderEndPos);
		}

		highlightSecTu(jsonText, _shlokaCntr);

		if (_shlokaCntr > (_stLn + _endLn) / 2 && !_insideF && _endLn < _numShlokasInChap) {
			_stLn++;
			_endLn++;
			_insideF = false;
		}
	}

	function playAudioRangesTu(start, end) {
		_startPos = +start;
		_endPos = +end;
		_mediaElementRef.currentTime = _startPos;
		_curTime = _startPos;
		_mediaElementRef.play();
	}


	$(".dropdown-menu li a").click(function() {
		$(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
		$(this).parents(".dropdown").find('.btn').val($(this).data('value'));
	});