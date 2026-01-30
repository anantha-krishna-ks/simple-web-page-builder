var ArrColor = ["#000000", "#ff0031", "#23ca00", "#0891fe", "#C70039", "#FFC300", "#5533FF", "#FF5733", "transparent"];
var DrawClr = "#000000";
var IsEraser = false;
var IsDrawing = false;
var LineW = 2;
var EraseSize = 8;
var CanvasDraw, CTXDraw;
// var P = { "LeftX": 0, "LeftY": 0, "RightX": 0, "RightY": 0 };

var CanvW = 0; var CanvH = 0;
var CanvTop = 0; var CanvLeft = 0;

$(document).ready(function () {
  $(".ClsBtnColour").click(function (e) { OnClrBtnClick(e) });
  $("#DvBtnPen").click(function (e) { OnPencilClick() });
  $("#DvBtnEraser").click(function (e) { OnEraserClick() });
  $("#DvBtnReset").click(function (e) { OnResetClick() });

  $("#DvAudIcon").click(function (e) { OnAudIconClick() });

  CanvasDraw = document.getElementById('DrawCanv');
  CTXDraw = CanvasDraw.getContext("2d");
  CTXDraw.strokeStyle = DrawClr; // Color
  CTXDraw.lineWidth = LineW; // Pen Size
  CTXDraw.lineCap = 'round';
  CTXDraw.globalAlpha = 1;
  CanvasDraw.onmousedown = StartDrawing;
  CanvasDraw.onmouseup = StopDrawing;
  CanvasDraw.onmousemove = ContinueDraw;

  // CanvasDraw.ontouchstart = StartDrawing;
  // CanvasDraw.ontouchend = StopDrawing;
  // CanvasDraw.ontouchmove = ContinueDraw;
  CanvasDraw.addEventListener('touchstart', StartDrawing, { passive: false });
  CanvasDraw.addEventListener('touchmove', ContinueDraw, { passive: false });
  CanvasDraw.addEventListener('touchend', StopDrawing, { passive: false });

  CanvW = CanvasDraw.offsetWidth;
  CanvH = CanvasDraw.offsetHeight;

  CanvTop = CanvasDraw.offsetTop;
  CanvLeft = CanvasDraw.offsetLeft;

  OnPencilClick();

});

function OnAudIconClick() {
  $("#AudAct")[0].play();
  $("#DvAudIcon").addClass("ClsDisable");
}

function OnActAudioEnded(e) {
  $("#DvAudIcon").removeClass("ClsDisable");
}

function OnClrBtnClick(e) {
  $(".ClsBtnColour").removeClass("ClsSelected");
  $("#" + e.target.id).addClass("ClsSelected");
  DrawClr = ArrColor[Number($("#" + e.target.id).attr("data-value"))];
}

function OnPencilClick() {
  IsEraser = false;
  $("#DvBtnPen").addClass("ClsActive");
  $("#DvBtnEraser").removeClass("ClsActive");
}

function OnEraserClick() {
  IsEraser = true;
  $("#DvBtnEraser").addClass("ClsActive");
  $("#DvBtnPen").removeClass("ClsActive");
}

function OnResetClick() {
  IsEraser = true;
  CTXDraw.clearRect(0, 0, CanvW, CanvH);
  OnPencilClick();
}

/**
 * 
 * @param {*} e : Event
 * @param {*} type : "pen" || "eraser"
 */
function FollowMouse(e, type) {
  // if(e.type === 'touchmove') {
  //   e = e.touches[0];
  // }
  if (type === 'pen') {
    $("#IconPen").css("left", (e.clientX) + "px");
    $("#IconPen").css("top", (e.clientY - 36) + "px");
  }
  else {
    $("#IconEraser").css("left", (e.clientX - 15) + "px");
    $("#IconEraser").css("top", (e.clientY - 25) + "px");
  }
}

/**
 * 
 * @param {*} e : event
 * Function call when - user first clicks
 */
function StartDrawing(e) {
  if (e.type === 'touchstart') {
    if (e.touches && e.touches.length > 0) {
      e = e.touches[0];
    }
    if (typeof e.preventDefault === 'function') e.preventDefault();
  }
  IsDrawing = true;
  CTXDraw.strokeStyle = DrawClr;
  CTXDraw.lineWidth = LineW;
  CTXDraw.lineCap = 'round';

  // NewX = ((e.clientX - CanvLeft));
  // NewY = ((e.clientY - CanvTop));
  let coords = getCanvasRelativeCoords(e);
  NewX = coords.x;
  NewY = coords.y;
  // console.log(NewX, NewY, e.clientX, e.clientY);

  $("#IconPen, #IconEraser").removeAttr("class").addClass("hide");
  if (IsEraser) {
    $("#IconEraser").removeClass("hide").addClass("show");
  }
  else {
    $("#IconPen").removeClass("hide").addClass("show");
  }

  if (IsEraser) {
    FollowMouse(e, "eraser"); // ERASER TOOL
  } else {
    // PEN TOOL
    CTXDraw.beginPath();
    CTXDraw.moveTo(NewX, NewY);
    FollowMouse(e, "pen");
  }

}

function getCanvasRelativeCoords(e) {
  let rect = CanvasDraw.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  return { x, y };
}

/**
 * 
 * @param {*} e : Event
 * Function call : When user mouse down and move cursor
 */
function ContinueDraw(e) {
  if (e.type === 'touchmove') {
    if (e.touches && e.touches.length > 0) {
      e = e.touches[0];
    }
    if (typeof e.preventDefault === 'function') e.preventDefault();
  }
  if (!IsDrawing) return; // if not drawing, stop

  CanvasDraw.style.cursor = "none";

  // NewX = (e.clientX - CanvLeft);
  // NewY = e.clientY - CanvTop;
  let coords = getCanvasRelativeCoords(e);
  NewX = coords.x;
  NewY = coords.y;
  // console.log(NewX, NewY, e.clientX, e.clientY); 

  if (IsEraser) {
    //clearCircle(P.LeftX, P.LeftY, EraseSize, CTXDraw);
    clearCircle(NewX, NewY, EraseSize, CTXDraw);
    FollowMouse(e, "eraser")
  }
  else {
    //CTXDraw.lineTo(P.LeftX, P.LeftY);
    CTXDraw.lineTo(NewX, NewY);
    CTXDraw.stroke();
    FollowMouse(e, "pen");
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
function clearCircle(x, y, r, ctx) {
  for (var i = 0; i < Math.round(Math.PI * r); i++) {
    var angle = (i / Math.round(Math.PI * r)) * 360;
    ctx.clearRect(x, y, Math.sin(angle * (Math.PI / 180)) * r, Math.cos(angle * (Math.PI / 180)) * r);
  }
}

/**
 * Function Call : When user stops drawing / mouse up
 */
function StopDrawing(e) {
  IsDrawing = false;
  CanvasDraw.style.cursor = "auto";
  $("#IconPen").removeAttr("class").addClass("hide");
  $("#IconEraser").removeAttr("class").addClass("hide");
  if (e && e.type && e.type.startsWith('touch') && typeof e.preventDefault === 'function') {
    e.preventDefault();
  }
}


// console.log=function(){}