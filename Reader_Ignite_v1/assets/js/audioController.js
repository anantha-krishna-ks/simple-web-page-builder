var IsAudioSync = false;
var ArrAllPageAudElem = [];

// AUDIO SPEED CONTROLS - STARTS

var scLabel = $("#scLabel");
var playbackrange = document.querySelector('#pbrange');
playbackrange.addEventListener('input', e => {
  config.PLAYBACKSPEED = playbackrange.value;
  scLabel.html(config.PLAYBACKSPEED + "x");
  //console.log(playbackrange.value);
});

function CheckIfAudPopupOpen(){
  if($("#AudPopupMainCont").hasClass("ClsOpen")){
    return true;
  }
  else {return false;}
}

function OpenAudPopup(){
  $("#AudPopupMainCont").removeClass("ClsClose").addClass("ClsOpen");
  SelectTool("IcAudio");
  UnbindNoteEventFromPage(); //remove note crosshair cursor
  playbackrange.value = config.PLAYBACKSPEED;
  scLabel.html(config.PLAYBACKSPEED + "x");
  //console.log(config.PLAYBACKSPEED);
}

function CloseAudPopup(){
  $("#AudPopupMainCont").removeClass("ClsOpen").addClass("ClsClose");
  EnableAllTool();
  DeselectAllTool();
}

function OnAudioSpeedClick(){   
  var AudPopupMainCont = document.querySelector('#AudPopupMainCont');
  if (AudPopupMainCont.classList.contains("ClsOpen")){
    CloseAudPopup();
  } 
  else {
    OpenAudPopup();
  }
}

// AUDIO SPEED CONTROLS - ENDS

function playPageAud(e) {
  $("#dropMenu").removeClass("open");
  //console.log(e.target.id);  
  try {
    UpdateAudioInfo(e.target.id); // from pageController
    AudConfig.IsSingleWSClick = false;
    if (e.target.attributes["data-isaudsynch"] != undefined) {
      if (e.target.attributes["data-isaudsynch"].nodeValue == "true") { IsAudioSync = true; }
      else if (e.target.attributes["data-isaudsynch"].nodeValue == "false") { IsAudioSync = false; }
    }
    else { IsAudioSync = true; }

    //console.log(AudConfig.PageID, "page" + (e.target.parentNode.id).substring(1), AudConfig.AudID, e.target.parentNode.id + "Aud" + e.target.attributes["data-value"].nodeValue)
    if ((AudConfig.PageID == "page" + (e.target.parentNode.id).substring(1)) && (AudConfig.AudID == e.target.parentNode.id + "Aud" + e.target.attributes["data-value"].nodeValue)) {
      var AudElement = $("#" + AudConfig.PageID + " > iframe").contents().find("#" + AudConfig.AudID);
      if (AudElement.attr("data-status") == 0) {
        //console.log(AudElement);
        AudElement[0].playbackRate = config.PLAYBACKSPEED;
        AudElement[0].play();
        AudElement.attr("data-status", 1);
        AudConfig.IsAudioPaused = false;
        BindAudioTimeUpdate(AudElement[0]);
      }
      else if (AudElement.attr("data-status") == 1) {
        AudElement[0].pause();
        UnbindAudioTimeUpdate();
        AudElement.attr("data-status", 0);
        AudConfig.IsAudioPaused = true;

        if (AudConfig.ReadType == "s") {
          //$("#"+AudConfig.PageID + " > iframe").contents().find("#"+ArrAudSentData[2][AudConfig.AudStepCounter].ID + "> div").removeClass("ClsHighlight");
          $("#" + AudConfig.PageID + " > iframe").contents().find("div").removeClass("ClsHighlight");
        }
        else if (AudConfig.ReadType == "w") {
          $("#" + AudConfig.PageID + " > iframe").contents().find("div").removeClass("ClsHighlight");
        }
      }
    }
    else {
      StopLastPageAudio();
      setTimeout(function () {
        AudConfig.IsSingleWSClick = false;
        if (e.target.attributes["data-isaudsynch"] != undefined) {
          if (e.target.attributes["data-isaudsynch"].nodeValue == "true") { IsAudioSync = true; }
          else if (e.target.attributes["data-isaudsynch"].nodeValue == "false") { IsAudioSync = false; }
        }
        else { IsAudioSync = true; }

        AudConfig.AudPageNo = Number((e.target.parentNode.id).substring(1));
        AudConfig.PageID = "page" + (e.target.parentNode.id).substring(1);
        AudConfig.AudID = e.target.parentNode.id + "Aud" + e.target.attributes["data-value"].nodeValue;
        var AudElement = $("#" + AudConfig.PageID + " > iframe").contents().find("#" + AudConfig.AudID);

        AudElement[0].playbackRate = config.PLAYBACKSPEED;
        AudElement[0].play();
        AudElement.attr("data-status", 1);
        AudConfig.IsAudioPaused = false;
        if ($("#" + AudConfig.PageID + " > iframe").contents().find("#" + AudConfig.AudID)[0].attributes["data-startstepcounter"] != undefined) {
          AudConfig.AudStepCounter = Number($("#" + AudConfig.PageID + " > iframe").contents().find("#" + AudConfig.AudID)[0].attributes["data-startstepcounter"].nodeValue);
        }
        else {
          AudConfig.AudStepCounter = 0;
        }

        if (IsAudioSync) {
          if ($("#" + AudConfig.PageID + " > iframe").contents().find("#" + AudConfig.AudID)[0].attributes["data-startstepcounter"] != undefined) {
            AudConfig.AudStepCounter = Number($("#" + AudConfig.PageID + " > iframe").contents().find("#" + AudConfig.AudID)[0].attributes["data-startstepcounter"].nodeValue);
          }
          else {
            AudConfig.AudStepCounter = $("#" + AudConfig.PageID + " > iframe").contents().find("#" + AudConfig.AudID)[0].attributes["data-stepcounter"].value;
          }
        }
        else {
          AudElement[0].currentTime = Number((Number(($("#" + AudConfig.PageID + " > iframe").contents().find("#" + AudConfig.AudID)[0].attributes["data-stepcounter"].value))).toFixed(3));
        }

        BindAudioTimeUpdate(AudElement[0]);
      }, 5);
    }
  }
  catch (error) {

  }

}

function UnbindAudioTimeUpdate() {
  try {
    clearInterval(AudConfig.AudTimeUpdate);
    AudConfig.AudTimeUpdate = null;
  }
  catch (error) { }
}

function BindAudioTimeUpdate(AudElement) {
  UnbindAudioTimeUpdate();
  AudConfig.AudTimeUpdate = setInterval(function () {
    // console.log("Update");
    AudElement.playbackRate = config.PLAYBACKSPEED;
    var CurrTime = AudElement.currentTime.toFixed(3);
    if (!AudConfig.IsAudioPaused) {
      if (!AudConfig.IsSingleWSClick) {
        //console.log(CurrTime);
        if (IsAudioSync) {
          // audio - with highlight
          if (AudConfig.ReadType == "s") {
            if (ArrAudSentData[AudConfig.AudPageNo][AudConfig.AudStepCounter] != undefined) {
              if (CurrTime >= ArrAudSentData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ST && CurrTime < ArrAudSentData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ET) {
                $("#" + AudConfig.PageID + " > iframe").contents().find("#" + ArrAudSentData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ID + "> div").addClass("ClsHighlight");
                let TempNodeArr = FindNodeWithAttr(ArrAudSentData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ID);
                if (TempNodeArr.length > 0) {
                  for (var t = 0; t < TempNodeArr.length; t++) {
                    let TempClsName = $("#" + AudConfig.PageID + " > iframe").contents().find("#" + TempNodeArr[t]).attr("data-audhlt");
                    $("#" + AudConfig.PageID + " > iframe").contents().find("#" + TempNodeArr[t]).addClass(TempClsName);
                    if (CheckDupNodeAudHigh(TempNodeArr[t]) == false) {
                      AddNodeAudHigh(TempNodeArr[t], AudConfig.AudPageNo);
                    }
                  }
                }
              }
              if (CurrTime > ArrAudSentData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ET) {
                $("#" + AudConfig.PageID + " > iframe").contents().find("#" + ArrAudSentData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ID + "> div").removeClass("ClsHighlight");
                //console.log("Here");        
                AudConfig.AudStepCounter++;
                $("#" + AudConfig.PageID + " > iframe").contents().find("#" + AudConfig.AudID)[0].attributes["data-stepcounter"].value = AudConfig.AudStepCounter;
              }
            }
          }
          else if (AudConfig.ReadType == "w") {
            //console.log(ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter]);            
            if (ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter] != undefined) {
              if (CurrTime >= ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ST && CurrTime < ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ET) {
                if ($("#" + AudConfig.PageID + " > iframe").contents().find("#" + ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ID).attr("data-audhlt") != undefined) {
                  let TempClsName = $("#" + AudConfig.PageID + " > iframe").contents().find("#" + ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ID).attr("data-audhlt");
                  $("#" + AudConfig.PageID + " > iframe").contents().find("#" + ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ID).addClass(TempClsName);
                  if (CheckDupNodeAudHigh(ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ID) == false) {
                    AddNodeAudHigh(ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ID, AudConfig.AudPageNo);
                  }
                }
                else {
                  $("#" + AudConfig.PageID + " > iframe").contents().find("#" + ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ID).addClass("ClsHighlight");
                }
              }
              if (CurrTime > ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ET) {
                $("#" + AudConfig.PageID + " > iframe").contents().find("#" + ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ID).removeClass("ClsHighlight");
                //console.log("Here");
                AudConfig.AudStepCounter++;
                $("#" + AudConfig.PageID + " > iframe").contents().find("#" + AudConfig.AudID)[0].attributes["data-stepcounter"].value = AudConfig.AudStepCounter;
              }
            }
          }
        }
        else {
          // only audio - no highlight
          $("#" + AudConfig.PageID + " > iframe").contents().find("#" + AudConfig.AudID)[0].attributes["data-stepcounter"].value = AudElement.currentTime.toFixed(3);
        }
      }
      else {
        if (AudConfig.ReadType == "s") {
          if (ArrAudSentData[AudConfig.AudPageNo][AudConfig.AudStepCounter] != undefined) {
            if (CurrTime >= ArrAudSentData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ST && CurrTime < ArrAudSentData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ET) {
              $("#" + AudConfig.PageID + " > iframe").contents().find("#" + ArrAudSentData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ID + "> div").addClass("ClsHighlight");
              let TempNodeArr = FindNodeWithAttr(ArrAudSentData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ID);
              if (TempNodeArr.length > 0) {
                for (var t = 0; t < TempNodeArr.length; t++) {
                  let TempClsName = $("#" + AudConfig.PageID + " > iframe").contents().find("#" + TempNodeArr[t]).attr("data-audhlt");
                  $("#" + AudConfig.PageID + " > iframe").contents().find("#" + TempNodeArr[t]).addClass(TempClsName);
                  if (CheckDupNodeAudHigh(TempNodeArr[t]) == false) {
                    AddNodeAudHigh(TempNodeArr[t], AudConfig.AudPageNo);
                  }
                }
              }
            }
            if (CurrTime > ArrAudSentData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ET) {
              $("#" + AudConfig.PageID + " > iframe").contents().find("#" + ArrAudSentData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ID + "> div").removeClass("ClsHighlight");
              //console.log("Here");        
              AudConfig.AudStepCounter++;
              $("#" + AudConfig.PageID + " > iframe").contents().find("#" + AudConfig.AudID)[0].attributes["data-stepcounter"].value = AudConfig.AudStepCounter;
              PausePageAudio();
            }
          }
        }
        else if (AudConfig.ReadType == "w") {
          if (ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter] != undefined) {
            if (CurrTime >= ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ST && CurrTime < ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ET) {
              ///$("#"+AudConfig.PageID + " > iframe").contents().find("#"+ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ID).addClass("ClsHighlight");  

              if ($("#" + AudConfig.PageID + " > iframe").contents().find("#" + ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ID).attr("data-audhlt") != undefined) {
                let TempClsName = $("#" + AudConfig.PageID + " > iframe").contents().find("#" + ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ID).attr("data-audhlt");
                $("#" + AudConfig.PageID + " > iframe").contents().find("#" + ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ID).addClass(TempClsName);
                if (CheckDupNodeAudHigh(ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ID) == false) {
                  AddNodeAudHigh(ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ID, AudConfig.AudPageNo);
                }
              }
              else {
                $("#" + AudConfig.PageID + " > iframe").contents().find("#" + ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ID).addClass("ClsHighlight");
              }


            }
            if (CurrTime > ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ET) {
              $("#" + AudConfig.PageID + " > iframe").contents().find("#" + ArrAudWordData[AudConfig.AudPageNo][AudConfig.AudStepCounter].ID).removeClass("ClsHighlight");
              //console.log("Here");
              AudConfig.AudStepCounter++;
              $("#" + AudConfig.PageID + " > iframe").contents().find("#" + AudConfig.AudID)[0].attributes["data-stepcounter"].value = AudConfig.AudStepCounter;
              PausePageAudio();
            }
          }
        }
      }
    }
  }, 5);
}

function onPageAudioEnded(e) {
  var AudElement = $("#" + AudConfig.PageID + " > iframe").contents().find("#" + AudConfig.AudID);
  e.target.currentTime = 0;
  AudElement[0].pause();
  UnbindAudioTimeUpdate();
  AudElement.attr("data-status", 0);
  AudConfig.IsAudioPaused = true;
  if ($("#" + AudConfig.PageID + " > iframe").contents().find("#" + AudConfig.AudID)[0].attributes["data-startstepcounter"] != undefined) {
    AudConfig.AudStepCounter = Number($("#" + AudConfig.PageID + " > iframe").contents().find("#" + AudConfig.AudID)[0].attributes["data-startstepcounter"].nodeValue);
  }
  else {
    AudConfig.AudStepCounter = 0;
  }

  $("#" + AudConfig.PageID + " > iframe").contents().find("#" + AudConfig.AudID)[0].attributes["data-stepcounter"].value = AudConfig.AudStepCounter;
  $("#" + AudConfig.PageID + " > iframe").contents().find("div").removeClass("ClsHighlight");
  IsAudioSync = false;
}


function PausePageAudio() {
  var AudElement = $("#" + AudConfig.PageID + " > iframe").contents().find("#" + AudConfig.AudID);
  AudElement[0].pause();
  UnbindAudioTimeUpdate();
  AudElement.attr("data-status", 0);
  AudConfig.IsAudioPaused = true;
  $("#" + AudConfig.PageID + " > iframe").contents().find("div").removeClass("ClsHighlight");
}

function StopLastPageAudio() {
  //console.log(AudConfig.PageID, AudConfig.AudID);
  if (AudConfig.PageID != null && AudConfig.AudID != null) {
    var AudElement = $("#" + AudConfig.PageID + " > iframe").contents().find("#" + AudConfig.AudID);
    if (AudElement != undefined) {
      AudElement[0].pause();
      UnbindAudioTimeUpdate();
      AudElement.attr("data-status", 0);
      AudConfig.IsAudioPaused = true;
      IsAudioSync = false;
      //$("#"+AudConfig.PageID + " > iframe").contents().find("#"+AudConfig.AudID)[0].attributes["data-stepcounter"].value = AudConfig.AudStepCounter;
      $("#" + AudConfig.PageID + " > iframe").contents().find("div").removeClass("ClsHighlight");
      AudConfig.AudStepCounter = 0;
    }
  }

}

function StopAllPageAudio() {
  for (var i = 0; i < ArrAllPageAudElem.length; i++) {
    for (var j = 0; j < ArrAllPageAudElem[i].length; j++) {
      // if(ArrAllPageAudElem[i][j].paused == false){
      //   ArrAllPageAudElem[i][j].pause();                        
      // }
      ArrAllPageAudElem[i][j].pause();
      UnbindAudioTimeUpdate();
      if (ArrAllPageAudElem[i][j].attributes['data-status'] != undefined || ArrAllPageAudElem[i][j].attributes['data-status'] != 'undefined' || ArrAllPageAudElem[i][j].attributes['data-status'] != null) {
        ArrAllPageAudElem[i][j].setAttribute('data-status', 0);
      }
      $("#" + AudConfig.PageID + " > iframe").contents().find("div").removeClass("ClsHighlight");
      AudConfig.IsAudioPaused = true;
      IsAudioSync = false;
      ArrAllPageAudElem[i][j].currentTime = 0;
      AudConfig.AudStepCounter = 0;
    }
  }
}

function CollectAllPageAudElem() {
  ArrAllPageAudElem = [];
  for (var i = 0; i < config.bounds.length; i++) {
    var ArrSubAudElem = $("#page" + i + " > iframe").contents().find('audio');
    ArrAllPageAudElem.push(ArrSubAudElem);
  }
  //console.log(ArrAllPageAudElem);
}


function ResetAllPageAudData() {
  StopAllPageAudio();
  //AudConfig.CurrPageNo = 0;
  AudConfig.AudStepCounter = 0;
  AudConfig.PageID = null;
  AudConfig.AudPageNo = null;
  AudConfig.AudID = null,
    AudConfig.IsAudioPaused = true;
  AudConfig.IsSingleWSClick = false;
  IsAudioSync = false;
  UnbindAudioTimeUpdate();
}

/*-- Word - Sentance : Starts --*/

function playPageWSAud(e) {
  try {
    IsAudioSync = true;
    AudConfig.IsSingleWSClick = true;
    StopLastPageAudio();
    //console.log(Number((e.target.parentNode.parentNode.id).substring(1)), (e.target.parentNode.parentNode.id).substring(1));
    if (Number((e.target.parentNode.parentNode.id).substring(1)) != null && Number((e.target.parentNode.parentNode.id).substring(1)) != '') {
      //sentance case
      AudConfig.AudPageNo = Number((e.target.parentNode.parentNode.id).substring(1));
    }
    else {
      //word case
      AudConfig.AudPageNo = Number((e.target.parentNode.id).substring(1));
    }

    if ((e.target.parentNode.parentNode.id).substring(1) != null && (e.target.parentNode.parentNode.id).substring(1) != '') {
      //sentance case
      AudConfig.PageID = "page" + (e.target.parentNode.parentNode.id).substring(1);
    }
    else {
      //word case
      AudConfig.PageID = "page" + (e.target.parentNode.id).substring(1);
    }

    AudConfig.AudID = e.target.attributes["data-audio"].value;

    var AudElement = $("#" + AudConfig.PageID + " > iframe").contents().find("#" + AudConfig.AudID);
    var ObjIndex = null;
    if (AudConfig.ReadType == "s") {
      //sentance case
      ObjIndex = GetWSIndexVal(e.target.parentNode.id);
    }
    else if (AudConfig.ReadType == "w") {
      //word case
      ObjIndex = GetWSIndexVal(e.target.id);
    }

    AudElement[0].currentTime = ObjIndex.ST;
    $("#" + AudConfig.PageID + " > iframe").contents().find("#" + AudConfig.AudID)[0].attributes["data-stepcounter"].value = ObjIndex.Index;
    AudElement[0].playbackRate = config.PLAYBACKSPEED;
    AudElement[0].play();
    BindAudioTimeUpdate(AudElement[0]);
    AudElement.attr("data-status", 1);
    setTimeout(function () {
      AudConfig.IsAudioPaused = false;
      AudConfig.AudStepCounter = $("#" + AudConfig.PageID + " > iframe").contents().find("#" + AudConfig.AudID)[0].attributes["data-stepcounter"].value;
    }, 5);


    //console.log($("#"+AudConfig.PageID + " > iframe").contents().find("#"+e.target.id)[0].attributes["style"]);
    if ($("#" + AudConfig.PageID + " > iframe").contents().find("#" + e.target.id)[0].attributes["data-ishigh"]) {
      SelectedPageNo = AudConfig.PageID;
      SelectedHighID = e.target.id;
      ShowHighlightMsgBox();
    }
    // if($("#"+e.target.id)[0].hasAttribute("style")){
    //   SelectedPageNo = AudConfig.PageID;
    //   SelectedHighID = e.target.id; 
    //   ShowHighlightMsgBox();
    // }
  }
  catch (error) { }

}

function GetWSIndexVal(ID) {
  var NewObj = { "ID": "", "ST": 0.000, "ET": 0.000 };
  if (AudConfig.ReadType == "s") {
    for (var i = 0; i < ArrAudSentData[AudConfig.AudPageNo].length; i++) {
      if (ID == ArrAudSentData[AudConfig.AudPageNo][i].ID) {
        NewObj = { "ID": ArrAudSentData[AudConfig.AudPageNo][i].ID, "ST": ArrAudSentData[AudConfig.AudPageNo][i].ST, "ET": ArrAudSentData[AudConfig.AudPageNo][i].ET, "Index": i };
        return NewObj;
      }
    }
  }
  else if (AudConfig.ReadType == "w") {
    for (var i = 0; i < ArrAudWordData[AudConfig.AudPageNo].length; i++) {
      if (ID == ArrAudWordData[AudConfig.AudPageNo][i].ID) {
        NewObj = { "ID": ArrAudWordData[AudConfig.AudPageNo][i].ID, "ST": ArrAudWordData[AudConfig.AudPageNo][i].ST, "ET": ArrAudWordData[AudConfig.AudPageNo][i].ET, "Index": i };
        return NewObj;
      }
    }
  }
}