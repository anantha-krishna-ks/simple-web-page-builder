var ArrSuspendData = [];
var ArrLessLoc=[];

var LastPageNo, LastView;

var IsBookFirstTime = false;

var IsBookStarted = false;

var RcvdArrSuspendData = null;
var RcvdArrSuspendDataL1 = null;
var SendArrNoteBookmarkLMS = []; //combines all chapter note bookmark array.

var RecArrHighData = null;
var RecArrHighDataL1 = null;
var SendArrHighltLMS = []; //combines all chapter highlight array.

var RecArrLessonLoc = null;
var RecArrLessonLoc1 = null;
var SendArrLessLocLMS = []; // combines-Bookmark, PageMark, Last Page, Last View, IsBookFirstTime

var RecdArrBookPerc = null;
var RecdArrBookPercL1 = null;
var SendArrBookPercLMS = []; // combines all book percentage.
var RcvdFinalBookPerc = 0;
var FinalBookPerc = 0;

var JoinedHighData = "";

//console.log(config.PLAYBACKSPEED);


/*
Bookmark,
highlight,
Note,
ICan,
TickMark,
Current Page No,
View

SendSusData(); //send data to SCORM

*/




function SendSusData(){
  try{
    if(!IsBookStarted){ return;}  
    // LastPageNo = AudConfig.CurrPageNo;
    // LastView = AudConfig.BookLayout;
    CalcBookPercentage();
    SendBMarkDataToLMS();
    SendPageMarkDataToLMS();
    SendNoteDataToLMS();
    SendICanDataToLMS();
    CopyArrHLTToArrLMSHLT();

    /*-- note, iCan data : ends --*/
    SendArrNoteBookmarkLMS = null;    
    SendArrNoteBookmarkLMS = RcvdArrSuspendDataL1;

    ArrSuspendData = [];                      
    ArrSuspendData.push(JSON.stringify(ArrNoteBookmarkLMS)); // Note  
    ArrSuspendData.push(JSON.stringify(ArrICanLMS)); // ICan
    var JoinedArr = EncodeTrueFalse(ArrSuspendData.join("|"));

    SendArrNoteBookmarkLMS[ChapterIndex] = JoinedArr;
    RcvdArrSuspendDataL1[ChapterIndex] = JoinedArr;

    
    //console.log(JoinedArr);  
    var SuspendData = SendArrNoteBookmarkLMS.join("||");    
    setSuspend(SuspendData); // sending suspended data
    /*-- note, iCan data : ends --*/

    /*-- highlight data : starts --*/
    //console.log(ArrHighltLMS, RecArrHighDataL1);
    SendArrHighltLMS = [];
    SendArrHighltLMS = JSON.stringify(ArrHighltLMS);
    
    //JoinedHighData = "";

    // var TempArr1 = ArrHighltLMS;
    // var TempArr2 = [];

    // for(var i=0; i<TempArr1.length; i++){
    //   if(TempArr1[i] != "|"){
    //     TempArr2.push(TempArr1[i]);
    //   }
    // }

    //console.log(TempArr2);

    // var DecRecArrHighDataTemp1 = DecodeQuotes(DecodeTrueFalse(ArrHighltLMS));     
    // var NewHighlightArrTemp1 = FilterOutObj(DecRecArrHighDataTemp1);

    // console.log(NewHighlightArrTemp1);

    //RecArrHighDataL1[ChapterIndex] = TempArr2;

    // for(var i=0; i<RecArrHighDataL1.length; i++){
    //   SendArrHighltLMS.push(EncodeTrueFalse(JSON.stringify(RecArrHighDataL1[i])));
    // }    
    //JoinedHighData = SendArrHighltLMS.join("##");    
    
    //console.log(JoinedHighData, RecArrHighDataL1); 

    /*-- highlight data : ends --*/  

    // console.log(
    //   ArrHighltLMS, 
    //   //ArrNoteBookmarkLMS,
    //   //ArrICanLMS, 
    //   ArrPagemarkLMS, 
    //   AudConfig.CurrPageNo, 
    //   AudConfig.BookLayout, 
    //   IsBookFirstTime
    // );      
    
    /*-- LESSON LOCATION : Bookmark, PageMark, Last Page, Last View, IsBookFirstTime, BookPercentage (cmi.core.lesson_location) : starts --*/
    SendArrLessLocLMS = null;
    SendArrLessLocLMS = RecArrLessonLoc1;

    ArrLessLoc=[];
    ArrLessLoc.push(JSON.stringify(ArrBookmarkLMS)); //Bookmark [0]
    ArrLessLoc.push(JSON.stringify(ArrPagemarkLMS)); //PageMark [1]
    ArrLessLoc.push(JSON.stringify(AudConfig.CurrPageNo)); //Last Page [2]
    ArrLessLoc.push(JSON.stringify(AudConfig.BookLayout)); //BookLayout [3]
    ArrLessLoc.push(JSON.stringify(IsBookFirstTime)); // Check if book open first time [4] 
    ArrLessLoc.push(JSON.stringify(BookPercentage)); // Book percentage [5]
    ArrLessLoc.push(JSON.stringify(config.PLAYBACKSPEED)); // Audio Speed [6]
    //console.log(ArrLessLoc);
    var JoinedArrLessLoc = EncodeTrueFalse(ArrLessLoc.join("|"));

    SendArrLessLocLMS[ChapterIndex] = JoinedArrLessLoc;
    RecArrLessonLoc1[ChapterIndex] = JoinedArrLessLoc;  

    UpdateHomeTilePerc(SendArrLessLocLMS);

    /*-- SCORE Counter : Final BookPercentage : (cmi.core.score.max) : starts --*/
    let SumPerc = 0;
    for(var i=0; i<SendArrLessLocLMS.length; i++){
      let TempArr = SendArrLessLocLMS[i].split("|");
      SumPerc = Number(SumPerc) + Number(TempArr[5]);
      
    }
    FinalBookPerc = Number(((SumPerc * 100)/(ArrChapPageNo.length * 100)).toFixed(0));
    if(FinalBookPerc == 99){FinalBookPerc = 100;}
    setScoreMax(JSON.stringify(FinalBookPerc)); // sending Book percentage
    //console.log(FinalBookPerc);    
    //console.log(SendArrLessLocLMS);    
    /*-- SCORE Counter : Final BookPercentage : (cmi.core.score.max) : ends --*/ 
    
    var LessonLocStr = SendArrLessLocLMS.join("||");
    setLessonLocation(LessonLocStr); // sending lesson location data
    /*-- LESSON LOCATION : Bookmark, PageMark, Last Page, Last View, IsBookFirstTime, BookPercentage (cmi.core.lesson_location) : ends --*/
           
  }  
  catch (error) {} 
}

function RecSusData(CmbdRcvdArrSuspendData){

  //sent:
  //[[],[],[],[["t5_3","7957",3,[["S","Alphabetica"],["T","l"]]],["t8_3","8942",0,[["S","letters"]]],["tb_3","3613",1,[["S","alph"],["T","abet"]]],["td_3","5797",2,[["T","arran"],["S","ged"]]],["tg_3","2756",3,[["T","ce"],["S","rta"],["T","in"]]]],[],[]]
  //Receive:
  //CmbdRcvdArrSuspendData = '[[],[],[],[["t5_3","7957",3,[["S","Alphabetica"],["T","l"]]],["t8_3","8942",0,[["S","letters"]]],["tb_3","3613",1,[["S","alph"],["T","abet"]]],["td_3","5797",2,[["T","arran"],["S","ged"]]],["tg_3","2756",3,[["T","ce"],["S","rta"],["T","in"]]]],[],[]]'
  //console.log(CmbdRcvdArrSuspendData);
  try{
    //console.log(RcvdArrSuspendData);
    if(CmbdRcvdArrSuspendData != "null" && CmbdRcvdArrSuspendData != null && CmbdRcvdArrSuspendData != undefined && CmbdRcvdArrSuspendData != "undefined" && CmbdRcvdArrSuspendData != ""){      
      RcvdArrSuspendData = null;
      RcvdArrSuspendDataL1 = null;
      RcvdArrSuspendData = CmbdRcvdArrSuspendData;
      var DecRcvdArrSuspendData = DecodeQuotes(DecodeTrueFalse(RcvdArrSuspendData));
      RcvdArrSuspendDataL1 = DecRcvdArrSuspendData.split("||");                           
    } 
    else{      
      RcvdArrSuspendDataL1 = [];
      for(var i=0; i<ArrChapPageNo.length; i++){        
        ArrSuspendData = [];        
        ArrSuspendData.push(JSON.stringify(CreateInitArrNote(i))); // Note  
        ArrSuspendData.push(JSON.stringify(CreateInitArrICan())); // ICan        
        var JoinedArr1 = EncodeTrueFalse(ArrSuspendData.join("|"));        
        RcvdArrSuspendDataL1.push(JoinedArr1);        
      }
    } 
    //console.log(RcvdArrSuspendDataL1);
  }

  catch (error) {} 
}

function OnChapterSelRecSusData(){  
  //console.log(RcvdArrSuspendDataL1);
  try{
    if(RcvdArrSuspendDataL1 != null){
      let RcvdDataArr = DecodeTrueFalse(RcvdArrSuspendDataL1[ChapterIndex]).split("|");        
      var NewNoteArr = JSON.parse(RcvdDataArr[0]); 
      var NewICanArr = JSON.parse(RcvdDataArr[1]);       
      //if(NewNoteArr != ""){ArrNoteBookmark = []; ArrNoteBookmark = NewNoteArr;}
      if(NewNoteArr != ""){ArrNoteBookmarkLMS = null; ArrNoteBookmarkLMS = NewNoteArr; RecvNoteDataFromLMS(ArrNoteBookmarkLMS);}
      if(NewICanArr != ""){ArrICanLMS = null; ArrICanLMS = NewICanArr; RecvICanDataToLMS(ArrICanLMS);}
    }    

    //console.log(NewNoteArr);
    //console.log(NewICanArr);
  }
  catch (error) {}
}

/*-- highlight data : starts --*/
function RecComments(CmbdRecArrHighData){  
  //[[],[],[],[["t8_3","2911",0,[["S","letters"]]],["tb_3","1230",1,[["S","alph"],["T","abet"]]],["td_3","6566",2,[["T","arra"],["S","nged"]]],["tg_3","5846",3,[["T","cer"],["S","ta"],["T","in"]]]],[],[]]  
  // CmbdRecArrHighData = `[
  //   [["list1","0634",2,[["S","Prep"],["T"," Time!"]]]],
  //   [],[],
  //   [
  //     ["t5_3","7957",3,[["S","Alphabetica"],["T","l"]]],["t8_3","8942",0,[["S","letters"]]],["tb_3","3613",1,[["S","alph"],["T","abet"]]],["td_3","5797",2,[["T","arran"],["S","ged"]]],["tg_3","2756",3,[["T","ce"],["S","rta"],["T","in"]]]],[],[]]`;
  //CmbdRecArrHighData = `[[],[],[],[["t5_3","9469",0,[["S","Alphabetical"]]],["tb_3","8993",1,[["S","alpha"],["T","bet"]]],["td_3","0521",2,[["T","arrang"],["S","ed"]]],["tz_3","7369",3,[["T","alph"],["S","abet"],["T","ical"]]]],[],[]][[],[],[],[["t5_3","9469",0,[["S","Alphabetical"]]],["tb_3","8993",1,[["S","alpha"],["T","bet"]]],["td_3","0521",2,[["T","arrang"],["S","ed"]]],["tz_3","7369",3,[["T","alph"],["S","abet"],["T","ical"]]]],[],[]][[],[],[],[["t5_3","9469",0,[["S","Alphabetical"]]],["tb_3","8993",1,[["S","alpha"],["T","bet"]]],["td_3","0521",2,[["T","arrang"],["S","ed"]]],["tz_3","7369",3,[["T","alph"],["S","abet"],["T","ical"]]]],[],[]][[],[],[],[],[],[]]`

  //console.log(CmbdRecArrHighData);
  // console.log(CmbdRecArrHighData.includes("]["));
  RecArrHighData = []; 
  RecArrHighDataL1 = [];  
  //CmbdRecArrHighData = null;    
  if(CmbdRecArrHighData != "null" && CmbdRecArrHighData != null && CmbdRecArrHighData != undefined && CmbdRecArrHighData != "undefined" && CmbdRecArrHighData != ""){
    //console.log("Here If");
    //RecArrHighData = CmbdRecArrHighData.split("##");
    RecArrHighData = CmbdRecArrHighData.split("##");
    //console.log(RecArrHighData);
    var DecRecArrHighData = JSON.parse(DecodeQuotes(DecodeTrueFalse(RecArrHighData[0])));     
    //console.log(DecRecArrHighData);
    RecArrHighDataL1.push(DecRecArrHighData);


    // for(var i=0; i<RecArrHighData.length; i++){
    //   var DecRecArrHighData = JSON.parse(DecodeQuotes(DecodeTrueFalse(RecArrHighData[0])));     
    //   console.log(DecRecArrHighData);
    //   //var NewHighlightArr = FilterOutObj(DecRecArrHighData);
    //   //console.log(NewHighlightArr);      
    //   RecArrHighDataL1.push(DecRecArrHighData);
    // }  
    
    //console.log(RecArrHighDataL1);
  } 
  else{      
    //console.log("Here Else");
    for(var i=0; i<ArrChapPageNo.length; i++){        
      RecArrHighData.push(EncodeTrueFalse(JSON.stringify(CreateInitArrHigh(i)))); // blank array                  
    }

    for(var i=0; i<RecArrHighData.length; i++){
      var DecRecArrHighData = DecodeQuotes(DecodeTrueFalse(RecArrHighData[i]));     
      var NewHighlightArr = FilterOutObj(DecRecArrHighData);
      RecArrHighDataL1.push(NewHighlightArr);
    }      
  }  

  //console.log(RecArrHighDataL1);
}

function OnChapterSelRecComments(){
  try{    
    if(RecArrHighDataL1 != "null" && RecArrHighDataL1 != null && RecArrHighDataL1 != undefined && RecArrHighDataL1 != "undefined" && RecArrHighDataL1 != ""){
      //ArrHighlt = []; ArrHighlt = RecArrHighDataL1[ChapterIndex];   
      ArrHighltLMS = []; ArrHighltLMS = RecArrHighDataL1[ChapterIndex]; RecvHighDataFromLMS(ArrHighltLMS);   
    }    
  }
  catch (error) {}
}

function FilterHighArrrFromLMS(RcvdArrFromLMS){
  //console.log(RcvdArrFromLMS);
  //alert(RcvdArrFromLMS);
  //var RcvdArrFromLMS = '[[],[],[["t8_2","8644",3,[["S","Her"]]],["t9_2","8644",3,[["S","friends"]]],["ta_2","8644",3,[["S","have"]]],["tb_2","8644",3,[["S","come"]]],["tc_2","8644",3,[["S","to"]]],["td_2","8644",3,[["S","celebrate"]]],["te_2","8644",3,[["S","with"]]],["tf_2","8644",3,[["S","her"],["T","."]]]],[],[],[],[],[],[],[],[],[],[],[],[],[]]##[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]##[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]][[],[],[["t8_2","8644",3,[["S","Her"]]],["t9_2","8644",3,[["S","friends"]]],["ta_2","8644",3,[["S","have"]]],["tb_2","8644",3,[["S","come"]]],["tc_2","8644",3,[["S","to"]]],["td_2","8644",3,[["S","celebrate"]]],["te_2","8644",3,[["S","with"]]],["tf_2","8644",3,[["S","her"],["T","."]]]],[],[],[],[],[],[],[],[],[],[],[],[],[]]##[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]##[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]';
  //var RcvdArrFromLMS = '[[],[],[],[["t5_3","9469",0,[["S","Alphabetical"]]],["tb_3","8993",1,[["S","alpha"],["T","bet"]]],["td_3","0521",2,[["T","arrang"],["S","ed"]]],["tz_3","7369",3,[["T","alph"],["S","abet"],["T","ical"]]]],[],[]][[],[],[],[["t5_3","9469",0,[["S","Alphabetical"]]],["tb_3","8993",1,[["S","alpha"],["T","bet"]]],["td_3","0521",2,[["T","arrang"],["S","ed"]]],["tz_3","7369",3,[["T","alph"],["S","abet"],["T","ical"]]]],[],[]][[],[],[],[["t5_3","9469",0,[["S","Alphabetical"]]],["tb_3","8993",1,[["S","alpha"],["T","bet"]]],["td_3","0521",2,[["T","arrang"],["S","ed"]]],["tz_3","7369",3,[["T","alph"],["S","abet"],["T","ical"]]]],[],[]][[],[],[],[],[],[]]';
  if(RcvdArrFromLMS != "null" && RcvdArrFromLMS != null && RcvdArrFromLMS != undefined && RcvdArrFromLMS != "undefined" && RcvdArrFromLMS != ""){
    var Temp1 = RcvdArrFromLMS.replaceAll('][', ']@[');
    //console.log(Temp1);
    var Temp2 = Temp1.split("@");
    //console.log(Temp2);
    var Temp3 = Temp2[Temp2.length - 1];
    //var Temp3 = Temp2[0];
    // var Temp3 = Temp2.sort(
    //   function (a, b) {
    //       return b.length - a.length;
    //   }
    // )[0];
    //console.log(Temp3);
    RecComments(Temp3);
  }
  else{
    RecComments("");
  }
  
}

/*-- highlight data : ends --*/

function RecLessonLoc(CmbdRecArrLessonLoc){  
  //console.log(CmbdRecArrLessonLoc);
  try{
    if(CmbdRecArrLessonLoc != "null" && CmbdRecArrLessonLoc != null && CmbdRecArrLessonLoc != undefined && CmbdRecArrLessonLoc != "undefined" && CmbdRecArrLessonLoc != ""){    
      RecArrLessonLoc = null;
      RecArrLessonLoc1 = null;
      RecArrLessonLoc = CmbdRecArrLessonLoc;
      var DecRecArrLessonLoc = DecodeQuotes(DecodeTrueFalse(RecArrLessonLoc));
      RecArrLessonLoc1 = DecRecArrLessonLoc.split("||"); 
      //console.log("RecLessonLoc : If Part:  ", LastPageNo);
    }
    else{      
      RecArrLessonLoc1 = [];
      for(var i=0; i<ArrChapPageNo.length; i++){
        ArrLessLoc=[];
        ArrLessLoc.push(JSON.stringify(CreateInitArrBMark(i))); //Bookmark [0]   
        ArrLessLoc.push(JSON.stringify(CreateInitArrPMark(i))); //PageMark [1]
        ArrLessLoc.push(JSON.stringify(0)); //Last Page [2]
        ArrLessLoc.push(JSON.stringify("magazine")); //BookLayout [3]
        ArrLessLoc.push(JSON.stringify(true)); // Check if book open first time [4]
        ArrLessLoc.push(JSON.stringify(0)); // Book percentage [5]
        ArrLessLoc.push(JSON.stringify(1)); // Audio Speed [6]        
        var JoinedArrLessLoc = EncodeTrueFalse(ArrLessLoc.join("|"));            
        RecArrLessonLoc1.push(JoinedArrLessLoc);
      }
    }
    UpdateHomeTilePerc(RecArrLessonLoc1); 
  }
  catch (error) {} 
}

function OnChapterSelRecLessonLoc(){
  try{
    if(RecArrLessonLoc1 != null && RecArrLessonLoc1 != null && RecArrLessonLoc1 != undefined && RecArrLessonLoc1 != "undefined" && RecArrLessonLoc1 != ""){
      //let RcvdDataArr = DecodeTrueFalse(RecArrLessonLoc1[ChapterIndex]).split("|"); 
      let RcvdDataArr = DecodeQuotes(DecodeTrueFalse(RecArrLessonLoc1[ChapterIndex])).split("|");
      var NewBookmarkArr = JSON.parse(RcvdDataArr[0]);
      var NewTickMarkArr = JSON.parse(RcvdDataArr[1]);
      var NewPageNo = Number(JSON.parse(RcvdDataArr[2]));
      var NewView = JSON.parse(RcvdDataArr[3]);
      var NewIsBookFirstTime = JSON.parse(RcvdDataArr[4]);
      if(NewBookmarkArr != ""){ArrBookmarkLMS = []; ArrBookmarkLMS = NewBookmarkArr; RecvBMarkDataFromLMS(ArrBookmarkLMS);}
      if(NewTickMarkArr != ""){ArrPagemarkLMS = []; ArrPagemarkLMS = NewTickMarkArr; RecvPageMarkDataFromLMS(ArrPagemarkLMS);}
      //console.log(NewPageNo);
      if(NewPageNo != ""){LastPageNo = NewPageNo;}
      if(NewView != ""){LastView = NewView;}
      else{LastView = AudConfig.BookLayout;}
      IsBookFirstTime = NewIsBookFirstTime;
      BookPercentage = Number(JSON.parse(RcvdDataArr[5]));
      config.PLAYBACKSPEED = Number(JSON.parse(RcvdDataArr[6]));
    } 
    else{
      IsBookFirstTime = true;
      LastView = "magazine";
      LastPageNo = 0;
      BookPercentage = 0;
      config.PLAYBACKSPEED = 1;
    }   

    //console.log(RcvdDataArr);
    //console.log(ArrBookmarkLMS, ArrPagemarkLMS, NewPageNo, NewView, LastView);
  }
  catch (error) {}
}



function RecBookPerc(CmbdRecdBookPerc){  
  //console.log(CmbdRecdBookPerc);
  if(CmbdRecdBookPerc != "null" && CmbdRecdBookPerc != null && CmbdRecdBookPerc != undefined && CmbdRecdBookPerc != "undefined" && CmbdRecdBookPerc != ""){
    FinalBookPerc = Number(JSON.parse(CmbdRecdBookPerc));           
  } 
  else{
    FinalBookPerc = 0;
  } 
}

// function OnChapterSelRecBookPerc(){
//   try{
//     if(RecdArrBookPercL1 != null){
//       BookPercentage = Number(JSON.parse(RecdArrBookPercL1[ChapterIndex]));
//     }    
//   }
//   catch (error) {}
// }

function UpdateHomeTilePerc(CmbdArrPerc){  
  for(var i=0; i<CmbdArrPerc.length; i++){
    let TempArr = CmbdArrPerc[i].split("|");
    if(Number(TempArr[5]) == 100){
      var NewTitle = document.getElementById("Li"+i);
      NewTitle.classList.add("ClsComplete");
    }
  }
}

function OnScormYes(){  
  //console.log("LastView: ",LastView, " and LastPageNo: ", LastPageNo);
  if(LastView != undefined && LastView != AudConfig.BookLayout){
    toggleView();
  }
  if(LastPageNo != undefined && LastPageNo != AudConfig.CurrPageNo){
    gotoPrintPageNo(Number(AudConfig.BookStartPrintPageNo) + LastPageNo);
  }

  $("#SPopupMMainCont").removeClass("ClsOpen");
  //openHelp();
  $("#vCenter").addClass("Clsloading");
  IsBookFirstTime = false;
}

function OnScormNo(){
  $("#SPopupMMainCont").removeClass("ClsOpen");
  //openHelp();
  $("#vCenter").addClass("Clsloading");
  IsBookFirstTime = false;
}

/*-- code / decode json keywords --*/
function EncodeTrueFalse(ArrStr){  
  var a = ArrStr.replace(/true/g, '$1').replace(/false/g, '$0').replace(/null/g, '$2');  
  return a;  
}

function DecodeTrueFalse(ArrStr){  
  var a = ArrStr.replace(/\$1/g, 'true').replace(/\$0/g, 'false').replace(/\$2/g, 'null');  
  return a;  
}

function DecodeQuotes(NewStr){  
  // (
  //     unescape(
  //         NewStr.replace(/\u([\d\w]{4})/gi, function (match, grp) {
  //             return String.fromCharCode(parseInt(grp, 16));
  //         }))
  // ).replace(/\\/g, "");
  return NewStr.replace(/u0026quot;/g, '"').replace(/u0027;/g, "'");
}

function FilterOutObj (str) {
  //console.log(str);
  var oldArray = str.replace(/,"\|",/g,'|').replace(/"\|",/g,'|').replace(/,"\|"]/g,'');
  //console.log(oldArray);
  oldArray = oldArray.split('|');
  var newArray = [];

   //console.log(oldArray);
  for (var index = 0  ; index <= oldArray.length-1; index++) {
    var item = oldArray[index];
    var itemSub = item.replace(/\]],\[/g, "]]@[");
    //console.log(itemSub);
    if (itemSub !== '[]'){
      itemSub = itemSub.substring(1);
    }
    itemSub =  itemSub.split("@");  

    //console.log(itemSub, itemSub.length);
    if (itemSub.length > 1) {
      for (var subindex = 0; subindex < itemSub.length; subindex++) {
        var element = itemSub[subindex];
        if(subindex === (itemSub.length - 1)) {
          element = element.replace(']]]', ']]');
        };
        // checking parse error
        try {
          if (JSON.parse(element)) {
            itemSub[subindex] = JSON.parse(element);
          };              
        } catch (error) {
          itemSub.splice(subindex, 1);
          continue
        }
      }
    } else {
      if (itemSub[0] === '[]') {
        itemSub = JSON.parse(itemSub.toString());
      }
    }
    //console.log(typeof itemSub[0] == "string");
    if(typeof itemSub[0] != "string"){
      newArray.push(itemSub);
    }
  }

  //console.log(newArray);

  var LeftItemCount = ArrChapPageNo[ChapterIndex] - newArray.length;  
  for(var i=0; i<LeftItemCount; i++){
    newArray.push([]);
  }
  //console.log(newArray);

  return newArray;

}