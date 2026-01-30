function DisableAllTool(){   
  $("#IcTOC").addClass("disable");
  $("#IcBookmark").addClass("disable");
  $("#IcHighlight").addClass("disable");
  $("#IcGoToPage").addClass("disable") 
  $("#IcSearch").addClass("disable");
  $("#viewBtn").addClass("disable");
  $("#IcGlossary").addClass("disable");
  $("#IcPentool").addClass("disable") 
  $("#IcZoomIn").addClass("disable");
  $("#IcZoomOut").addClass("disable");
  $("#IcHelp").addClass("disable");
  $("#IcNote").addClass("disable");
  $("#IcThumbnail").addClass("disable");
  $("#IcSpotlight").addClass("disable");
  $("#IcReadmode").addClass("disable");
  $("#IcMaskIcon").addClass("disable");
  $("#IcMenuBtn").addClass("disable");
  $("#LabelPageNo").addClass("disable");  
  $("#gotoSet").addClass("disable");  
  $("#IcAudio").addClass("disable");
}

function EnableAllTool(){  
  $("#IcTOC").removeClass("disable");
  $("#IcBookmark").removeClass("disable");
  $("#IcHighlight").removeClass("disable");
  $("#IcGoToPage").removeClass("disable") 
  $("#IcSearch").removeClass("disable");
  $("#viewBtn").removeClass("disable");
  $("#IcGlossary").removeClass("disable");
  $("#IcPentool").removeClass("disable") 
  $("#IcZoomIn").removeClass("disable");
  $("#IcZoomOut").removeClass("disable");
  $("#IcHelp").removeClass("disable");
  $("#IcNote").removeClass("disable");
  $("#IcThumbnail").removeClass("disable");
  $("#IcSpotlight").removeClass("disable");
  $("#IcReadmode").removeClass("disable");
  $("#IcMaskIcon").removeClass("disable");
  $("#IcMenuBtn").removeClass("disable"); 
  $("#LabelPageNo").removeClass("disable");
  $("#gotoSet").removeClass("disable");
  $("#IcAudio").removeClass("disable");  

  if(!ZoomInfo.IsZoomActive){
    $("#IcZoomOut").addClass("disable");
  }
}
 
function EnableTool(ToolName){
  $("#"+ToolName).removeClass("disable");
}

function DeselectAllTool(){  
  //EnableAllTool();
  $("#IcTOC").removeClass("selected");
  $("#IcBookmark").removeClass("selected");
  $("#IcHighlight").removeClass("selected");
  $("#IcGoToPage").removeClass("selected");              
  $("#IcSearch").removeClass("selected");
  $("#viewBtn").removeClass("selected");
  $("#IcGlossary").removeClass("selected");
  $("#IcPentool").removeClass("selected");  
  $("#IcZoomIn").removeClass("selected");
  $("#IcZoomOut").removeClass("selected");
  $("#IcHelp").removeClass("selected");
  $("#IcNote").removeClass("selected");
  $("#IcThumbnail").removeClass("selected");
  $("#IcSpotlight").removeClass("selected");
  $("#IcReadmode").removeClass("selected");
  $("#IcMaskIcon").removeClass("selected"); 
  $("#IcAudio").removeClass("selected");   
}

function SelectTool(ToolName){
  DisableAllTool();
  EnableTool(ToolName);
  DeselectAllTool();
  $("#"+ToolName).addClass("selected");
  //console.log(ToolName);
}

function HideButton(BtnName){
  $("#"+BtnName).addClass("hide");
}

function ShowButton(BtnName){
  $("#"+BtnName).removeClass("hide");
}


