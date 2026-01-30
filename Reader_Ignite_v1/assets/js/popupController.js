function openIconPopup(PopupName){      
  $("#IconPopupDataCont").html("");
  var IconPopupMainCont = document.getElementById("IconPopupMainCont"); 
  var IconPopupCont = document.getElementById("IconPopupCont"); 
  var IconPopupHeader = document.getElementById("IconPopupHeader"); 
  IconPopupCont.className = "";
  $(".ClsPopupMsg").removeClass("show").addClass("hide");
  switch(PopupName){
    case "Thumbnail":
          IconPopupCont.classList.add("ClsThumbnail");  
          updateThumbnails();    
          SelectTool("IcThumbnail");             
          break;

    case "Bookmark":
          IconPopupCont.classList.add("ClsBookmark");
          SelectTool("IcBookmark");  
          LoadPopupBookmarkIcon();
          break;

    case "Note":
          IconPopupCont.classList.add("ClsNote");
          SelectTool("IcNote");  
          LoadPopupNoteIcon(); 
          break;

    case "Highlight":
          IconPopupCont.classList.add("ClsHighlight");
          SelectTool("IcHighlight");  
          break;

    default:
         break;

  }

  IconPopupMainCont.className = "";
  IconPopupMainCont.classList.add("ClsOpen");
  IconPopupHeader.innerHTML = PopupName;
  UnbindNoteEventFromPage(); //remove note crosshair cursor
}

function closeIconPopup(){
  var IconPopupMainCont = document.getElementById("IconPopupMainCont"); 
  IconPopupMainCont.className = "";
  IconPopupMainCont.classList.add("ClsClose");
  EnableAllTool();
  DeselectAllTool();
}

/*-- Thumbnails : Starts --*/
function updateThumbnails(){
      $("#IconPopupDataCont").html("");   
      for(var i=1; i<ArrLinkThumbnail.length; i++){
            var TempNode = '<div class="ClsThumbLink" value=' + i + ' style = "background-image:url(' + 'assets/data/'+ ArrLinkThumbnail[i].ThumbLink + ');"></div>';                           
            var LastData = $("#IconPopupDataCont").html();
            //console.log(LastData);
            $("#IconPopupDataCont").html(LastData + TempNode); 
      }

      $(".ClsThumbLink").on("click", function(e){
            var PageID = Number($(e.currentTarget).attr("value"));
            //console.log(PageID);
            if(AudConfig.BookLayout == "magazine"){
                  gotoSelectedPage(PageID);
            }
            else{
                  gotoSelectedPage(PageID + 1);
            }
            
            closeIconPopup();
      });                            
}


/*-- Thumbnails : Ends --*/