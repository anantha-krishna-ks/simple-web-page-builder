var ArrNoteBookmark = [];
var ArrNoteBookmarkLMS = [];
var sX, sY;
var closeCount = 0;


function InitNoteBookmark() {
  ArrNoteBookmark = [];
  for (var i = 0; i < config.pagecount; i++) {
    var NewObj = { "P": null, "S": false, "D": null, "sX": null, "sY": null };
    ArrNoteBookmark.push(NewObj);
  }

  //console.log(ArrNoteBookmark)
}

InitNoteBookmark();

//console.log("-----"+ArrNoteBookmark);

//AudConfig.CurrPageNo

function readNoteBookMark() {

  //console.log("call-----" + AudConfig.CurrPageNo);

  if (AudConfig.BookLayout == "magazine") {
    // for left page
    if (ArrNoteBookmark[AudConfig.CurrPageNo]["P"] == null) {

    } else {

      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).remove();

      var BookmarkTagL = "<div id= NoteBookmark" + AudConfig.CurrPageNo + " class='NoteClsBookmark' style='z-index:2; position: absolute; width: 100%; height: 100%; background: transparent; z-index: 10; top: 0px; left: 0px; cursor: crosshair;' onclick='parent.createNote(event)'></div>";
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#p" + AudConfig.CurrPageNo).append(BookmarkTagL);

      // add note
      var notesCreated = 0;
      var noteCount = 0;
      notesCreated++;
      noteCount++;
      parent.enableNotpadToggole = noteCount;
      var notecolor = 'noteColor' + (Math.floor(Math.random() * 3) + 1);
      //mouse click positions.
      sX = ArrNoteBookmark[AudConfig.CurrPageNo]["sX"];
      sY = ArrNoteBookmark[AudConfig.CurrPageNo]["sY"];
      var sPath = window.location.pathname;
      sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
      sPage = sPage.replace('.html', '');
      //for notePage
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).append("<div style= 'width: 280px; height: 250px; padding: 10px; position: absolute; background: #10FFFF; text-align: center; z-index: 10; font-family: oupi_font_normal; ' class='notePage" + noteCount + "' data-noteID='" + sPage + "_" + notesCreated + "'><button style='float: right; font-size: 32px; pointer-events: auto; cursor: pointer; background: #E01C12; width: 40px; border-radius: 40px; height: 40px; line-height: 30px; color: #fff; margin-bottom: 5px; border: none;' tabindex = '9' class='closeID' data-noteid='" + sPage + "_" + notesCreated + "' onclick='parent.closeID(event, " + AudConfig.CurrPageNo + ")'>×</button><span style='float: left; font-size: 26px; font-weight: bold;' id='noteHeading' >Note</span>" + "  </div>");

      if (notecolor == "noteColor1") {
        $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).css("background", "#fff740");
      }
      if (notecolor == "noteColor2") {
        $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).css("background", "#ff7eb9");
      }
      if (notecolor == "noteColor3") {
        $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).css("background", "#7afcff");
      }

      if (sX < 30) {
        if (sY > 429) {
          $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY - 160)).css('left', (sX + 41)).addClass("notePanel").addClass(notecolor);
        } else {
          $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY)).css('left', (sX + 41)).addClass("notePanel").addClass(notecolor);
        }
      } else if (sX > 259) {
        if (sY > 429) {
          $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY - 160)).css('left', (sX - 232)).addClass("notePanel").addClass(notecolor);
        } else {
          $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY)).css('left', (sX - 232)).addClass("notePanel").addClass(notecolor);
        }
      } else {
        if (sY > 429) {
          $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY - 160)).css('left', (sX)).addClass("notePanel").addClass(notecolor);
        } else {
          $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY)).css('left', (sX)).addClass("notePanel").addClass(notecolor);
        }
      }
      //to type the text inside the notePage
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).append("<textarea tabindex = '1' style='width: 260px; height: 150px; background: transparent; border: 0.05em dashed; font-weight: bold; outline: none; pointer-events: auto; font-size: 26px; z-index: 3; resize: none; padding: 5px;' oncick='parent.noteInputFn(this)' class='noteInput' placeholder='Enter note description here (max 50 chrs)' maxlength='50'></textarea>");
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).find("textarea").append('<style>.noteInput::placeholder{color:black}</style>');
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notepadArea").css('display', 'block').css('pointer-events', 'none').css('cursor', 'default').unbind('click').removeAttr('onclick', 'showNotePad()');
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).find(".noteInput").val(ArrNoteBookmark[AudConfig.CurrPageNo]["D"]);
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).find(".noteInput").click(function (event) {
        event.stopPropagation();
      });
      //for adding save button
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).append("<button tabindex = '2' style='border: none; float: right; margin-top: 8px; padding-top: 6px; background: #0CC; width: 65px; height: 32px; font-weight: bold; font-size: 19px; pointer-events: auto; cursor: pointer; font-family: 'oupi_font_normal';' class='saveNoteContent' onclick='parent.saveNoteContent(event, " + AudConfig.CurrPageNo + ")' data-noteTxt='" + sPage + "_" + notesCreated + "' data-noteid='" + noteCount + "'>SAVE</button>");
      //for pointer event none
      //console.log("updated")
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).css({ "pointer-events": "none" });
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePanel").css('visibility', 'hidden');
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find("#noteSavedInfoID" + AudConfig.CurrPageNo).remove();
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).append("<img src='icons/p2.png' draggable='false' class='noteSavedInfo" + AudConfig.CurrPageNo + "' id='noteSavedInfoID" + AudConfig.CurrPageNo + "' onclick='parent.openSavedNoteConent(" + AudConfig.CurrPageNo + ")'/>");
      if (sX < 30 && sY < 429) {
        $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".noteSavedInfo" + AudConfig.CurrPageNo).css('top', (sY)).css('left', (sX + 10)).css('position', 'absolute').css('pointer-events', 'auto').css('cursor', 'pointer');
      } else if (sX < 30 && sY > 429) {
        $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".noteSavedInfo" + AudConfig.CurrPageNo).css('top', (sY - 161)).css('left', (sX + 10)).css('position', 'absolute').css('pointer-events', 'auto').css('cursor', 'pointer');
      } else if (sY > 429) {
        $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".noteSavedInfo" + AudConfig.CurrPageNo).css('top', (sY - 75)).css('left', (sX - 32)).css('position', 'absolute').css('pointer-events', 'auto').css('cursor', 'pointer');
      } else {
        $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".noteSavedInfo" + AudConfig.CurrPageNo).css('top', (sY)).css('left', (sX - 32)).css('position', 'absolute').css('pointer-events', 'auto').css('cursor', 'pointer');
      }


    }

    // for right page
    if (ArrNoteBookmark[(AudConfig.CurrPageNo + 1)]["P"] == null) {

    } else {
      $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).remove();

      var BookmarkTagR = "<div id= NoteBookmark" + (AudConfig.CurrPageNo + 1) + " class='NoteClsBookmark' style='z-index:2; position: absolute; width: 100%; height: 100%; background: transparent; z-index: 10; top: 0px; left: 0px; cursor: crosshair;' onclick='parent.createNote(event)'></div>";
      $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#p" + (AudConfig.CurrPageNo + 1)).append(BookmarkTagR);

      // add note
      var notesCreated = 0;
      var noteCount = 0;
      notesCreated++;
      noteCount++;
      parent.enableNotpadToggole = noteCount;
      var notecolor = 'noteColor' + (Math.floor(Math.random() * 3) + 1);
      //mouse click positions.
      sX = ArrNoteBookmark[(AudConfig.CurrPageNo + 1)]["sX"];
      sY = ArrNoteBookmark[(AudConfig.CurrPageNo + 1)]["sY"];
      var sPath = window.location.pathname;
      sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
      sPage = sPage.replace('.html', '');
      //for notePage
      $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).append("<div style= 'width: 280px; height: 250px; padding: 10px; position: absolute; background: #10FFFF; text-align: center; z-index: 10; font-family: oupi_font_normal; ' class='notePage" + noteCount + "' data-noteID='" + sPage + "_" + notesCreated + "'><button style='float: right; font-size: 32px; pointer-events: auto; cursor: pointer; background: #E01C12; width: 40px; border-radius: 40px; height: 40px; line-height: 30px; color: #fff; margin-bottom: 5px; border: none;' tabindex = '9' class='closeID' data-noteid='" + sPage + "_" + notesCreated + "' onclick='parent.closeID(event, " + (AudConfig.CurrPageNo + 1) + ")'>×</button><span style='float: left; font-size: 26px; font-weight: bold;' id='noteHeading' >Note</span>" + "  </div>");

      if (notecolor == "noteColor1") {
        $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).find(".notePage" + noteCount).css("background", "#fff740");
      }
      if (notecolor == "noteColor2") {
        $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).find(".notePage" + noteCount).css("background", "#ff7eb9");
      }
      if (notecolor == "noteColor3") {
        $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).find(".notePage" + noteCount).css("background", "#7afcff");
      }

      if (sX < 30) {
        if (sY > 429) {
          $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY - 160)).css('left', (sX + 41)).addClass("notePanel").addClass(notecolor);
        } else {
          $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY)).css('left', (sX + 41)).addClass("notePanel").addClass(notecolor);
        }
      } else if (sX > 259) {
        if (sY > 429) {
          $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY - 160)).css('left', (sX - 232)).addClass("notePanel").addClass(notecolor);
        } else {
          $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY)).css('left', (sX - 232)).addClass("notePanel").addClass(notecolor);
        }
      } else {
        if (sY > 429) {
          $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY - 160)).css('left', (sX)).addClass("notePanel").addClass(notecolor);
        } else {
          $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY)).css('left', (sX)).addClass("notePanel").addClass(notecolor);
        }
      }
      //to type the text inside the notePage
      $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).find(".notePage" + noteCount).append("<textarea tabindex = '1' style='width: 260px; height: 150px; background: transparent; border: 0.05em dashed; font-weight: bold; outline: none; pointer-events: auto; font-size: 26px; z-index: 3; resize: none; padding: 5px;' oncick='parent.noteInputFn(this)' class='noteInput' placeholder='Enter note description here (max 50 chrs)' maxlength='50'></textarea>");
      $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).find(".notePage" + noteCount).find("textarea").append('<style>.noteInput::placeholder{color:black}</style>');
      $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).find(".notepadArea").css('display', 'block').css('pointer-events', 'none').css('cursor', 'default').unbind('click').removeAttr('onclick', 'showNotePad()');
      $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).find(".notePage" + noteCount).find(".noteInput").val(ArrNoteBookmark[(AudConfig.CurrPageNo + 1)]["D"]);
      $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).find(".notePage" + noteCount).find(".noteInput").click(function (event) {
        event.stopPropagation();
      });
      //for adding save button
      $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).find(".notePage" + noteCount).append("<button tabindex = '2' style='border: none; float: right; margin-top: 8px; padding-top: 6px; background: #0CC; width: 65px; height: 32px; font-weight: bold; font-size: 19px; pointer-events: auto; cursor: pointer; font-family: 'oupi_font_normal';' class='saveNoteContent' onclick='parent.saveNoteContent(event, " + (AudConfig.CurrPageNo + 1) + ")' data-noteTxt='" + sPage + "_" + notesCreated + "' data-noteid='" + noteCount + "'>SAVE</button>");
      //for pointer event none
      $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).css({ "pointer-events": "none" });
      $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).find(".notePanel").css('visibility', 'hidden');
      $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).find("#noteSavedInfoID" + (AudConfig.CurrPageNo + 1)).remove();
      $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).append("<img src='icons/p2.png' draggable='false' class='noteSavedInfo" + (AudConfig.CurrPageNo + 1) + "' id='noteSavedInfoID" + (AudConfig.CurrPageNo + 1) + "' onclick='parent.openSavedNoteConent(" + (AudConfig.CurrPageNo + 1) + ")'/>");
      if (sX < 30 && sY < 429) {
        $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).find(".noteSavedInfo" + (AudConfig.CurrPageNo + 1)).css('top', (sY)).css('left', (sX + 10)).css('position', 'absolute').css('pointer-events', 'auto').css('cursor', 'pointer');
      } else if (sX < 30 && sY > 429) {
        $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).find(".noteSavedInfo" + (AudConfig.CurrPageNo + 1)).css('top', (sY - 161)).css('left', (sX + 10)).css('position', 'absolute').css('pointer-events', 'auto').css('cursor', 'pointer');
      } else if (sY > 429) {
        $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).find(".noteSavedInfo" + (AudConfig.CurrPageNo + 1)).css('top', (sY - 75)).css('left', (sX - 32)).css('position', 'absolute').css('pointer-events', 'auto').css('cursor', 'pointer');
      } else {
        $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).find(".noteSavedInfo" + (AudConfig.CurrPageNo + 1)).css('top', (sY)).css('left', (sX - 32)).css('position', 'absolute').css('pointer-events', 'auto').css('cursor', 'pointer');
      }

    }

  } else {
    //  for single page
    if (ArrNoteBookmark[AudConfig.CurrPageNo]["P"] == null) {

    } else {
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).remove();

      var BookmarkTagL = "<div id= NoteBookmark" + AudConfig.CurrPageNo + " class='NoteClsBookmark' style='z-index:2; position: absolute; width: 100%; height: 100%; background: transparent; z-index: 10; top: 0px; left: 0px; cursor: crosshair;' onclick='parent.createNote(event)'></div>";
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#p" + AudConfig.CurrPageNo).append(BookmarkTagL);

      // add note
      var notesCreated = 0;
      var noteCount = 0;
      notesCreated++;
      noteCount++;
      parent.enableNotpadToggole = noteCount;
      var notecolor = 'noteColor' + (Math.floor(Math.random() * 3) + 1);
      //mouse click positions.
      sX = ArrNoteBookmark[AudConfig.CurrPageNo]["sX"];
      sY = ArrNoteBookmark[AudConfig.CurrPageNo]["sY"];
      var sPath = window.location.pathname;
      sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
      sPage = sPage.replace('.html', '');
      //for notePage
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).append("<div style= 'width: 280px; height: 250px; padding: 10px; position: absolute; background: #10FFFF; text-align: center; z-index: 10; font-family: oupi_font_normal; ' class='notePage" + noteCount + "' data-noteID='" + sPage + "_" + notesCreated + "'><button style='float: right; font-size: 32px; pointer-events: auto; cursor: pointer; background: #E01C12; width: 40px; border-radius: 40px; height: 40px; line-height: 30px; color: #fff; margin-bottom: 5px; border: none;' tabindex = '9' class='closeID' data-noteid='" + sPage + "_" + notesCreated + "' onclick='parent.closeID(event, " + AudConfig.CurrPageNo + ")'>×</button><span style='float: left; font-size: 26px; font-weight: bold;' id='noteHeading' >Note</span>" + "  </div>");

      if (notecolor == "noteColor1") {
        $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).css("background", "#fff740");
      }
      if (notecolor == "noteColor2") {
        $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).css("background", "#ff7eb9");
      }
      if (notecolor == "noteColor3") {
        $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).css("background", "#7afcff");
      }

      if (sX < 30) {
        if (sY > 429) {
          $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY - 160)).css('left', (sX + 41)).addClass("notePanel").addClass(notecolor);
        } else {
          $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY)).css('left', (sX + 41)).addClass("notePanel").addClass(notecolor);
        }
      } else if (sX > 259) {
        if (sY > 429) {
          $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY - 160)).css('left', (sX - 232)).addClass("notePanel").addClass(notecolor);
        } else {
          $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY)).css('left', (sX - 232)).addClass("notePanel").addClass(notecolor);
        }
      } else {
        if (sY > 429) {
          $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY - 160)).css('left', (sX)).addClass("notePanel").addClass(notecolor);
        } else {
          $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY)).css('left', (sX)).addClass("notePanel").addClass(notecolor);
        }
      }
      //to type the text inside the notePage
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).append("<textarea tabindex = '1' style='width: 260px; height: 150px; background: transparent; border: 0.05em dashed; font-weight: bold; outline: none; pointer-events: auto; font-size: 26px; z-index: 3; resize: none; padding: 5px;' oncick='parent.noteInputFn(this)' class='noteInput' placeholder='Enter note description here (max 50 chrs)' maxlength='50'></textarea>");
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).find("textarea").append('<style>.noteInput::placeholder{color:black}</style>');
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notepadArea").css('display', 'block').css('pointer-events', 'none').css('cursor', 'default').unbind('click').removeAttr('onclick', 'showNotePad()');
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).find(".noteInput").val(ArrNoteBookmark[AudConfig.CurrPageNo]["D"]);

      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).find(".noteInput").click(function (event) {
        event.stopPropagation();
      });

      //for adding save button
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePage" + noteCount).append("<button tabindex = '2' style='border: none; float: right; margin-top: 8px; padding-top: 6px; background: #0CC; width: 65px; height: 32px; font-weight: bold; font-size: 19px; pointer-events: auto; cursor: pointer; font-family: 'oupi_font_normal';' class='saveNoteContent' onclick='parent.saveNoteContent(event, " + AudConfig.CurrPageNo + ")' data-noteTxt='" + sPage + "_" + notesCreated + "' data-noteid='" + noteCount + "'>SAVE</button>");
      //for pointer event none
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).css({ "pointer-events": "none" });
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".notePanel").css('visibility', 'hidden');
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find("#noteSavedInfoID" + AudConfig.CurrPageNo).remove();
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).append("<img src='icons/p2.png' draggable='false' class='noteSavedInfo" + AudConfig.CurrPageNo + "' id='noteSavedInfoID" + AudConfig.CurrPageNo + "' onclick='parent.openSavedNoteConent(" + AudConfig.CurrPageNo + ")'/>");
      if (sX < 30 && sY < 429) {
        $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".noteSavedInfo" + AudConfig.CurrPageNo).css('top', (sY)).css('left', (sX + 10)).css('position', 'absolute').css('pointer-events', 'auto').css('cursor', 'pointer');
      } else if (sX < 30 && sY > 429) {
        $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".noteSavedInfo" + AudConfig.CurrPageNo).css('top', (sY - 161)).css('left', (sX + 10)).css('position', 'absolute').css('pointer-events', 'auto').css('cursor', 'pointer');
      } else if (sY > 429) {
        $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".noteSavedInfo" + AudConfig.CurrPageNo).css('top', (sY - 75)).css('left', (sX - 32)).css('position', 'absolute').css('pointer-events', 'auto').css('cursor', 'pointer');
      } else {
        $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).find(".noteSavedInfo" + AudConfig.CurrPageNo).css('top', (sY)).css('left', (sX - 32)).css('position', 'absolute').css('pointer-events', 'auto').css('cursor', 'pointer');
      }


    }
  }

}

function AddBlockNote() {
  //console.log("AddBlockNote");
  activeAddNote();
  if (AudConfig.BookLayout == "magazine") {
    // for left page
    if ($("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#p" + AudConfig.CurrPageNo).find("#NoteBookmark" + AudConfig.CurrPageNo).length) {
      //console.log("exist--NoteBookmark" + AudConfig.CurrPageNo);
      
    } else {
      var BookmarkTagL = "<div id= NoteBookmark" + AudConfig.CurrPageNo + " class='NoteClsBookmark' style='z-index:2; position: absolute; width: 100%; height: 100%; background: transparent; z-index: 10; top: 0px; left: 0px; cursor: crosshair;' onclick='parent.createNote(event, true)'></div>";
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#p" + AudConfig.CurrPageNo).append(BookmarkTagL);

    }
    // for right page
    if ($("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#p" + (AudConfig.CurrPageNo + 1)).find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).length) {
      //console.log("exist--NoteBookmark" + (AudConfig.CurrPageNo + 1));
      
    } else {
      var BookmarkTagR = "<div id= NoteBookmark" + (AudConfig.CurrPageNo + 1) + " class='NoteClsBookmark' style='z-index:2; position: absolute; width: 100%; height: 100%; background: transparent; z-index: 10; top: 0px; left: 0px; cursor: crosshair;' onclick='parent.createNote(event, true)'></div>";
      $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#p" + (AudConfig.CurrPageNo + 1)).append(BookmarkTagR);
    }

  }
  else {
    // for single page
    if ($("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#p" + AudConfig.CurrPageNo).find("#NoteBookmark" + AudConfig.CurrPageNo).length) {
      //console.log("exist--NoteBookmark" + AudConfig.CurrPageNo);
     
    } else {
      var BookmarkTagL = "<div id= NoteBookmark" + AudConfig.CurrPageNo + " class='NoteClsBookmark' style='z-index:2; position: absolute; width: 100%; height: 100%; background: transparent; z-index: 10; top: 0px; left: 0px; cursor: crosshair;' onclick='parent.createNote(event, true)'></div>";
      $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#p" + AudConfig.CurrPageNo).append(BookmarkTagL);

    }
  }

  closeIconPopup();
}



function createNote(e, val) {

  //console.log("createNote" + val);

  var NewIndex = Number((e.target.parentNode.id).substring(1));

  //console.log(ArrNoteBookmark[NewIndex]);
  try {
    if (ArrNoteBookmark[NewIndex].S == false) {

      // ArrNoteBookmark[NewIndex].S = true;

      var notesCreated = 0;
      var noteCount = 0;
      notesCreated++;
      noteCount++;
      parent.enableNotpadToggole = noteCount;

      var notecolor = 'noteColor' + (Math.floor(Math.random() * 3) + 1);
      //mouse click positions.
      sX = e.pageX;
      sY = e.pageY;

      var sPath = window.location.pathname;
      sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
      sPage = sPage.replace('.html', '');

      //for notePage
     
     $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).empty().html("");

      $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).append("<div style= 'width: 280px; height: 250px; padding: 10px; position: absolute; background: #10FFFF; text-align: center; z-index: 10; font-family: oupi_font_normal; ' class='notePage" + noteCount + "' data-noteID='" + sPage + "_" + notesCreated + "'><button style='float: right; font-size: 32px; pointer-events: auto; cursor: pointer; background: #E01C12; width: 40px; border-radius: 40px; height: 40px; line-height: 30px; color: #fff; margin-bottom: 5px; border: none;' tabindex = '9' class='closeID' data-noteid='" + sPage + "_" + notesCreated + "' onclick='parent.closeID(event, " + NewIndex + ")'>×</button><span style='float: left; font-size: 26px; font-weight: bold;' id='noteHeading' >Note</span>" + "  </div>");

      if (notecolor == "noteColor1") {
        $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".notePage" + noteCount).css("background", "#fff740");
      }
      if (notecolor == "noteColor2") {
        $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".notePage" + noteCount).css("background", "#ff7eb9");
      }
      if (notecolor == "noteColor3") {
        $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".notePage" + noteCount).css("background", "#7afcff");
      }

      if (sX < 30) {
        if (sY > 429) {
          $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY - 160)).css('left', (sX + 41)).addClass("notePanel").addClass(notecolor);
        } else {
          $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY)).css('left', (sX + 41)).addClass("notePanel").addClass(notecolor);
        }
      } else if (sX > 259) {
        if (sY > 429) {
          $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY - 160)).css('left', (sX - 232)).addClass("notePanel").addClass(notecolor);
        } else {
          $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY)).css('left', (sX - 232)).addClass("notePanel").addClass(notecolor);
        }
      } else {
        if (sY > 429) {
          $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY - 160)).css('left', (sX)).addClass("notePanel").addClass(notecolor);
        } else {
          $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".notePage" + noteCount).css('visibility', 'visible').css('top', (sY)).css('left', (sX)).addClass("notePanel").addClass(notecolor);
        }
      }


      //to type the text inside the notePage
      $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".notePage" + noteCount).append("<textarea tabindex = '1' style='width: 260px; height: 150px; background: transparent; border: 0.05em dashed; font-weight: bold; outline: none; pointer-events: auto; font-size: 26px; z-index: 3; resize: none; padding: 5px;' oncick='parent.noteInputFn(this)' class='noteInput' placeholder='Enter note description here (max 50 chrs)' maxlength='50'></textarea>");
     
      $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".notePage" + noteCount).find("textarea").append('<style>.noteInput::placeholder{color:black}</style>');

      $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".notepadArea").css('display', 'block').css('pointer-events', 'none').css('cursor', 'default').unbind('click').removeAttr('onclick', 'showNotePad()');
      $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".notePage" + noteCount).find(".noteInput").click(function (event) {
        event.stopPropagation();
      });
      //for adding save button
      $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".notePage" + noteCount).append("<button tabindex = '2' style='border: none; float: right; margin-top: 8px; padding-top: 6px; background: #0CC; width: 65px; height: 32px; font-weight: bold; font-size: 19px; pointer-events: auto; cursor: pointer; font-family: 'oupi_font_normal';' class='saveNoteContent' onclick='parent.saveNoteContent(event, " + NewIndex + ")' data-noteTxt='" + sPage + "_" + notesCreated + "' data-noteid='" + noteCount + "'>SAVE</button>");

      //for pointer event none
      // $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).css({ "pointer-events": "none", "cursor": "defalut" });
      // $("#page" + (NewIndex+1) + " > iframe").contents().find("#NoteBookmark" + (NewIndex+1)).css({ "pointer-events": "none", "cursor": "defalut" });
      // $("#page" + (NewIndex-1) + " > iframe").contents().find("#NoteBookmark" + (NewIndex-1)).css({ "pointer-events": "none", "cursor": "defalut" });

      deActiveAddNote();

    }
    else {
      ShowNotePopup();
      deActiveAddNote();
    }
  } catch (error) {

  }

}

function deActiveAddNote() {
  $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).css({ "pointer-events": "none", "cursor": "defalut" });
  $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).css({ "pointer-events": "none", "cursor": "defalut" });
  $("#page" + (AudConfig.CurrPageNo - 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo - 1)).css({ "pointer-events": "none", "cursor": "defalut" });

}
function activeAddNote() {
  $("#page" + AudConfig.CurrPageNo + " > iframe").contents().find("#NoteBookmark" + AudConfig.CurrPageNo).css({ "pointer-events": "auto", "cursor": "crosshair" });
  $("#page" + (AudConfig.CurrPageNo + 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo + 1)).css({ "pointer-events": "auto", "cursor": "crosshair" });
  $("#page" + (AudConfig.CurrPageNo - 1) + " > iframe").contents().find("#NoteBookmark" + (AudConfig.CurrPageNo - 1)).css({ "pointer-events": "auto", "cursor": "crosshair" });

}
function noteInputFn(event) {
  event.stopPropagation();
}

function closeID(event, NewIndex) {
  event.stopPropagation();
  //console.log("closeID");
  $('.highlightpopup,.gamePopup').css('display', 'block');
  $('.note').html('note');

  $('.yes').unbind();
  $('.yes').click(function () {
    $('.highlightpopup,.gamePopup').css('display', 'none');
    $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).remove();
    ArrNoteBookmark[NewIndex].P = null;
    ArrNoteBookmark[NewIndex].S = false;
    ArrNoteBookmark[NewIndex].D = null;
    ArrNoteBookmark[NewIndex].sX = null;
    ArrNoteBookmark[NewIndex].sY = null;

  })

  $('.no').unbind();
  $('.no').click(function () {
    $('.highlightpopup,.gamePopup').css('display', 'none');
  });

  SendSusData(); //send data to SCORM
}

function saveNoteContent(event, NewIndex) {
  event.stopPropagation();
  //console.log("saveNoteContent");

  closeCount = 0;
  $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".notePanel").css('visibility', 'hidden');

  if ($("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find("#noteSavedInfoID" + NewIndex).length) {
    var noteData = $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".notePanel").find(".noteInput").val();
    ArrNoteBookmark[NewIndex].D = noteData;
  } else {
    $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find("#noteSavedInfoID" + NewIndex).remove();
    $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).append("<img src='icons/p2.png' draggable='false' class='noteSavedInfo" + NewIndex + "' id='noteSavedInfoID" + NewIndex + "' onclick='parent.openSavedNoteConent(" + NewIndex + ")'/>");

    if (sX < 30 && sY < 429) {
      $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".noteSavedInfo" + NewIndex).css('top', (sY)).css('left', (sX + 10)).css('position', 'absolute').css('pointer-events', 'auto').css('cursor', 'pointer');
    } else if (sX < 30 && sY > 429) {
      $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".noteSavedInfo" + NewIndex).css('top', (sY - 161)).css('left', (sX + 10)).css('position', 'absolute').css('pointer-events', 'auto').css('cursor', 'pointer');
    } else if (sY > 429) {
      $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".noteSavedInfo" + NewIndex).css('top', (sY - 75)).css('left', (sX - 32)).css('position', 'absolute').css('pointer-events', 'auto').css('cursor', 'pointer');
    } else {
      $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".noteSavedInfo" + NewIndex).css('top', (sY)).css('left', (sX - 32)).css('position', 'absolute').css('pointer-events', 'auto').css('cursor', 'pointer');
    }

    var noteData = $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".notePanel").find(".noteInput").val();

    ArrNoteBookmark[NewIndex].P = NewIndex;
    ArrNoteBookmark[NewIndex].S = true;
    ArrNoteBookmark[NewIndex].D = noteData;
    ArrNoteBookmark[NewIndex].sX = sX;
    ArrNoteBookmark[NewIndex].sY = sY;
  }

  //console.log(ArrNoteBookmark);

  SendSusData(); //send data to SCORM

}

function openSavedNoteConent(NewIndex) {
  //console.log("openSavedNoteConent");
  if (closeCount == 0) {
    closeCount = 1;
    $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".notePanel").css('visibility', 'visible');
  } else {
    closeCount = 0;
    $("#page" + NewIndex + " > iframe").contents().find("#NoteBookmark" + NewIndex).find(".notePanel").css('visibility', 'hidden');

  }
}


function LoadPopupNoteIcon() {
  $("#IconPopupDataCont").html("");
  var NoteCounter = 0;
  for (var i = 0; i < ArrNoteBookmark.length; i++) {
    if (ArrNoteBookmark[i].S) {
      var TempNode = '<div class="ClsNoteElement" value=' + i + '>' + (AudConfig.BookStartPrintPageNo + ArrNoteBookmark[i].P) + '</div>';
      var LastData = $("#IconPopupDataCont").html();
      $("#IconPopupDataCont").html(LastData + TempNode);
      NoteCounter++;
    }
  }

  $(".ClsNoteElement").on("click", function (e) {
    var PageID = Number($(e.currentTarget).attr("value"));
    if (AudConfig.BookLayout == "magazine") {
      gotoSelectedPage(PageID);
    }
    else {
      gotoSelectedPage(PageID + 1);
    }
    closeIconPopup();
  });

  if (NoteCounter > 0) {
    $("#MsgNote").removeClass("hide").addClass("show");
  }
}


function ShowNotePopup() {
  $("#NotePopupCont").removeClass("hide").addClass("show");
  $("#NotePopupCont").animate({
    opacity: 1
  },
    {
      duration: 500,
      complete: function () {
        setTimeout(function () {
          $("#NotePopupCont").animate({
            opacity: 0
          },
            {
              duration: 500,
              complete: function () {
                $("#NotePopupCont").removeClass("show").addClass("hide");
              }
            });
        }, 2000);
      }
    });
}


function UnbindNoteEventFromPage(){
  var LeftPageNo = AudConfig.CurrPageNo;
  var RightPageNo = AudConfig.CurrPageNo + 1;

  if(AudConfig.BookLayout == "magazine"){ 
    if (ArrNoteBookmark[RightPageNo].S == false){
      $("#page" + RightPageNo + " > iframe").contents().find("#p" + RightPageNo).find("#NoteBookmark" + RightPageNo).remove();
    }
    else{
      $("#page" + RightPageNo + " > iframe").contents().find("#p" + RightPageNo).find("#NoteBookmark" + RightPageNo).css("pointer-events", "none");      
    }
  }  

  if (ArrNoteBookmark[LeftPageNo].S == false){
    $("#page" + LeftPageNo + " > iframe").contents().find("#p" + LeftPageNo).find("#NoteBookmark" + LeftPageNo).remove();
  }  
  else{
    $("#page" + LeftPageNo + " > iframe").contents().find("#p" + LeftPageNo).find("#NoteBookmark" + LeftPageNo).css("pointer-events", "none");      
  }
}


function SendNoteDataToLMS(){
  ArrNoteBookmarkLMS = [];
  var LenArrNoteBookmark =  ArrNoteBookmark.length;
  //var NewObj = { "P": null, "S": false, "D": null, "sX": null, "sY": null };
  for(var i=0; i<LenArrNoteBookmark; i++){
    if(ArrNoteBookmark[i].S){
      var NewObj = {"D": null, "X": null, "Y": null };      
      NewObj.D = ArrNoteBookmark[i].D;
      NewObj.X = ArrNoteBookmark[i].sX;
      NewObj.Y = ArrNoteBookmark[i].sY;
      ArrNoteBookmarkLMS.push(NewObj);
    }  
    else{
      ArrNoteBookmarkLMS.push(0);
    }  
  }
} 

function CreateInitArrNote(CIndex){
  var ArrInitLMSNote = [];
  for(var i=0; i<ArrChapPageNo[CIndex]; i++){
    ArrInitLMSNote.push(0);
  }
  return ArrInitLMSNote;
}

function RecvNoteDataFromLMS(ArrNoteBookmarkLMS){
  var LenArrNoteBookmarkLMS =  ArrNoteBookmarkLMS.length;
  ArrNoteBookmark = [];
  for(var i=0; i<LenArrNoteBookmarkLMS; i++){
    var NewObj = { "P": null, "S": false, "D": null, "sX": null, "sY": null };
    if(ArrNoteBookmarkLMS[i] != 0){
      NewObj.P = i;
      NewObj.S = true;   
      NewObj.D = ArrNoteBookmarkLMS[i].D;
      NewObj.sX = ArrNoteBookmarkLMS[i].X;
      NewObj.sY = ArrNoteBookmarkLMS[i].Y;
    }       
    ArrNoteBookmark.push(NewObj);
  }
}

