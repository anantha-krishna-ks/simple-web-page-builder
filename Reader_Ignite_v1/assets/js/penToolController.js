var DInfo = {
  "ArrDraw":[], // to store drawing.
  "LeftPageNo":null, "RightPageNo":null,
  "CanvasLeft":null, "CanvasRight":null, "CTXLeft":null, "CTXRight":null, "CanvWL":0, "CanvHL":0, "CanvWR":0, "CanvHR":0,
  "IsDrawing":false,"Clr":"#000000", "LineW":10, "IsEraser":false, "EraseSize":10, "TransClr":"transparent",
  "DragLmt":{"MinX":0, "MinY":0, "MaxX":1062, "MaxY":680},
};

var originalRuler, wrapperRulerLeft;


var ArrDrawSteps = [];
var DrawPageNo = null;
var LDrawPageNo = null;
var RDrawPageNo = null;
var PageSide = null;
var IsLastPencil = true;
var LeftPageOffSet, RightPageOffSet;
var wrapperLeft = $("#wrapper").offset().left;
var P = {"LeftX":0, "LeftY":0, "RightX":0, "RightY":0};

InitPenTool();

function InitPenTool(){
  for(var i=0; i<config.bounds.length; i++){
    //var NewObj = {"CTX":null, "CanvID":"", "ImgData":""}
    DInfo.ArrDraw.push("");
    var NewArray = [];
    ArrDrawSteps.push(NewArray);
  }    
  RegEventsColourPallete();
}

function ResetPenTool(){    
  DInfo.CanvasLeft = null;
  DInfo.CanvasRight = null;
  DInfo.CTXLeft = null;
  DInfo.CTXRight = null;
  DInfo.IsDrawing = false;
  DInfo.Clr = "#000000";
  DInfo.LineW = 7;
  DInfo.IsEraser = false;  
  DInfo.ArrDraw = [];  
  DInfo.LeftPageNo = null;
  DInfo.RightPageNo = null;
}

function RegEventsColourPallete(){	
  $('#ContClrPlt').draggable({
    /*containment: "#DvMainCont",*/
    start: function (event, ui) {		
      var originalRuler = ui.originalPosition;		
    },
    drag: function (event, ui) {			
      wrapperRulerLeft = $("#main").offset().left;
      var newLeft, changeLeft, newTop, changeTop;			
      changeLeft = ui.position.left;
      newLeft = changeLeft / CurrScale.X; 
      changeTop = ui.position.top;
      newTop = changeTop / CurrScale.Y;

      var DragItemWidth = Number($(this).width());
      var DragItemHeight = Number($(this).height());

      /*-- drag limits : starts --*/
      if(newLeft <= DInfo.DragLmt.MinX){newLeft = DInfo.DragLmt.MinX;}				
      if(newTop <= DInfo.DragLmt.MinY){newTop = DInfo.DragLmt.MinY;}				
      if(newLeft >= DInfo.DragLmt.MaxX - DragItemWidth){newLeft = DInfo.DragLmt.MaxX - DragItemWidth;}				
      if(newTop >= DInfo.DragLmt.MaxY - DragItemHeight){newTop = DInfo.DragLmt.MaxY - DragItemHeight;}
      /*-- drag limits : ends --*/

      ui.position.left = newLeft;
      ui.position.top = newTop;									
    },
    stop: function (e, ui){							
    }
  });	
  
}

function SelectColour(e){
  e.preventDefault();
  e.stopPropagation();
  RemoveAllSelected();
  $("#"+e.target.id).addClass("ClsSelected");
  DInfo.IsEraser = false;
  DInfo.Clr = $("#"+e.target.id).attr("data-colour");
  DInfo.LineW = Number($("#"+e.target.id).attr("data-value"));  
}

function HandlePenTool(e){
  $("#dropMenu").removeClass("open");
  if($("#ContClrPlt").hasClass("hide")){
    OpenPenTool();    
  }
  else{
    ClosePenTool();
    $("#IconPen").removeAttr("style");
    $("#IconEraser").removeAttr("style");
  }

  UnbindNoteEventFromPage(); //remove note crosshair cursor
}

function SelectEraser(){
  RemoveAllSelected();
  $("#Cell4_0").addClass("ClsSelected");
  DInfo.IsEraser = true;
  DInfo.Clr = DInfo.TransClr;
  DInfo.LineW = DInfo.EraseSize;  
}

function RemoveAllSelected(){
  $(".ClsPCell").removeClass("ClsSelected");
}

function SelectReset(){
  DeleteLastStep();
}

function OpenPenTool(){
  HideButton("prEvBtn");            
  HideButton("neXtBtn");            
  SelectTool("IcPentool");
  CreateCanvas();
  $("#viewerCont").addClass("penTool");
  $("#ContClrPlt").css("top",300+"px");
  $("#ContClrPlt").css("left",200+"px");
  $("#ContClrPlt").removeClass("hide").addClass("show");

  RemoveAllSelected();
  $("#Cell0_0").addClass("ClsSelected");
  DInfo.Clr = $("#Cell0_0").attr("data-colour");
  DInfo.LineW = Number($("#Cell0_0").attr("data-value"));
  DInfo.IsEraser = false;  
}

function ClosePenTool(){
  ShowButton("prEvBtn");            
  ShowButton("neXtBtn"); 
  EnableAllTool();              
  DeselectAllTool();
  GetCanvasData();  
  $("#viewerCont").removeClass("penTool");
  $("#ContClrPlt").removeAttr("style");
  $("#ContClrPlt").removeClass("show").addClass("hide");
  PageSide = null;
}

function UpdateCanvasPageNo(){
  DInfo.LeftPageNo = AudConfig.CurrPageNo;
  DInfo.RightPageNo = AudConfig.CurrPageNo + 1;
}

function CreateCanvas(){
  panzoom.destroy();
  $("#panControlCont").removeClass('show').addClass('hide');
  $("#viewer").removeClass("disable");
  // panzoom.cursor = "none";
  // panzoom.disablePan = true;
  //console.log(panzoom);

  DInfo.LeftPageNo = AudConfig.CurrPageNo;
  DInfo.RightPageNo = AudConfig.CurrPageNo + 1;  

  //console.log(DInfo.LeftPageNo, DInfo.RightPageNo);

  DInfo.CanvWL = $("#page"+DInfo.LeftPageNo).width();
  DInfo.CanvHL = $("#page"+DInfo.LeftPageNo).height();

  DInfo.CanvWR = $("#page"+DInfo.RightPageNo).width();
  DInfo.CanvHR = $("#page"+DInfo.RightPageNo).height();

  var PageContLeft = document.getElementById("page"+DInfo.LeftPageNo);
  var CanvasLeft = document.createElement('canvas');
  CanvasLeft.id = "DrawCanv"+DInfo.LeftPageNo;
  CanvasLeft.setAttribute("width", DInfo.CanvWL);
  CanvasLeft.setAttribute("height", DInfo.CanvHL); 
  CanvasLeft.style.width = DInfo.CanvWL + "px";
  CanvasLeft.style.height = DInfo.CanvHL + "px";
  CanvasLeft.style.position = "absolute";
  CanvasLeft.style.top = 0 + "px";
  CanvasLeft.style.left = 0 + "px";
  CanvasLeft.style.display = "inline-block";
  CanvasLeft.dataset.pagenum = DInfo.LeftPageNo;
  CanvasLeft.dataset.pagetype = "Left";
  PageContLeft.appendChild(CanvasLeft);    

  if(AudConfig.BookLayout == "magazine"){
    var PageContRight = document.getElementById("page"+DInfo.RightPageNo);
    var CanvasRight = document.createElement('canvas');
    CanvasRight.id = "DrawCanv"+DInfo.RightPageNo;
    CanvasRight.setAttribute("width", DInfo.CanvWR);
    CanvasRight.setAttribute("height", DInfo.CanvHR); 
    CanvasRight.style.width = DInfo.CanvWR + "px";
    CanvasRight.style.height = DInfo.CanvHR + "px";
    CanvasRight.style.position = "absolute";
    CanvasRight.style.top = 0 + "px";
    CanvasRight.style.left = 0 + "px";
    CanvasRight.style.display = "inline-block";
    CanvasRight.dataset.pagenum = DInfo.RightPageNo;
    CanvasRight.dataset.pagetype = "Right";
    PageContRight.appendChild(CanvasRight);    
  }
  scaleStage();
  PutCanvasData();     
}

function PutCanvasData(){      
  DInfo.CanvasLeft = document.getElementById("DrawCanv"+DInfo.LeftPageNo);
  DInfo.CTXLeft = DInfo.CanvasLeft.getContext("2d");
  DInfo.CTXLeft.clearRect(0, 0, DInfo.CanvasLeft.offsetWidth, DInfo.CanvasLeft.offsetHeight);
  if(DInfo.ArrDraw[DInfo.LeftPageNo]!= ""){
    DInfo.CTXLeft.putImageData(DInfo.ArrDraw[DInfo.LeftPageNo], 0, 0);
  }   
  if(AudConfig.BookLayout == "magazine"){        
    DInfo.CanvasRight = document.getElementById("DrawCanv"+DInfo.RightPageNo);
    DInfo.CTXRight = DInfo.CanvasRight.getContext("2d");
    DInfo.CTXRight.clearRect(0, 0, DInfo.CanvasRight.offsetWidth, DInfo.CanvasRight.offsetHeight);
    if(DInfo.ArrDraw[DInfo.RightPageNo]!= ""){
      DInfo.CTXRight.putImageData(DInfo.ArrDraw[DInfo.RightPageNo], 0, 0);
    }          
  }    
  RegisterCanvasEvents(); 
}

function GetCanvasData(){    
  DInfo.CanvasLeft = document.getElementById("DrawCanv"+DInfo.LeftPageNo);
  if(DInfo.CanvasLeft != undefined){
    DInfo.CTXLeft = DInfo.CanvasLeft.getContext("2d");
    var NewImgDataLeft = DInfo.CTXLeft.getImageData(0, 0, DInfo.CanvasLeft.offsetWidth, DInfo.CanvasLeft.offsetHeight);  
    DInfo.ArrDraw[DInfo.LeftPageNo] = "";
    DInfo.ArrDraw[DInfo.LeftPageNo] = NewImgDataLeft;
    $("#DrawCanv"+DInfo.LeftPageNo).remove();
  }  
  
  if(AudConfig.BookLayout == "magazine"){        
    DInfo.CanvasRight = document.getElementById("DrawCanv"+DInfo.RightPageNo);
    if(DInfo.CanvasRight != undefined){
      DInfo.CTXRight = DInfo.CanvasRight.getContext("2d");
      var NewImgDataRight = DInfo.CTXRight.getImageData(0, 0, DInfo.CanvasRight.offsetWidth, DInfo.CanvasRight.offsetHeight);  
      DInfo.ArrDraw[DInfo.RightPageNo] = "";
      DInfo.ArrDraw[DInfo.RightPageNo] = NewImgDataRight;
      $("#DrawCanv"+DInfo.RightPageNo).remove();
    } 
  }

  if(panzoom.getScale() > 1) {
    $("#panControlCont").removeClass('hide').addClass('show');
    panzoom.bind();
    MovePanClick()
  };
  
}




/**
 * 
 * @param {*} e : Event
 * @param {*} type : "pen" || "eraser"
 */
 function FollowMouse (e, type) {
  // if(e.type === 'touchmove') {
  //   e = e.touches[0];
  // }
  if (type === 'pen') {
    $("#IconPen").css("left", (e.clientX) + "px");
    $("#IconPen").css("top",  (e.clientY - 40) + "px");
  }
  else {
    $("#IconEraser").css("left", (e.clientX - 15) + "px");
    $("#IconEraser").css("top",  (e.clientY - 25) + "px");
  }
}

/**
 * 
 * @param {*} e : event
 * Function call when - user first clicks
 */
function StartDrawing(e) { 
  if(e.type === 'touchmove') {
    e = e.touches[0];
  }  
  //alert("Hello");
  var top = $("#main").offset().top,
  wrapperLeft = $("#wrapper").offset().left;
  viewportLeft = wrapperLeft -($("#viewerCont").offset().left),
  viewportTop = top -($("#viewerCont").offset().top),
  panzoomScale = panzoom.getScale();  

  LDrawPageNo = AudConfig.CurrPageNo;
  RDrawPageNo = AudConfig.CurrPageNo + 1;

  //console.log(AudConfig.CurrPageNo);

  LeftPageOffSet = $("#page"+LDrawPageNo)[0].offsetLeft;
  if(LastPagePos == "R" && AudConfig.BookLayout == "presentation" && AudConfig.CurrPageNo == config.pagecount-1){

  }
  else{
    RightPageOffSet = $("#page"+RDrawPageNo)[0].offsetLeft;
  }
  

  //console.log(DInfo.LineW, DInfo.Clr);
  if(AudConfig.BookLayout == "magazine"){
    DInfo.CTXRight.strokeStyle = DInfo.Clr;
    DInfo.CTXRight.lineWidth = DInfo.LineW;
    DInfo.CTXRight.lineCap = 'round';
  }    
  DInfo.CTXLeft.strokeStyle = DInfo.Clr;
  DInfo.CTXLeft.lineWidth = DInfo.LineW;
  DInfo.CTXLeft.lineCap = 'round'; 
  
  DInfo.IsDrawing = true;

  $("#IconPen, #IconEraser").removeAttr("class").addClass("hide");
  if (DInfo.IsEraser) {
    $("#IconEraser").removeClass("hide").addClass("show");
  } else {
    $("#IconPen").removeClass("hide").addClass("show");
  }   

  P.LeftY = ((e.clientY - top + (viewportTop))/panzoomScale)/(window.zoomFactor);
  P.RightY = ((e.clientY - top + (viewportTop))/panzoomScale)/(window.zoomFactor);  

  if($("#"+e.target.id).attr("data-pagetype") == "Left") 
  {
    // LEFT CANVAS
    DrawPageNo = LDrawPageNo;
    PageSide = "L";    

    if(AudConfig.BookLayout == "presentation"){
      P.LeftX = (((e.clientX - wrapperLeft + (viewportLeft))/panzoomScale)/window.zoomFactor) - LeftPageOffSet;      
    }    
    else{
      P.LeftX = (((e.clientX - wrapperLeft + (viewportLeft))/panzoomScale)/window.zoomFactor)- LeftPageOffSet;      
    }    

    if (DInfo.IsEraser)
    {      
      FollowMouse (e, "eraser"); // ERASER TOOL
    }
    else
    {
      // PEN TOOL
      DInfo.CTXLeft.beginPath();
      DInfo.CTXLeft.moveTo(P.LeftX, P.LeftY);
      FollowMouse (e, "pen");
    }    
  }
  else
  {
    // RIGHT CANVAS
    DrawPageNo = RDrawPageNo;
    PageSide = "R";  
    //var rw = $(".rightPage").offset().left - wrapperLeft;
    //var rw = $($(".rightPage")[0]).offset().left - wrapperLeft;
    var rw = $("#page"+RDrawPageNo).offset().left - wrapperLeft;
    P.RightX = (((e.clientX - wrapperLeft - rw)/panzoomScale)/window.zoomFactor);    
    if (DInfo.IsEraser)
    {      
      FollowMouse (e, "eraser"); // ERASER TOOL
    }
    else{
      // PEN TOOL
      //console.log(DInfo.CTXRight)
      DInfo.CTXRight.beginPath();
      DInfo.CTXRight.moveTo(P.RightX, P.RightY);
      FollowMouse (e, "pen");
      //console.log("Drawing ......")
    }

    //console.log($(".rightPage"), P.LeftX, P.RightX);
  }  
}

/**
 * 
 * @param {*} e : Event
 * Function call : When user mouse down and move cursor
 */
function ContinueDraw(e) {
  if(e.type === 'touchmove') {
    e = e.touches[0];
  }
  //alert("Hello2");
  if(!DInfo.IsDrawing) return; // if not drawing, stop  
  var top = $("#main").offset().top,
  wrapperLeft = $("#wrapper").offset().left;
  viewportLeft = wrapperLeft -($("#viewerCont").offset().left),
  viewportTop = top -($("#viewerCont").offset().top),
  panzoomScale = panzoom.getScale();  
  P.LeftY = ((e.clientY - top + (viewportTop))/panzoomScale)/(window.zoomFactor);
  P.RightY = ((e.clientY - top + (viewportTop))/panzoomScale)/(window.zoomFactor);

  if($("#"+e.target.id).attr("data-pagetype") == "Left")
  {    
    // LEFT CANVAS
    DInfo.CanvasLeft.style.cursor = "none";
    if(AudConfig.BookLayout == "presentation"){
      P.LeftX = (((e.clientX - wrapperLeft + (viewportLeft))/panzoomScale)/window.zoomFactor) - LeftPageOffSet;
    }    
    else{
      P.LeftX = (((e.clientX - wrapperLeft + (viewportLeft))/panzoomScale)/window.zoomFactor) - LeftPageOffSet;
    }

    if(DInfo.IsEraser){      
      clearCircle(P.LeftX, P.LeftY, DInfo.EraseSize, DInfo.CTXLeft);
      FollowMouse (e, "eraser")
    }
    else{
      DInfo.CTXLeft.lineTo(P.LeftX, P.LeftY);
      DInfo.CTXLeft.stroke();    
      FollowMouse (e, "pen");      
    }
  }
  else{
    // RIGHT CANVAS
    DInfo.CanvasRight.style.cursor = "none";

    //var rw = $(".rightPage").offset().left - wrapperLeft;
    //var rw = $($(".rightPage")[0]).offset().left - wrapperLeft;
    var rw = $("#page"+RDrawPageNo).offset().left - wrapperLeft;
    P.RightX = (((e.clientX - wrapperLeft - rw)/panzoomScale)/window.zoomFactor);
    

    if(DInfo.IsEraser){      
      clearCircle(P.RightX, P.RightY, DInfo.EraseSize, DInfo.CTXRight);
      FollowMouse (e, "eraser")
    }
    else{
      DInfo.CTXRight.lineTo(P.RightX, P.RightY);
      DInfo.CTXRight.stroke();
      FollowMouse (e, "pen");      
    }     
  }
}

/**
 * 
 * @param {*} x : x
 * @param {*} y : y
 * @param {*} r : radius
 * @param {*} ctx : Canvas's Context 2d
 * Function Call : Remove/Erase in Circular Shape
 */
function clearCircle( x , y , r, ctx){
  for( var i = 0 ; i < Math.round( Math.PI * r ) ; i++ ){
      var angle = ( i / Math.round( Math.PI * r )) * 360;
      ctx.clearRect( x , y , Math.sin( angle * ( Math.PI / 180 )) * r , Math.cos( angle * ( Math.PI / 180 )) * r );
  }
}

/**
 * Function Call : When user stops drawing / mouse up
 */
function StopDrawing() {
  DInfo.IsDrawing = false; 
  if(AudConfig.BookLayout == "magazine"){
    DInfo.CanvasRight.style.cursor = "auto";
  }
  DInfo.CanvasLeft.style.cursor = "auto";

  $("#IconPen").removeAttr("class").addClass("hide");
  $("#IconEraser").removeAttr("class").addClass("hide");  
  AddDrawingStep();
}

function RegisterCanvasEvents(){   
  //console.log("--"+"DrawCanv");
  //console.log(DInfo.LineW);
  DInfo.CTXLeft.strokeStyle = DInfo.Clr; // Color
  DInfo.CTXLeft.lineWidth = DInfo.LineW; // Pen Size
  DInfo.CTXLeft.lineCap = 'round';
  DInfo.CTXLeft.globalAlpha = 1;
  DInfo.CanvasLeft.onmousedown = StartDrawing;
  DInfo.CanvasLeft.onmouseup = StopDrawing;
  DInfo.CanvasLeft.onmousemove = ContinueDraw;


  DInfo.CanvasLeft.ontouchstart = StartDrawing;
  DInfo.CanvasLeft.ontouchend = StopDrawing;
  DInfo.CanvasLeft.ontouchmove = ContinueDraw;

  DInfo.CanvasLeft.onpointerdown = StartDrawing;
  DInfo.CanvasLeft.onpointerup = StopDrawing;
  DInfo.CanvasLeft.onpointermove = ContinueDraw;

  if (AudConfig.BookLayout == "magazine") {
    DInfo.CanvasRight.onpointerdown = StartDrawing;
    DInfo.CanvasRight.onpointerup = StopDrawing;
    DInfo.CanvasRight.onpointermove = ContinueDraw;
  }
}


function AddDrawingStep(){
  IsLastPencil = true;
  if(PageSide == "L"){
    DInfo.CanvasLeft = document.getElementById("DrawCanv"+DInfo.LeftPageNo);
    if(DInfo.CanvasLeft != undefined){
      DInfo.CTXLeft = DInfo.CanvasLeft.getContext("2d");
      var NewImgDataLeft = DInfo.CTXLeft.getImageData(0, 0, DInfo.CanvasLeft.offsetWidth, DInfo.CanvasLeft.offsetHeight);      
      ArrDrawSteps[DrawPageNo].push(NewImgDataLeft);
    }
  }
  else if(PageSide == "R"){
    DInfo.CanvasRight = document.getElementById("DrawCanv"+DInfo.RightPageNo);
    if(DInfo.CanvasRight != undefined){
      DInfo.CTXRight = DInfo.CanvasRight.getContext("2d");
      var NewImgDataRight = DInfo.CTXRight.getImageData(0, 0, DInfo.CanvasRight.offsetWidth, DInfo.CanvasRight.offsetHeight);  
      ArrDrawSteps[DrawPageNo].push(NewImgDataRight);
    }
  } 
  
  //console.log(DInfo.CanvasLeft, DInfo.CanvasRight);
}

function DeleteLastStep(){
  if(ArrDrawSteps[DrawPageNo].length > 0 && IsLastPencil){
    ArrDrawSteps[DrawPageNo].pop();
    IsLastPencil = false;
  }

  if(PageSide == "L"){    
    DInfo.CanvasLeft = document.getElementById("DrawCanv"+DInfo.LeftPageNo);
    DInfo.CTXLeft = DInfo.CanvasLeft.getContext("2d");
    DInfo.CTXLeft.clearRect(0, 0, DInfo.CanvasLeft.offsetWidth, DInfo.CanvasLeft.offsetHeight);
    if(ArrDrawSteps[DrawPageNo].length > 0){      
      var LastElement = ArrDrawSteps[DrawPageNo].length - 1;      
      DInfo.CTXLeft.putImageData(ArrDrawSteps[DrawPageNo][LastElement], 0, 0);
      ArrDrawSteps[DrawPageNo].pop();
    }       
  }
  else if(PageSide == "R"){
    DInfo.CanvasRight = document.getElementById("DrawCanv"+DInfo.RightPageNo);
    DInfo.CTXRight = DInfo.CanvasRight.getContext("2d");
    DInfo.CTXRight.clearRect(0, 0, DInfo.CanvasRight.offsetWidth, DInfo.CanvasRight.offsetHeight);
    if(ArrDrawSteps[DrawPageNo].length > 0){
      var LastElement = ArrDrawSteps[DrawPageNo].length - 1;      
      DInfo.CTXRight.putImageData(ArrDrawSteps[DrawPageNo][LastElement], 0, 0);
      ArrDrawSteps[DrawPageNo].pop();
    }
  } 
}

/*
function _SelectReset(){
  RemoveAllSelected();
  $("#Cell0_0").addClass("ClsSelected");
  DInfo.Clr = $("#Cell0_0").attr("data-colour");
  DInfo.LineW = Number($("#Cell0_0").attr("data-value"));
  DInfo.IsEraser = false;

  
  DInfo.CanvasLeft = document.getElementById("DrawCanv"+DInfo.LeftPageNo);
  if(DInfo.CanvasLeft != undefined){
    DInfo.CTXLeft = DInfo.CanvasLeft.getContext("2d");
    var NewImgDataLeft = DInfo.CTXLeft.getImageData(0, 0, DInfo.CanvasLeft.offsetWidth, DInfo.CanvasLeft.offsetHeight);  
    DInfo.ArrDraw[DInfo.LeftPageNo] = "";
    DInfo.ArrDraw[DInfo.LeftPageNo] = NewImgDataLeft;
    DInfo.CTXLeft.clearRect(0, 0, DInfo.CanvasLeft.offsetWidth, DInfo.CanvasLeft.offsetHeight);
  }  
  
  if(AudConfig.BookLayout == "magazine"){        
    DInfo.CanvasRight = document.getElementById("DrawCanv"+DInfo.RightPageNo);
    if(DInfo.CanvasRight != undefined){
      DInfo.CTXRight = DInfo.CanvasRight.getContext("2d");
      var NewImgDataRight = DInfo.CTXRight.getImageData(0, 0, DInfo.CanvasRight.offsetWidth, DInfo.CanvasRight.offsetHeight);  
      DInfo.ArrDraw[DInfo.RightPageNo] = "";
      DInfo.ArrDraw[DInfo.RightPageNo] = NewImgDataRight;
      DInfo.CTXRight.clearRect(0, 0, DInfo.CanvasRight.offsetWidth, DInfo.CanvasRight.offsetHeight);
    } 
  }  
}
*/