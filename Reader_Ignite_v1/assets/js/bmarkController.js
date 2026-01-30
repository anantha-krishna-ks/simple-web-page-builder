var ArrBookmark = [];
var ArrBookmarkLMS = [];

function InitBookmark(){
  ArrBookmark = [];
  for(var i=0; i<config.pagecount; i++){
    var NewObj = {"P":null, "B":false, "S":false};
    ArrBookmark.push(NewObj);
  }
}

InitBookmark();

//console.log(ArrBookmark);

function AddBookmark(){
  var LeftPageNo = AudConfig.CurrPageNo;
  var RightPageNo = AudConfig.CurrPageNo + 1;
  var BMarkStyleOff = "class='ClsBookmark' style='z-index:2; width:67px; height:30px; position:absolute; top:"+AudConfig.BookMark.Top+"px; right:"+AudConfig.BookMark.Right+"px; cursor:pointer; background-image:url(icons/bookmark_open.png);' onclick='parent.ToggleBookmark(event)'></div>";  

  if(AudConfig.BookLayout == "magazine"){ 
    if(ArrBookmark[RightPageNo].P == null && !ArrBookmark[RightPageNo].B){
      var BookmarkTagR = "<div id= Bookmark"+RightPageNo+" " + BMarkStyleOff;        
      $("#page"+(RightPageNo) + " > iframe").contents().find("#p"+(RightPageNo)).append(BookmarkTagR);
      ArrBookmark[RightPageNo].P = RightPageNo;
      ArrBookmark[RightPageNo].B = true;
      ArrBookmark[RightPageNo].S = false;
    }
  }  

  if(ArrBookmark[LeftPageNo].P == null && !ArrBookmark[LeftPageNo].B){
    var BookmarkTagL = "<div id= Bookmark"+LeftPageNo+" " + BMarkStyleOff;        
    $("#page"+(LeftPageNo) + " > iframe").contents().find("#p"+(LeftPageNo)).append(BookmarkTagL);
    ArrBookmark[LeftPageNo].P = LeftPageNo;
    ArrBookmark[LeftPageNo].B = true;
    ArrBookmark[LeftPageNo].S = false;
  }
  closeIconPopup();  
}


function ToggleBookmark(e){
  //console.log(e.target.id);
  var NewIndex = Number((e.target.parentNode.id).substring(1));  
  if(ArrBookmark[NewIndex].S == false){
    $("#page"+NewIndex + " > iframe").contents().find("#Bookmark"+NewIndex).css("background-image", "url(icons/bookmark_closed.png)");    
    ArrBookmark[NewIndex].S = true;
  }
  else{
    $("#page"+NewIndex + " > iframe").contents().find("#Bookmark"+NewIndex).css("background-image", "url(icons/bookmark_open.png)");    
    ArrBookmark[NewIndex].S = false;
  }

  $("#BookmarkPopupCont").removeClass("hide").addClass("show");
    $("#BookmarkPopupCont").animate({
      opacity: 1
    },
    {
      duration: 500,         
      complete: function() {
        setTimeout(function(){          
          $( "#BookmarkPopupCont" ).animate({
            opacity: 0
          }, 
          {
            duration: 500,              
            complete: function() {
              $("#BookmarkPopupCont").removeClass("show").addClass("hide");                              
            }
          });
        },500); 
      }
  });

  SendSusData(); //send data to SCORM
}


function LoadPageBookMark(){
  var LeftPageNo = AudConfig.CurrPageNo;
  var RightPageNo = AudConfig.CurrPageNo + 1;  
  var BMarkStyleOn = "class='ClsBookmark' style='z-index:2; width:67px; height:30px; position:absolute; top:"+AudConfig.BookMark.Top+"px; right:"+AudConfig.BookMark.Right+"px; cursor:pointer; background-image:url(icons/bookmark_closed.png);' onclick='parent.ToggleBookmark(event)'></div>";  

  for(var i=0; i<ArrBookmark.length; i++){
    if(!ArrBookmark[i].S){
      ArrBookmark[i].P = null;
      ArrBookmark[i].B = false;
      ArrBookmark[i].S = false;
    }    
  }

  //console.log(ArrBookmark);

  if(AudConfig.BookLayout == "magazine"){ 
    if(ArrBookmark[RightPageNo].S){    
      if($("#page"+(RightPageNo) + " > iframe").contents().find("#Bookmark"+RightPageNo)[0] == undefined){
        var BookmarkTagR = "<div id= Bookmark"+RightPageNo+" " + BMarkStyleOn;        
        $("#page"+(RightPageNo) + " > iframe").contents().find("#p"+(RightPageNo)).append(BookmarkTagR);      
        ArrBookmark[RightPageNo].S = true;
        ArrBookmark[RightPageNo].P = RightPageNo;
        ArrBookmark[RightPageNo].B = true; 
      }             
    }    
  }  

  if(ArrBookmark[LeftPageNo].S){   
    if($("#page"+(LeftPageNo) + " > iframe").contents().find("#Bookmark"+LeftPageNo)[0] == undefined){   
      var BookmarkTagL = "<div id= Bookmark"+LeftPageNo+" " + BMarkStyleOn;        
      $("#page"+(LeftPageNo) + " > iframe").contents().find("#p"+(LeftPageNo)).append(BookmarkTagL);      
      ArrBookmark[LeftPageNo].S = true;
      ArrBookmark[LeftPageNo].P = LeftPageNo;
      ArrBookmark[LeftPageNo].B = true;      
    }
  } 

  RemoveEmptyBookmarkTag();
}

function RemoveEmptyBookmarkTag(){
  for(var i=0; i<ArrBookmark.length; i++){
    if(ArrBookmark[i].S == false){
      if($("#page"+(i) + " > iframe").contents().find("#Bookmark"+i)[0] != undefined){
        $("#page"+(i) + " > iframe").contents().find("#Bookmark"+i).remove();
      }
    }
  }
}

function LoadPopupBookmarkIcon(){
  $("#IconPopupDataCont").html("");
  var BookmarkCounter = 0;  
  for(var i=0; i<ArrBookmark.length; i++){
    if(ArrBookmark[i].S){
      var TempNode = '<div class="ClsBmarkElement" value=' + i +'>'+ ( AudConfig.BookStartPrintPageNo + ArrBookmark[i].P) +'</div>';                           
      var LastData = $("#IconPopupDataCont").html();      
      $("#IconPopupDataCont").html(LastData + TempNode); 
      BookmarkCounter++;
    }    
  } 

  $(".ClsBmarkElement").on("click", function(e){
      var PageID = Number($(e.currentTarget).attr("value"));      
      if(AudConfig.BookLayout == "magazine"){
            gotoSelectedPage(PageID);
      }
      else{
            gotoSelectedPage(PageID + 1);
      }      
      closeIconPopup();
  });

  if(BookmarkCounter>0){
    $("#MsgBookmark").removeClass("hide").addClass("show");
  }
}

function SendBMarkDataToLMS(){
  ArrBookmarkLMS = [];
  var LenArrBookmark =  ArrBookmark.length;
  for(var i=0; i<LenArrBookmark; i++){
    if(ArrBookmark[i].S){
      ArrBookmarkLMS.push(1);
    }  
    else{
      ArrBookmarkLMS.push(0);
    }  
  }
}

function CreateInitArrBMark(CIndex){
  var ArrInitLMSBMark = [];
  for(var i=0; i<ArrChapPageNo[CIndex]; i++){
    ArrInitLMSBMark.push(0);
  }
  return ArrInitLMSBMark;
}

function RecvBMarkDataFromLMS(ArrBookmarkLMS){
  var LenArrBookmarkLMS =  ArrBookmarkLMS.length;
  ArrBookmark = [];
  for(var i=0; i<LenArrBookmarkLMS; i++){
    var NewObj = {"P":null, "B":false, "S":false};
    if(ArrBookmarkLMS[i] == 1){
      NewObj.P = i;
      NewObj.B = true;
      NewObj.S = true;
    }
    ArrBookmark.push(NewObj);
  }
}

