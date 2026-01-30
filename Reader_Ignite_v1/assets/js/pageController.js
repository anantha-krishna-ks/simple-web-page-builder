var ArrPagemark = [];
var ArrPagemarkLMS = [];
var ICanPageNo = 0;
var ExtraPage = 0;
var BookPercentage = 0;
function InitPagemark(){
  ArrPagemark = [];
  for(var i=0; i<config.pagecount; i++){
    var NewObj = {"S":false, "A":[]};
    ArrPagemark.push(NewObj);
  }

  ICanPageNo = Number(AudConfig.ICanPageNo) - Number(AudConfig.BookStartPrintPageNo);
  //ExtraPage = Number(AudConfig.ICanPageNo) - Number(AudConfig.BookStartPrintPageNo) + 1;

}
InitPagemark();

var PD = {
  "MaxTime":15000, "CTime":0, "TimeInter":1000, "PgTimer":null, "IsFirstHelp":false  
};

/*-- page timer : starts --*/
function StartPageTimer(){  
  StopPageTimer();
  // console.log("StartPageTimer");
  PD.PgTimer = setInterval( function () {   
    MarkPage();
		PD.CTime = PD.CTime + PD.TimeInter;
    if(PD.CTime > PD.MaxTime){PD.CTime = 0;}
    // console.log(PD.CTime);
	},PD.TimeInter);
}

function StopPageTimer(){
  clearInterval(PD.PgTimer);
  PD.PgTimer = null;
  PD.CTime = 0;
  // console.log("StopPageTimer");
}
/*-- page timer : ends --*/

//in glossary js
function FirstTimeHelpClose(){
  if(!PD.IsFirstHelp){
    OnPageChange();
  }
  PD.IsFirstHelp = true;
}

//in reader js
function FromLoadPageItems(){
  if(PD.IsFirstHelp){
    OnPageChange();
  } 
}

function OnPageChange(){
  var LeftPageNo = AudConfig.CurrPageNo;
  var RightPageNo = AudConfig.CurrPageNo + 1;
  GetAudioInfo();  
  OnPageUpdateMarkPage();
  if(AudConfig.BookLayout == "magazine"){
    if(!ArrPagemark[LeftPageNo].S || !ArrPagemark[RightPageNo].S){      
      StartPageTimer();
    }    
  }
  else{
    if(!ArrPagemark[LeftPageNo].S){      
      StartPageTimer();
    }
  }  
}

function GetAudioInfo(){
  var LeftPageNo = AudConfig.CurrPageNo;
  var RightPageNo = AudConfig.CurrPageNo + 1;
  if(AudConfig.BookLayout == "magazine"){ 
    if(ArrPagemark[RightPageNo].A.length == 0){
      var ArrAnchorsR = $("#page"+(RightPageNo) + " > iframe").contents().find("a.audioIcon");
      // console.log(ArrAnchorsR);
      for(var i=0; i<ArrAnchorsR.length; i++){
        if(ArrAnchorsR[i].id != undefined){
          var NewObj = {"AudID":ArrAnchorsR[i].id, "S":false};  
          if(ArrPagemark[RightPageNo].S){
            NewObj.S = true;
          }
          ArrPagemark[RightPageNo].A.push(NewObj);
        }
      }
    }    
  }

  if(ArrPagemark[LeftPageNo].A.length == 0){   
    var ArrAnchorsL = $("#page"+(LeftPageNo) + " > iframe").contents().find("a.audioIcon");
      // console.log(ArrAnchorsL);
      for(var i=0; i<ArrAnchorsL.length; i++){
        if(ArrAnchorsL[i].id != undefined){
          var NewObj = {"AudID":ArrAnchorsL[i].id, "S":false};  
          if(ArrPagemark[LeftPageNo].S){
            NewObj.S = true;
          }
          ArrPagemark[LeftPageNo].A.push(NewObj);
        }
      }
  }
  // console.log(ArrPagemark);
}

function UpdateAudioInfo(RcvdAudID){
  // console.log(RcvdAudID);
  var LeftPageNo = AudConfig.CurrPageNo;
  var RightPageNo = AudConfig.CurrPageNo + 1;
  if(AudConfig.BookLayout == "magazine"){ 
    for(var i=0; i<ArrPagemark[RightPageNo].A.length; i++){
      // console.log(ArrPagemark[RightPageNo].A[i].AudID, RcvdAudID);
      if(ArrPagemark[RightPageNo].A[i].AudID == RcvdAudID){
        ArrPagemark[RightPageNo].A[i].S = true;
      }
    }
  }

  for(var i=0; i<ArrPagemark[LeftPageNo].A.length; i++){
    if(ArrPagemark[LeftPageNo].A[i].AudID == RcvdAudID){
      ArrPagemark[LeftPageNo].A[i].S = true;
    }
  }

  MarkPage();

  // console.log(ArrPagemark);
}

function MarkPage(){
  var LeftPageNo = AudConfig.CurrPageNo;
  var RightPageNo = AudConfig.CurrPageNo + 1;


  // console.log(LeftPageNo,RightPageNo );

  var PagemarkTagStyleR = "class='ClsPagemark' style='z-index:2; position:absolute; width:"+ AudConfig.RightPageTickInfo.W +"px; height:"+ AudConfig.RightPageTickInfo.H +"px; bottom:"+ AudConfig.RightPageTickInfo.Bottom +"px; right:"+ AudConfig.RightPageTickInfo.Right +"px; background-image:url(icons/tickPage.png); background-repeat:no-repeat; background-size:cover;'></div>";
  var PagemarkTagR;  

  var PagemarkTagStyleL = "class='ClsPagemark' style='z-index:2; position:absolute; width:"+ AudConfig.LeftPageTickInfo.W +"px; height:"+ AudConfig.LeftPageTickInfo.H +"px; bottom:"+ AudConfig.LeftPageTickInfo.Bottom +"px; left:"+ AudConfig.LeftPageTickInfo.Left +"px; background-image:url(icons/tickPage.png); background-repeat:no-repeat; background-size:cover;'></div>";
  var PagemarkTagL;

  if(AudConfig.BookLayout == "magazine"){ 
    PagemarkTagR = "<div id= Pagemark"+RightPageNo+" " +PagemarkTagStyleR;
    // console.log(ArrPagemark[RightPageNo].S);
    if(!ArrPagemark[RightPageNo].S){
      // console.log(ICanPageNo, RightPageNo);
      if(ICanPageNo == RightPageNo){        
        if(GetICanStatus()){
          if(ArrPagemark[RightPageNo].A.length == 0){
            // if(PD.CTime >= PD.MaxTime){
              
            // } 
            $("#page"+(RightPageNo) + " > iframe").contents().find("#p"+(RightPageNo)).append(PagemarkTagR);
            ArrPagemark[RightPageNo].S = true;
          }
          else{
            var IsAllAudPlayed = true;
            for(var i=0; i<ArrPagemark[RightPageNo].A.length; i++){
              if(ArrPagemark[RightPageNo].A[i].S == false){
                IsAllAudPlayed = false;
              }
            }
            if(IsAllAudPlayed){
              $("#page"+(RightPageNo) + " > iframe").contents().find("#p"+(RightPageNo)).append(PagemarkTagR);
              ArrPagemark[RightPageNo].S = true;
            }
          }
        }
      }
      else{
        if(ArrPagemark[RightPageNo].A.length == 0 && RightPageNo != ExtraPage){
          if(PD.CTime >= PD.MaxTime){
            $("#page"+(RightPageNo) + " > iframe").contents().find("#p"+(RightPageNo)).append(PagemarkTagR);
            ArrPagemark[RightPageNo].S = true;
          } 
        }
        else{
          var IsAllAudPlayed = true;
          for(var i=0; i<ArrPagemark[RightPageNo].A.length; i++){
            if(ArrPagemark[RightPageNo].A[i].S == false){
              IsAllAudPlayed = false;
            }
          }
          if(IsAllAudPlayed && RightPageNo != ExtraPage){
            $("#page"+(RightPageNo) + " > iframe").contents().find("#p"+(RightPageNo)).append(PagemarkTagR);
            ArrPagemark[RightPageNo].S = true;
          }
        }
      }      
    }
  }

  var NewPageMarkTagL;   
  if(LeftPageNo % 2 == 0){
    PagemarkTagL = "<div id= Pagemark"+LeftPageNo+" " +PagemarkTagStyleL;
    NewPageMarkTagL = PagemarkTagL;
  }
  else{
    PagemarkTagR = "<div id= Pagemark"+LeftPageNo+" " +PagemarkTagStyleR;
    NewPageMarkTagL = PagemarkTagR;
  }  
  if(!ArrPagemark[LeftPageNo].S){
    if(ICanPageNo == LeftPageNo){      
      if(GetICanStatus()){
        if(ArrPagemark[LeftPageNo].A.length == 0){
          // if(PD.CTime >= PD.MaxTime){
            
          // } 
          $("#page"+(LeftPageNo) + " > iframe").contents().find("#p"+(LeftPageNo)).append(NewPageMarkTagL);
          ArrPagemark[LeftPageNo].S = true;
        }
        else{
          var IsAllAudPlayed = true;
          for(var i=0; i<ArrPagemark[LeftPageNo].A.length; i++){
            if(ArrPagemark[LeftPageNo].A[i].S == false){
              IsAllAudPlayed = false;
            }
          }
          if(IsAllAudPlayed){
            $("#page"+(LeftPageNo) + " > iframe").contents().find("#p"+(LeftPageNo)).append(NewPageMarkTagL);
            ArrPagemark[LeftPageNo].S = true;
          }
        }
      }     
    }
    else{
      if(ArrPagemark[LeftPageNo].A.length == 0){
        if(PD.CTime >= PD.MaxTime){
          $("#page"+(LeftPageNo) + " > iframe").contents().find("#p"+(LeftPageNo)).append(NewPageMarkTagL);
          ArrPagemark[LeftPageNo].S = true;
        } 
      }
      else{
        var IsAllAudPlayed = true;
        for(var i=0; i<ArrPagemark[LeftPageNo].A.length; i++){
          if(ArrPagemark[LeftPageNo].A[i].S == false){
            IsAllAudPlayed = false;
          }
        }
        if(IsAllAudPlayed){
          $("#page"+(LeftPageNo) + " > iframe").contents().find("#p"+(LeftPageNo)).append(NewPageMarkTagL);
          ArrPagemark[LeftPageNo].S = true;
        }
      }
    }    
  }


  if(AudConfig.BookLayout == "magazine"){
    if(ArrPagemark[LeftPageNo].S && ArrPagemark[RightPageNo].S){
      StopPageTimer();
    }
  }
  else{
    if(ArrPagemark[LeftPageNo].S){
      StopPageTimer();
    }
  }

  //SendSusData(); //send data to SCORM
}



function OnPageUpdateMarkPage(){
  // console.log(ArrPagemark);
  var LeftPageNo = AudConfig.CurrPageNo;
  var RightPageNo = AudConfig.CurrPageNo + 1; 
  var PagemarkTagStyleR = "class='ClsPagemark' style='z-index:2; position:absolute; width:"+ AudConfig.RightPageTickInfo.W +"px; height:"+ AudConfig.RightPageTickInfo.H +"px; bottom:"+ AudConfig.RightPageTickInfo.Bottom +"px; right:"+ AudConfig.RightPageTickInfo.Right +"px; background-image:url(icons/tickPage.png); background-repeat:no-repeat; background-size:cover;'></div>";
  var PagemarkTagR;  

  var PagemarkTagStyleL = "class='ClsPagemark' style='z-index:2; position:absolute; width:"+ AudConfig.LeftPageTickInfo.W +"px; height:"+ AudConfig.LeftPageTickInfo.H +"px; bottom:"+ AudConfig.LeftPageTickInfo.Bottom +"px; left:"+ AudConfig.LeftPageTickInfo.Left +"px; background-image:url(icons/tickPage.png); background-repeat:no-repeat; background-size:cover;'></div>";
  var PagemarkTagL;

  if(AudConfig.BookLayout == "magazine"){ 
    PagemarkTagR = "<div id= Pagemark"+RightPageNo+" " +PagemarkTagStyleR;
    if(ArrPagemark[RightPageNo].S){
      //if($("#page"+(RightPageNo) + " > iframe").contents().find("#p"+(RightPageNo)).find(".ClsPagemark") == false){
      if($("#page"+(RightPageNo) + " > iframe").contents().find("#p"+(RightPageNo)).find(".ClsPagemark").length == 0){
        $("#page"+(RightPageNo) + " > iframe").contents().find("#p"+(RightPageNo)).append(PagemarkTagR);
      }
      
    }
  }

  var NewPageMarkTagL;   
  if(LeftPageNo % 2 == 0){
    PagemarkTagL = "<div id= Pagemark"+LeftPageNo+" " +PagemarkTagStyleL;
    NewPageMarkTagL = PagemarkTagL;
  }
  else{
    PagemarkTagR = "<div id= Pagemark"+LeftPageNo+" " +PagemarkTagStyleR;
    NewPageMarkTagL = PagemarkTagR;
  }  
  if(ArrPagemark[LeftPageNo].S){
    //if($("#page"+(LeftPageNo) + " > iframe").contents().find("#p"+(LeftPageNo)).find(".ClsPagemark") == false){
    if($("#page"+(LeftPageNo) + " > iframe").contents().find("#p"+(LeftPageNo)).find(".ClsPagemark").length == 0){
      $("#page"+(LeftPageNo) + " > iframe").contents().find("#p"+(LeftPageNo)).append(NewPageMarkTagL);
    }
  }  
}


function CalcBookPercentage(){
  var MaxTick = ArrPagemark.length;
  var CurrTick = 0;
  for(var i=0; i<MaxTick; i++){    
    if(ArrPagemark[i].S == true){
      CurrTick++;
    }
  }  
  BookPercentage = Number(((CurrTick * 100)/MaxTick).toFixed(0));
  // console.log(BookPercentage) ;
}

function SendPageMarkDataToLMS(){
  //var NewObj = {"S":false, "A":[]};
  ArrPagemarkLMS = [];
  var LenArrPagemark =  ArrPagemark.length;
  for(var i=0; i<LenArrPagemark; i++){
    if(ArrPagemark[i].S){
      ArrPagemarkLMS.push(1);
    }  
    else{
      ArrPagemarkLMS.push(0);
    }  
  }
}

function CreateInitArrPMark(CIndex){
  var ArrInitLMSPMark = [];
  for(var i=0; i<ArrChapPageNo[CIndex]; i++){
    ArrInitLMSPMark.push(0);
  }
  return ArrInitLMSPMark;
}

function RecvPageMarkDataFromLMS(ArrPagemarkLMS){
  var LenArrPagemarkLMS =  ArrPagemarkLMS.length;
  ArrPagemark = [];
  for(var i=0; i<LenArrPagemarkLMS; i++){
    var NewObj = {"S":false, "A":[]};
    if(ArrPagemarkLMS[i] == 1){
      NewObj.S = true;           
    }
    ArrPagemark.push(NewObj);
  }
}
