// const { json } = require("stream/consumers");
ICanChapter = {
	"ArrAns": [],
	"ScoreFact": 1,
	"IsActComplete": false,
	"TotalSet": 0,
	"ArrOpt": [],
	"ScoreCount": 0,
}

function InitICan() {

	ICanChapter = {
		"ArrAns": [],
		"ScoreFact": 1,
		"IsActComplete": false,
		"TotalSet": 0,
		"ArrOpt": [],
		"ScoreCount": 0,
	};
	

	ICanChapter.ArrAns = parent.GetICanAnsArr(); //get answer array from reader
	ICanChapter.TotalSet = ICanChapter.ArrAns.length;
	if (parent.ICan.ArrOpt == null) {
		//console.log("Not found ArrOpt");
		for (var i = 0; i < ICanChapter.TotalSet; i++) {
			var Obj = { "LOpt": "false", "ROpt": "false" };
			ICanChapter.ArrOpt.push(Obj);
		}
	}
	else {
		//console.log("Found ArrOpt");
		ICanChapter.ArrOpt = JSON.parse(JSON.stringify(parent.GetOptionArr())); //get updated option array from reader			
	}

	SetICanOptionStatus();

	// document.getElementById("DvICanHome").onclick = function(){
	// 	parent.GoToHomePageFromICan();
	// }
}


setTimeout(function(){
	delete(ICanChapter);
},100);
setTimeout(function(){
	InitICan();
},500);

function SetICanOptionStatus() {
	// create ICanActivityDiv
	const ICanActivityDiv = document.createElement("div");
	ICanActivityDiv.setAttribute("id", "ICanActivity");
	document.body.appendChild(ICanActivityDiv);

	for (var i = 0; i < parent.ICanArrAns.length; i++) {
		const myDIv = document.createElement("div");
		const myDIv_1 = document.createElement("div");
		document.getElementById("ICanActivity").appendChild(myDIv);
		document.getElementById("ICanActivity").appendChild(myDIv_1);

		myDIv.setAttribute("id", "Cell" + i + "_" + i);
		myDIv_1.setAttribute("id", "Cell" + i + "_" + (i + 1));

		myDIv.setAttribute("class", "Cell" + i);
		myDIv_1.setAttribute("class", "Cell" + i);

		myDIv.setAttribute("data-value", ICanChapter.ArrOpt[i].LOpt);
		myDIv_1.setAttribute("data-value", ICanChapter.ArrOpt[i].ROpt);

		myDIv.setAttribute("data-group", i);
		myDIv_1.setAttribute("data-group", i);

		myDIv.setAttribute("onclick", "OnOptionClick(event)");
		myDIv_1.setAttribute("onclick", "OnOptionClick(event)");

	}

	for (var i = 0; i < parent.ICanArrAns.length; i++) {
		if(document.getElementById("Cell" + i + "_" + i).getAttribute("data-value") == "true"){
			document.getElementById("Cell" + i + "_" + i).classList.add("addCheck");
		}
		if(document.getElementById("Cell" + i + "_" + (i + 1)).getAttribute("data-value") == "true"){
			document.getElementById("Cell" + i + "_" + (i + 1)).classList.add("addCheck");
		}
	}

}

function OnOptionClick(e) {
	//console.log(e.target.id);
	var myVal = Number(document.getElementById(e.target.id).getAttribute("data-group"));
	document.getElementById("Cell" + myVal + "_" + myVal).classList.remove("addCheck");
	document.getElementById("Cell" + myVal + "_" + (myVal + 1)).classList.remove("addCheck");

	document.getElementById("Cell" + myVal + "_" + myVal).setAttribute("data-value", false);
	document.getElementById("Cell" + myVal + "_" + (myVal + 1)).setAttribute("data-value", false);


	e.target.classList.add("addCheck");
	e.target.setAttribute("data-value", true);

	ICanChapter.ArrOpt[myVal].LOpt = document.getElementById("Cell" + myVal + "_" + myVal).getAttribute("data-value");
	ICanChapter.ArrOpt[myVal].ROpt = document.getElementById("Cell" + myVal + "_" + (myVal + 1)).getAttribute("data-value");
	
	parent.UpdateOptionArr(ICanChapter.ArrOpt);

	ICanChapter.IsActComplete = GetICanStatus();

	//console.log("IsActComplete::"+ICanChapter.IsActComplete);

	//console.log(ICanChapter.ArrOpt);
}

function GetICanStatus() {
	//implement conditions here
	ICanChapter.IsActComplete = true;
	for(var i=0; i<ICanChapter.ArrOpt.length; i++){
		if(ICanChapter.ArrOpt[i].LOpt == ICanChapter.ArrOpt[i].ROpt){
			ICanChapter.IsActComplete = false;
		} 
	}

	return (ICanChapter.IsActComplete);
}

function GetICanScore() {
	//return()
}

