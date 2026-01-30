var scorm = pipwerks.SCORM;
var callSucceeded;
var allSucceeded, initTime, ExitTime;

function initScorm() {
	//Specify SCORM 2004:
	scorm.version = "1.2";
	show("Initializing course.");
	callSucceeded = scorm.init();
	show("Call succeeded? " + callSucceeded);
	setInComplete();

	scorm.set("cmi.core.total_time", "0000:00:00")
	initTime = new Date();

	setTimeout(function(){
		var susData = get('cmi.suspend_data'); RecSusData(susData);		
		var LessLocData = get('cmi.core.lesson_location'); RecLessonLoc(LessLocData);
		var BookPercData = 	get('cmi.core.score.max'); RecBookPerc(BookPercData);					
		var HighData = get('cmi.comments'); FilterHighArrrFromLMS(HighData) ;
		//RecComments(HighData);
	},150);	
}

function loadBookmark() {
	show("callSucceeded::: " + callSucceeded);
	if(callSucceeded) {
		var susData = get('cmi.suspend_data');
		var HighData = get('cmi.comments');
		var lessonLoc = get('cmi.core.lesson_location');
		var scoreMax = get('cmi.core.score.max');		
		show("susData::: " + susData);		
		show("lessonLoc::: " + lessonLoc);		
		show("scoreMax::: " + scoreMax);
		show("commentsHigh::: " + HighData);

		if(susData != '') {				
			return susData;
		}
	}
	return null;
}

function setSuspend(str) {
	show("@ setSuspend::: " + str);
	scorm.set('cmi.suspend_data', str);
	//var callSucceeded = scorm.set('cmi.suspend_data', str);
	//show("Call succeeded? " + callSucceeded);
}

function setComments(str){
	show("@ setComments::: " + str);	
	//scorm.set('cmi.comments', "*****");
	scorm.set('cmi.comments', str);	
}

function setLessonLocation(str){
	show("@ setLessonLocation::: " + str);
	scorm.set('cmi.core.lesson_location', str);
}


function setScoreMax(str){
	show("@ setScoreMax::: " + str);
	scorm.set('cmi.core.score.max', "");
	scorm.set('cmi.core.score.max', str);
}


function set(param, value) {
	show("Sending: '" + value + "'");
	var callSucceeded = scorm.set(param, value);
	show("Call succeeded? " + callSucceeded);
}

function get(param) {
	var value = scorm.get(param);
	show("Received: '" + value +"'");
	return value;
}

function setScore(value) {
	show(value+" score");
	set('cmi.core.score.raw', value);
	set('cmi.core.score.scaled', (value / 100));
	//set('cmi.score.raw', value);
	//set('cmi.score.scaled', (value / 100));
}

function setInComplete() {
	var sComp = get("cmi.core.lesson_status");
	show("cmi.core.lesson_status : " + sComp);
	if(sComp != 'completed' && sComp != 'passed' && sComp != 'failed') {
		var callSucceeded = scorm.set("cmi.core.lesson_status", "browsed");
		show("Call succeeded? " +callSucceeded);
		sComp = get("cmi.completion_status");
		if(sComp != 'completed') {
			var callSucceeded = scorm.set("cmi.completion_status", "incomplete");
			show("Call succeeded? " + callSucceeded);
		}
		
		sComp = get("cmi.success_status");
		if(sComp != 'passed' && sComp != 'failed') {
			var callSucceeded = scorm.set("cmi.success_status", "unknown");
			show("Call succeeded? " + allSucceeded);
		}	
	}
}

function complete() {
	show("Setting course status to 'completed'.");
	var callSucceeded = scorm.set("cmi.completion_status", "completed");
	show("Call succeeded? " + callSucceeded);
}

function MillisecondsToCMIDuration() {
	ExitTime = new Date();
	// initTime = 1636723646621;
	var difference = ExitTime.getTime() - initTime.getTime();
	
	//Convert duration from milliseconds to 0000:00:00.00 format
	var daysDifference = Math.floor(difference/1000/60/60/24);
    difference -= daysDifference*1000*60*60*24

    var hoursDifference = Math.floor(difference/1000/60/60);
    difference -= hoursDifference*1000*60*60

    var minutesDifference = Math.floor(difference/1000/60);
    difference -= minutesDifference*1000*60

    var secondsDifference = Math.floor(difference/1000);
	
	SessionTime = hoursDifference + ':' + minutesDifference + ':' + secondsDifference;
	return SessionTime;
}

function endScorm() {
	scorm.set("cmi.core.session_time", MillisecondsToCMIDuration()); 
	scorm.set("cmi.core.total_time", "00:00:00"); 
	SendSusData();
	//alert(SendArrHighltLMS);
	setComments(SendArrHighltLMS);

	show("Terminating connection.");
	var callSucceeded = scorm.quit();
	show("Call succeeded? " + callSucceeded);
	//alert("EndScorm");
	
}

function show(msg) {
	//Can also show data using pipwerks.UTILS.trace
	//pipwerks.UTILS.trace
	//console.log(msg);
}

window.onunload = window.onbeforeunload = function (e){		
	endScorm();	
}