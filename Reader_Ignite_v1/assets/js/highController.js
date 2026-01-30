//var ArrHighColor = ["#ffff00", "#FFBD33", "#00ff00", "#ff00ff", "#00ffff"];
var ArrHighColor = ["rgba(255, 255, 0, 0.5)", "rgba(255, 189, 51, 0.5)", "rgba(0, 255, 0, 0.5)", "rgba(255, 0, 255, 0.5)", "rgba(0, 255, 255, 0.5)"];

var ArrHighlt = [];
var ArrHighltLMS = [];
var CurrHighData = {Clr:null, Text:null};
//var CurrHighData = {"Clr":null, "Text":null};
var hltrL, hltrR;
var IFrameL, IFrameR;
var CurrHighPage = "L";

var ArrOrgHTML = [];
var IsSelect = false;
var viewedLimitMessageOnce = false;
var limitLength = 1950; // 2000 limit for client server

var SelectedHighID = null;
var SelectedPageNo = null;
var SelectedTimeStmp = null;

var ArrSelNodeToHigh = [];
var LastTimeStampUsed = 0;
function InitHighPanel(){
  ArrHighlt = [];
  for(var i=0; i<config.pagecount; i++){   
    var newArray = []; 
    ArrHighlt.push(newArray);
  }

  //console.log(ArrHighlt);
}

InitHighPanel();

function OpenHighPopup(){
  $("#dropMenu").removeClass("open");
  $("#HighPopupMainCont").removeClass("ClsClose").addClass("ClsOpen");
  SelectTool("IcHighlight");
  UnbindNoteEventFromPage(); //remove note crosshair cursor
}

function CloseHighPopup(){
  $("#HighPopupMainCont").removeClass("ClsOpen").addClass("ClsClose");
  EnableAllTool();
  DeselectAllTool();
}

function GetIndexOf(PageNo, NodeID){
  for(var i=0; i<ArrHighlt[PageNo].length; i++){
    if(ArrHighlt[PageNo][i].I == NodeID){
      return i;
    }
  }
}

function GetColourCodeIndex(ClrStr){  
  for(var i=0; i<ArrHighColor.length; i++){
    //console.log(ClrStr, ArrHighColor[i]);
    if(ClrStr == ArrHighColor[i]){
      return i;
    }
  }
}

function InitHighlight(){    
  var LeftPageNo = AudConfig.CurrPageNo;
  var RightPageNo = AudConfig.CurrPageNo + 1;
  //console.log(LeftPageNo, RightPageNo);
  IFrameL = $("#page"+(LeftPageNo) + " > iframe");
  IFrameR = $("#page"+(RightPageNo) + " > iframe");

  if(IFrameL[0].contentDocument === null) return; // if iframe is not loaded yet, return

  hltrL = new TextHighlighter(IFrameL[0].contentDocument.body, {      
    onBeforeHighlight: function (range) { 
      //console.log(range);      
    },
    onAfterHighlight: function (range, highlights) {       
      //console.log(range);
      GetAllHighTags(LeftPageNo);            
    },
    onRemoveHighlight: function (hl) {
        //return window.confirm('Do you really want to remove: "' + hl.innerText + '"');
    }
  });

  if(LastPagePos == "R" && AudConfig.BookLayout == "presentation" && AudConfig.CurrPageNo == config.pagecount-1){

  }
  // else if(AudConfig.CurrPageNo == 0){

  // }
  else{
    hltrR = new TextHighlighter(IFrameR[0].contentDocument.body, {         
      onBeforeHighlight: function (range) { 
        //console.log(range);      
      },
      onAfterHighlight: function (range, highlights) { 
        GetAllHighTags(RightPageNo);                  
      },
      onRemoveHighlight: function (hl) {
          return window.confirm('Do you really want to remove: "' + hl.innerText + '"');
      }
    });
  }
  //console.log(hltrL);
}

//u0027

function GetAllHighTagsAfterDelete(PageNo){   
  ArrHighlt[PageNo] = [];  
  if(PageNo == 0){
    return;
  }
  
  //$("#page"+(PageNo) + " > iframe").contents().find("#p"+ PageNo +" div[data-ishigh='true']").each(function(index){ 
  $("#page"+(PageNo) + " > iframe").contents().find("#p"+ PageNo +" [data-ishigh='true']").each(function(index){
    //console.log($(this).attr("id"));
    var TempObj = {"I":null, "T":null, "C":null, "D":""};
    TempObj.I = $(this).attr("id");
    //TempObj.InHTML = $(this).html();
    //console.log($(this));        
    if($(this).attr("onclick") == undefined){
      $(this).attr("onclick", "parent.DeleteThisHigh(event)");
    }

    $(this).css("user-select","none");
    $(this).css("-webkit-user-select","none");
    $(this).css("-moz-user-select","none");
    $(this).css("-ms-user-select","none");
    $(this).css("-o-user-select","none");
    var childLen = $(this)[0].childNodes.length;
    //console.log(childLen);

    if(TempObj.I != undefined && TempObj.I != null){
      TempObj.D = [];
      var Obj = [];
      var DataText = "";
  
      for(var i=0; i<childLen; i++){      
        //console.log($(this)[0].childNodes[i].nodeName);
        if($(this)[0].childNodes[i].nodeName == "SPAN"){        
          // Obj.push("S");
          // Obj.push($(this)[0].childNodes[i].innerHTML);       
          DataText = DataText + $(this)[0].childNodes[i].innerHTML;
        }
        else if($(this)[0].childNodes[i].nodeName == "#text"){
          // Obj.push("T");
          // Obj.push($(this)[0].childNodes[i].nodeValue);         
          DataText = DataText + $(this)[0].childNodes[i].nodeValue;
        }
        
        //console.log(Obj);
      }  
      
      Obj.push("S");
      Obj.push(DataText);
  
      TempObj.D.push(Obj);
  
      var $this = $(this);
      $this.find("span").each(function(){
  
        TempObj.T = $(this).attr("data-timestamp");
        TempObj.C = Number(GetColourCodeIndex($(this).css("background-color"))); 
        //TempObj.D = $(this).html();      
      });
      ArrHighlt[PageNo].push(TempObj);  
    }
     
  });  

  //console.log($("#page"+PageNo + " > iframe").contents().find("#"+ArrHighlt[2][0].I));
}

function GetAllHighTags(PageNo){ 

  if(PageNo == 0){return;}

  var TempArrHLT = [];
  for(var i=0; i<ArrHighlt.length; i++){
    if(i != PageNo){
      TempArrHLT.push(ArrHighlt[i]);
    }
  }
 
  var PageOldData = ArrHighlt[PageNo]; // save old data

  ArrHighlt[PageNo] = [];

  var TempArrHighltNode = [];
  
  //$("#page"+(PageNo) + " > iframe").contents().find("#p"+ PageNo +" div[data-ishigh='true']").each(function(index){ 
  $("#page"+(PageNo) + " > iframe").contents().find("#p"+ PageNo +" [data-ishigh='true']").each(function(index){
    //console.log($(this).attr("id"));
    var TempObj = {"I":null, "T":null, "C":null, "D":""};
    TempObj.I = $(this).attr("id");
    //TempObj.InHTML = $(this).html();
    //console.log($(this));        
    if($(this).attr("onclick") == undefined){
      $(this).attr("onclick", "parent.DeleteThisHigh(event)");
    }

    $(this).css("user-select","none");
    $(this).css("-webkit-user-select","none");
    $(this).css("-moz-user-select","none");
    $(this).css("-ms-user-select","none");
    $(this).css("-o-user-select","none");
    var childLen = $(this)[0].childNodes.length;
    //console.log(childLen);

    if(TempObj.I != undefined && TempObj.I != null){
      TempObj.D = [];
      var Obj = [];
      var DataText = "";
  
      for(var i=0; i<childLen; i++){
        
        //console.log($(this)[0].childNodes[i].nodeName);
        if($(this)[0].childNodes[i].nodeName == "SPAN"){        
          //Obj.push("S");
          //Obj.push($(this)[0].childNodes[i].innerHTML);
          DataText = DataText + $(this)[0].childNodes[i].innerHTML;       
        }
        else if($(this)[0].childNodes[i].nodeName == "#text"){
          //Obj.push("T");
          //Obj.push($(this)[0].childNodes[i].nodeValue);         
          DataText = DataText + $(this)[0].childNodes[i].nodeValue;
        }
        
        //console.log(Obj);
      }   
  
      Obj.push("S");
      Obj.push(DataText);
  
      TempObj.D.push(Obj);
  
      var $this = $(this);
      $this.find("span").each(function(){
  
        TempObj.T = $(this).attr("data-timestamp");
        TempObj.C = Number(GetColourCodeIndex($(this).css("background-color"))); 
        //TempObj.D = $(this).html();      
      });
      //console.log(ArrHighlt);
      //ArrHighlt[PageNo].push(TempObj);   
      TempArrHighltNode.push(TempObj); 
    }
    
  });

  ArrHighlt[PageNo] = TempArrHighltNode;
  CopyArrHLTToArrLMSHLT(); //send data to SCORM

  if(CheckDataLimit()){
    if(TempArrHighltNode.length > 0){
      ArrHighlt[PageNo] = TempArrHighltNode;
    }
    else{
      ArrHighlt[PageNo] =  PageOldData;
    }
  }
  else{
    ArrHighlt[PageNo] =  PageOldData;
    // Remove Highlight
    ArrSelNodeToHigh = [];
    for(var i=0; i<TempArrHighltNode.length; i++){
      //console.log(TempArrHighltNode[i].T, LastTimeStampUsed)
      if(TempArrHighltNode[i].T == LastTimeStampUsed){
        ArrSelNodeToHigh.push(TempArrHighltNode[i]);
      }
    }

    //console.log(ArrSelNodeToHigh);  

    $("#page"+(PageNo) + " > iframe").contents().find("#p"+ PageNo +" [data-ishigh='true']").each(function(index){  
      var $this = $(this);  
      var IsIDMatched = false;
      var SelNode = null;
      for(var i=0; i<ArrSelNodeToHigh.length; i++){
        //console.log($(this), $(this)[0].id, ArrSelNodeToHigh[i].I)
        if($(this)[0].id == ArrSelNodeToHigh[i].I){
          IsIDMatched = true;
          SelNode = ArrSelNodeToHigh[i];
        }
      }

      //console.log(IsIDMatched);

      if(IsIDMatched == true){
        $this.find("span[data-timestamp='"+ LastTimeStampUsed +"']").each(function(){            
          var ParentID = $(this).parent().attr("id");     
          //$(this).parent().html(GenerateOriginalHTML(ArrSelNodeToHigh[GetIndexOf(PageNo, ParentID)]));            
          $(this).parent().html(GenerateOriginalHTML(SelNode));
          var NodeID = SelNode.I;
          //console.log(PageNo, ParentID, NodeID);
          $("#page"+(PageNo) + " > iframe").contents().find("#p"+ PageNo +" > #" + NodeID + "").removeAttr("data-ishigh");      
          $("#page"+(PageNo) + " > iframe").contents().find("#p"+ PageNo +" > #" + NodeID + "").removeAttr("style");
          // $("#page"+(PageNo) + " > iframe").contents().find("#p"+ PageNo +" #"+ParentID+" #" + NodeID + "").removeAttr("data-ishigh");      
          // $("#page"+(PageNo) + " > iframe").contents().find("#p"+ PageNo +" #"+ParentID+" #" + NodeID + "").removeAttr("style");      
          if($("#page"+(PageNo) + " > iframe").contents().find("#p"+ PageNo +" > #" + NodeID + "").attr("onclick") == "parent.DeleteThisHigh(event)"){
            $("#page"+(PageNo) + " > iframe").contents().find("#p"+ PageNo +" > #" + NodeID + "").removeAttr("onclick");
          }
          $(this).remove();      
        });
      }
      //console.log($(this));            
    });

    setTimeout(function(){
      for(var i=0; i<ArrSelNodeToHigh.length; i++){
        var NodeID = ArrSelNodeToHigh[i].I;
        //console.log(NodeID, $("#page"+ PageNo + " > iframe").contents().find("#p"+ PageNo +" > #" + NodeID).attr("data-ishigh"))
        $("#page"+ PageNo + " > iframe").contents().find("#p"+ PageNo +" > #" + NodeID).removeAttr("data-ishigh");      
        $("#page"+ PageNo + " > iframe").contents().find("#p"+ PageNo +" > #" + NodeID).removeAttr("style");
      }       
      GetAllHighTagsAfterDelete(PageNo);               
    }, 50); 
  }
  UpdateHighlight();
  
  CopyArrHLTToArrLMSHLT(); //send data to SCORM 
}


function CheckDataLimit(){
  let TempDataArr = [];
  TempDataArr = JSON.parse(JSON.stringify(ArrHighltLMS));
  //console.log(JSON.stringify(TempDataArr), JSON.stringify(TempDataArr).length);
  if(JSON.stringify(TempDataArr).length < limitLength) {
    viewedLimitMessageOnce = false;
    return true;
  }
  else if(JSON.stringify(TempDataArr).length > limitLength){
    //ArrHighlt[PageNo] =  PageOldData;
    viewedLimitMessageOnce = true;
    // console.error(TempDataArr.length)
    $("#HightlightDataLimitEnds")
      .removeClass("hide").addClass("show")
      .animate({ opacity: 1 });
      return false;
  }
}



function GenerateOriginalHTML(TempObj){  
  //console.log(TempObj);
  var FinalOriginalHTML="";
  for(var i=0; i<TempObj.D.length; i++){
    FinalOriginalHTML = FinalOriginalHTML + TempObj.D[i][1];   
  }  
  //console.log(FinalOriginalHTML);
  return FinalOriginalHTML;
}





function HighSelText(e){  
  //console.log($("#"+e.target.id).parent().closest('div').attr('id'));
  CurrHighData.Clr = ArrHighColor[Number($("#"+e.target.id).attr("data-value"))];
  CloseHighPopup();
  var LeftPageNo = AudConfig.CurrPageNo;
  var RightPageNo = AudConfig.CurrPageNo + 1;
  var node;    
  //console.log(IsSelect);
  if(IsSelect){
    hltrL.doHighlight(true);
    hltrR.doHighlight(true);
  }

  //console.log(hltrL, hltrR);
  
  //hltrL.setColor(CurrHighData.Clr);  
  if(AudConfig.BookLayout == "magazine"){
    document.getElementById('page'+RightPageNo).getElementsByTagName('iframe')[0].contentWindow.getSelection().empty();
  }
  document.getElementById('page'+LeftPageNo).getElementsByTagName('iframe')[0].contentWindow.getSelection().empty();

  IsSelect = false;
  ArrOrgHTML = [];
  CopyArrHLTToArrLMSHLT(); //send data to SCORM
  //GetAllHighTags(PageNo);
}

function GenerateSpanString(TempObj){    
  //console.log("Called..................")
  var FinalSpanStr="";
  for(var i=0; i<TempObj.D.length; i++){
    if(TempObj.D[i][0] == "T"){
      FinalSpanStr = FinalSpanStr + TempObj.D[i][1];
    }
    else if(TempObj.D[i][0] == "S"){
      var SpanStr = '<span class="highlighted" data-timestamp="' + TempObj.T + '" style="background-color:' + ArrHighColor[Number(TempObj.C)] + '; pointer-events: none; user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; -o-user-select: none;" data-highlighted="true" data-parentid="' + TempObj.I + '" data-ishigh="true">' + TempObj.D[i][1] + '</span>';
      FinalSpanStr = FinalSpanStr + SpanStr;
    }
  }  
  //console.log(FinalSpanStr);
  return FinalSpanStr;
}

function FillHighlight(PageNo){
  var TempArrLen = ArrHighlt[PageNo].length;
  for(var i=0; i<TempArrLen; i++){
    $("#page"+PageNo + " > iframe").contents().find("#"+ArrHighlt[PageNo][i].I).html("");
    $("#page"+PageNo + " > iframe").contents().find("#"+ArrHighlt[PageNo][i].I).html(GenerateSpanString(ArrHighlt[PageNo][i]));             
    $("#page"+PageNo + " > iframe").contents().find("#"+ArrHighlt[PageNo][i].I).attr("data-ishigh",true); 
    $("#page"+PageNo + " > iframe").contents().find("#"+ArrHighlt[PageNo][i].I).css("user-select","none"); 
    $("#page"+PageNo + " > iframe").contents().find("#"+ArrHighlt[PageNo][i].I).css("-webkit-user-select","none");   
    $("#page"+PageNo + " > iframe").contents().find("#"+ArrHighlt[PageNo][i].I).css("-moz-user-select","none"); 
    $("#page"+PageNo + " > iframe").contents().find("#"+ArrHighlt[PageNo][i].I).css("-ms-user-select","none"); 
    $("#page"+PageNo + " > iframe").contents().find("#"+ArrHighlt[PageNo][i].I).css("-o-user-select","none"); 
    if($("#page"+PageNo + " > iframe").contents().find("#"+ArrHighlt[PageNo][i].I).attr("onclick") == undefined){
      $("#page"+PageNo + " > iframe").contents().find("#"+ArrHighlt[PageNo][i].I).attr("onclick", "parent.DeleteThisHigh(event)");
    }    
  }  
}

function UpdateHighlight(){
  var LeftPageNo = AudConfig.CurrPageNo;
  var RightPageNo = AudConfig.CurrPageNo + 1;

  if(AudConfig.BookLayout == "magazine"){
    FillHighlight(RightPageNo);
  }
  FillHighlight(LeftPageNo);

}

function HideHighlightMsgBox(){
  $("#HighMsgMainCont").removeClass("ClsOpen");
}


function ShowHighlightMsgBox(){
  $("#HighMsgMainCont").addClass("ClsOpen");
}

function DeleteHighlight(){
  var PageNo = Number(SelectedPageNo.substring(4));
  //console.log(SelectedPageNo.substring(4));

  SelectedTimeStmp = $("#page"+PageNo + " > iframe").contents().find("#"+SelectedHighID+" span").attr("data-timestamp");
  //console.log(SelectedTimeStmp);  

  //$("#page"+(PageNo) + " > iframe").contents().find("#p"+ PageNo +" div[data-ishigh='true']").each(function(index){ 
  $("#page"+(PageNo) + " > iframe").contents().find("#p"+ PageNo +" [data-ishigh='true']").each(function(index){    
    //console.log($(this));   
    var $this = $(this);
    $this.find("span[data-timestamp='"+ SelectedTimeStmp +"']").each(function(){            
      var ParentID = $(this).parent().attr("id");     
      $(this).parent().html(GenerateOriginalHTML(ArrHighlt[PageNo][GetIndexOf(PageNo, ParentID)]));            
      //console.log($(this).parent());
      $("#page"+(PageNo) + " > iframe").contents().find("#p"+ PageNo +" #"+ParentID+"").removeAttr("data-ishigh");      
      $("#page"+(PageNo) + " > iframe").contents().find("#p"+ PageNo +" #"+ParentID+"").removeAttr("style");      
      if($("#page"+(PageNo) + " > iframe").contents().find("#p"+ PageNo +" #"+ParentID+"").attr("onclick") == "parent.DeleteThisHigh(event)"){
        $("#page"+(PageNo) + " > iframe").contents().find("#p"+ PageNo +" #"+ParentID+"").removeAttr("onclick");
      }
      $(this).remove();      
    });    
  });

  GetAllHighTagsAfterDelete(PageNo);    
  HideHighlightMsgBox();
  CopyArrHLTToArrLMSHLT(); //send data to SCORM   
}



function DeleteThisHigh(e){
  var LeftPageNo = AudConfig.CurrPageNo;
  var RightPageNo = AudConfig.CurrPageNo + 1;
  SelectedHighID = e.target.id;   
  if($("#page"+(LeftPageNo) + " > iframe").contents().find("#p"+ LeftPageNo +" #"+SelectedHighID+"").html() != undefined){
    SelectedPageNo = "page"+LeftPageNo;
  } 
  else if($("#page"+(RightPageNo) + " > iframe").contents().find("#p"+ RightPageNo +" #"+SelectedHighID+"").html() != undefined){
    SelectedPageNo = "page"+RightPageNo;
  }     
  ShowHighlightMsgBox();
}



function CopyArrHLTToArrLMSHLT(){  
  //console.log(ArrHighlt);
  //RecArrHighDataL1[ChapterIndex] = ArrHighlt;
  ArrHighltLMS = [];
  var SepStr = '|';
  var LenArrHighlt =  ArrHighlt.length;
  for(var i=0; i<LenArrHighlt; i++){
    var NewTempArr = [];
    if(ArrHighlt[i].length > 0){        
      for(var j=0; j<ArrHighlt[i].length; j++){
        var TempArr = [];
        TempArr.push(ArrHighlt[i][j].I);
        TempArr.push(ArrHighlt[i][j].T);
        TempArr.push(ArrHighlt[i][j].C);
        //TempArr.push(ArrHighlt[i][j].D);                        
        NewTempArr.push(TempArr);
      }      
    } 
    
    //ArrHighltLMS.push(SepStr);
    ArrHighltLMS.push(NewTempArr);
  }
  //ArrHighltLMS.push(SepStr);  

  //console.log(ArrHighltLMS);
  //console.log(JSON.stringify(ArrHighltLMS), JSON.stringify(ArrHighltLMS).length);
}

/*-- Receiving functions from : LMS --*/

function CreateInitArrHigh(CIndex){
  var ArrInitLMSHigh = [];
  var SepStr = '|';
  for(var i=0; i<ArrChapPageNo[CIndex]; i++){
    ArrInitLMSHigh.push(SepStr);
    ArrInitLMSHigh.push([]);
  }  
  ArrInitLMSHigh.push(SepStr);
  //console.log()
  return ArrInitLMSHigh;
}

function RecvHighDataFromLMS(ArrHighltLMS){  
  //console.log(ArrHighltLMS);
  var LenArrHighltLMS =  ArrHighltLMS.length;
  ArrHighlt = [];
  for(var i=0; i<LenArrHighltLMS; i++){
    var NewTempArr = [];    
    if(ArrHighltLMS[i].length > 0){      
      for(var j=0; j<ArrHighltLMS[i].length; j++){
        var TempObj = {"I":null, "T":null, "C":null, "D":[]};
        TempObj.I = ArrHighltLMS[i][j][0];
        TempObj.T = ArrHighltLMS[i][j][1];
        TempObj.C = ArrHighltLMS[i][j][2];
        var Obj = [];
        //console.log(ArrHighltLMS[i][j][3]);
        //$("#page"+PageNo + " > iframe").contents().find("#"+ArrHighlt[PageNo][i].I).html("");
        Obj.push("S");
        Obj.push($("#page"+i + " > iframe").contents().find("#"+TempObj.I).html());
        TempObj.D.push(Obj);
        // for(k=0; k<ArrHighltLMS[i][j][3].length; k++){
        //   TempObj.D.push(ArrHighltLMS[i][j][3][k]);
        // }                        
        NewTempArr.push(TempObj);
      }                
    }  
    ArrHighlt.push(NewTempArr);
  }  
  //console.log(ArrHighlt);
}