var ICan = {
  "ScoreCount": 0,
  "ArrOpt":null,
}

var ArrICanLMS = [];

function GetOptionArr(){
  return ICan.ArrOpt;
}

function GetICanAnsArr(){
  return ICanArrAns;
}

function UpdateOptionArr(PageArrOpt){  
  ICan.ArrOpt = [];
  ICan.ArrOpt = JSON.parse(JSON.stringify(PageArrOpt));  
  MarkPage();
  //console.log(ICan.ArrOpt);
  SendSusData(); //send data to SCORM
}

function GetICanStatus(){     
  try {
  return($("#page"+ ICanPageNo + " > iframe").prop('contentWindow').GetICanStatus());
  }
  catch (err) {} 
}


function SendICanDataToLMS(){
  ArrICanLMS = [];
  if(ICan.ArrOpt == null){
    ArrICanLMS = null;
  }
  else{
    var LenICanArr =  ICan.ArrOpt.length;
    for(var i=0; i<LenICanArr; i++){
      var TempArr = [];
      if(ICan.ArrOpt[i].LOpt == 'true'){TempArr.push(1);}
      else{TempArr.push(0);} 

      if(ICan.ArrOpt[i].ROpt == 'true'){TempArr.push(1);}
      else{TempArr.push(0);}

      ArrICanLMS.push(TempArr);
    }
  }  
}

function CreateInitArrICan(){ 
  return null;
}

function RecvICanDataToLMS(ArrICanLMS){
  ICan.ArrOpt = [];
  if(ArrICanLMS == null){
    ICan.ArrOpt = null;
  }
  else{
    var LenArrICanLMS =  ArrICanLMS.length;
    ICan.ArrOpt = [];
    for(var i=0; i<LenArrICanLMS; i++){
      var NewObj = {"LOpt":'false',"ROpt":'false'};
      if(ArrICanLMS[i][0] == 1){
        NewObj.LOpt = 'true';
      }
      if(ArrICanLMS[i][1] == 1){
        NewObj.ROpt = 'true';
      }
      ICan.ArrOpt.push(NewObj);
    }
  }  

  //console.log(ICan.ArrOpt);
}

function GoToHomePageFromICan(){
  var startScreen = document.getElementById("startScreen");
  startScreen.classList.remove("fadeOut");
  gotoPrintPageNo(AudConfig.BookStartPrintPageNo);
  SendSusData();
  UpdateHomeTilePerc(SendArrBookPercLMS);
  //document.getElementById("viewer").innerHTML = "";
}