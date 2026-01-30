var panzoom = Panzoom($("#viewerCont")[0], {contain: 'outside', noBind: true });
//Panzoom(elem, { contain: 'outside', startScale: 1.5 })
panzoom.disablePan = false;
panzoom.contain = "inside";
var ZoomInfo = {
  "Counter":0,
  "ArrVal":[1, 1.25, 1.5, 1.75, 2],
  "IsZoomActive":false,
  "AllowPan":false
}

function GetZoomIn(){ 
  $("#dropMenu").removeClass("open");
  panzoom.bind()
  if(ZoomInfo.Counter == 0){
    MovePanClick();
  }
  if(ZoomInfo.Counter < ZoomInfo.ArrVal.length-1){
    ZoomInfo.Counter++;
    panzoom.zoom(ZoomInfo.ArrVal[ZoomInfo.Counter]);    
  }
  if(ZoomInfo.Counter >= ZoomInfo.ArrVal.length-1){
    $("#IcZoomIn").addClass("disable");
    $("#IcZoomOut").removeClass("disable");          
  }
  else{
    $("#IcZoomIn").removeClass("disable");
    $("#IcZoomOut").removeClass("disable");       
  }
  ZoomInfo.IsZoomActive = true;
  $("#panControlCont").removeAttr("class").addClass("show");
  // Restrict panning to all sides when zoomed in
  panzoom.setOptions({ contain: 'none' });
  UnbindNoteEventFromPage(); //remove note crosshair cursor
}


function GetZoomOut(){
  $("#dropMenu").removeClass("open");
  panzoom.bind()
  if(ZoomInfo.Counter > 0){
    ZoomInfo.Counter--;
    panzoom.zoom(ZoomInfo.ArrVal[ZoomInfo.Counter]);      
  }

  if(ZoomInfo.Counter <= 0){
    panzoom.destroy()
    $("#IcZoomIn").removeClass("disable");
    $("#IcZoomOut").addClass("disable");
    ZoomInfo.IsZoomActive = false;        
    $("#panControlCont").removeAttr("class").addClass("hide");
    ResetZoom();
  } 
  else{
    $("#IcZoomIn").removeClass("disable");
    $("#IcZoomOut").removeClass("disable");            
    $("#panControlCont").removeAttr("class").addClass("show");
  }
  UnbindNoteEventFromPage(); //remove note crosshair cursor
}

function ResetZoom(){
  ZoomInfo.IsZoomActive = false;  
  ZoomInfo.Counter = 0;
  $("#IcZoomIn").removeClass("disable");
  $("#IcZoomOut").addClass("disable");  
  panzoom.disablePan = true;   
  panzoom.zoom(ZoomInfo.ArrVal[ZoomInfo.Counter]);
  panzoom.reset();
  panzoom.setOptions({ contain: 'outside' });
  $("#viewer").removeClass("disable"); 
  $("#defaultPan, #movePan").removeAttr("class");
  $("#defaultPan").addClass("disable");
  $("#movePan").addClass("enable");
}

function DefaultPanClick(){
  $("#defaultPan, #movePan").removeAttr("class");
  $("#movePan").addClass("enable");
  ZoomInfo.AllowPan = false;
  panzoom.disablePan = false;
  $("#viewer").removeClass("disable");
}

function MovePanClick(){
  $("#defaultPan, #movePan").removeAttr("class");  
  $("#defaultPan").addClass("enable");
  ZoomInfo.AllowPan = true;
  panzoom.disablePan = true;
  $("#viewer").addClass("disable");
}