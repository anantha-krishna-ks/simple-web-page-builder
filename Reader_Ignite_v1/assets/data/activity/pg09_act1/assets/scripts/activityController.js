iwb.controller('MatchController', ['$scope', '$log', '$timeout', '$rootScope', function($scope, $log, $timeout, $rootScope){
	$scope.centerAnchor = true;
	$scope.parent = $scope.$parent;
	
	//$scope.HomeScreenTitle = HomeScreenTitle;

	$scope.CurrQuesCounter = 0;
	$scope.ArrActData = ActData[$scope.CurrQuesCounter];

	$scope.IsAudPlaying = false;	
	$scope.IsGamePopUp = false;
	$scope.IsGameStart = true;

	//Blocker
	$scope.IsHeaderBlocker = false;
	$scope.IsActBlocker = false;
	$scope.IsFooterBlocker = false;

	//audio	
	$scope.ClsAudInstruct = "ClsAudioStop"; // ClsAudioStop / ClsAudioPlay

	/*------------ Template Variables :: Starts------------*/	
	$scope.LineWidthVal = 10;
	$scope.ArrSet1;
	$scope.ArrSet2;					
	$scope.LineX1;
	$scope.LineX2; // Line Drawing Container width
	$scope.IsSubmitClicked = false;	
	$scope.LineColorBlack = '#585858';	
	$scope.LineColorGreen = '#16aa65';
	$scope.LineColorRed = '#c53442';
	$scope.LineWidth = "10px solid";
	$scope.ClsSubmit = 'ClsDisableBtn';
	$scope.ClsReset = 'ClsDisableBtn';
	$scope.ClsShow = 'ClsDisableBtn';	
	$scope.ArrInfoDot1 = []; //to hold all left dot objects
	$scope.ArrInfoDot2 = []; //to hold all right dot objects	
	/*New Variables*/
	$scope.SelectedItem = {"DotID":null, "ID":null, "ParentID":null, "DotX":0, "DotY":0};
	$scope.ArrSelItem = [];	
	$scope.ArrClsCellHeight = ["ClsCellHeight0", "ClsCellHeight1", "ClsCellHeight2", "ClsCellHeight3", "ClsCellHeight4", "ClsCellHeight5", "ClsCellHeight6", "ClsCellHeight7"];
	$scope.CellLengthCount = 0;
	$scope.AllActData = 0;

	$scope.IsAllCorrect = 0;

	
/*------------ Template Variables ::     Ends------------*/


//Shuffle Array
$scope.ShuffleArray = function(TempArr) {
	var currentIndex = TempArr.length, temporaryValue, randomIndex;
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
	// Pick a remaining element...
	randomIndex = Math.floor(Math.random() * currentIndex);
	currentIndex -= 1;

	// And swap it with the current element.
	temporaryValue = TempArr[currentIndex];
	TempArr[currentIndex] = TempArr[randomIndex];
	TempArr[randomIndex] = temporaryValue;
	}
	return TempArr;	
};

//Init Activity
$scope.InitActivity = function() {	
	// $scope.ShuffleDataArray($scope.ArrActData);
	// $scope.ArrAnsData = $scope.ArrActData[0].drop[0].correctDragID.split(',');
	// $scope.MaxQues = $scope.ArrAnsData.length;	
	$scope.CurrQuesCounter = 0;			
	$("#instructAud").on('ended',function(){ $scope.onAudInstructEnd();});
	$("#instructAud").attr('src', $scope.ArrActData.audSrc);	
	
	$scope.ArrSet1 = $scope.ArrActData.ArrSet1;
	$scope.ArrSet2 = $scope.ArrActData.ArrSet2;	 
	$scope.LineX1 = $scope.ArrActData.LineX1;
	$scope.LineX2 = $scope.ArrActData.LineX2;
	$scope.CellLengthCount = $scope.ArrSet1.length;
	setTimeout(function(){
		$scope.GenerateArrDataFun();
	},10);	
	$scope.IsGameStart = true;
};

//Instruction Audio
$scope.PlayAudInstruct = function() {	
    $("#instructAud")[0].play();
	$scope.IsHeaderBlocker = true;
	$scope.IsActBlocker = true;
	$scope.IsFooterBlocker = true;
	$scope.ClsAudInstruct = "ClsAudioPlay";
};

$scope.onAudInstructEnd = function() {
	$timeout(function(){
		$scope.IsHeaderBlocker = false;
		$scope.IsActBlocker = false;
		$scope.IsFooterBlocker = false;
		$scope.ClsAudInstruct = "ClsAudioStop";
	}, 20);
};

	
/*---- @VK :: Activity Variable Ends ---*/
/*---- Other Functions Starts -------*/	
	

/*---- Other Functions Ends ----*/

/*------------ Template Functionality :: Starts------------*/ 
/*Activity Functions : Starts*/

$scope.createLine = function(x1, y1, x2, y2, id, LineColor) {	
  var isIE = navigator.userAgent.indexOf("MSIE") > -1;
  if (x2 < x1) {
	var temp = x1;
	x1 = x2; x2 = temp;
	temp = y1; y1 = y2;
	y2 = temp;
  }

  var line = document.createElement("div");
  line.id = id;
  var length = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  line.style.width = length + "px";
  line.style.borderBottom = $scope.LineWidth;
  line.style.borderColor = LineColor;
  line.style.position = "absolute"; 	  

 /* if(isIE){
	line.style.top = (y2 > y1) ? y1 + "px" : y2 + "px";
	line.style.left = x1 + "px";
	var nCos = (x2 - x1) / length;
	var nSin = (y2 - y1) / length;
	line.style.filter = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=" + nCos + ", M12=" + -1 * nSin + ", M21=" + nSin + ", M22=" + nCos + ")";
  } 
  else {
	var angle = Math.atan((y2 - y1) / (x2 - x1));
	line.style.top = y1 + 0.5 * length * Math.sin(angle) + "px";
	line.style.left = x1 - 0.5 * length * (1 - Math.cos(angle)) + "px";
	line.style.transform = line.style.MozTransform = line.style.WebkitTransform = line.style.msTransform = line.style.OTransform = "rotate(" + angle + "rad)";
  }*/
  
  var angle = Math.atan((y2 - y1) / (x2 - x1));
  line.style.top = y1 + 0.5 * length * Math.sin(angle) + "px";
  line.style.left = x1 - 0.5 * length * (1 - Math.cos(angle)) + "px";
  line.style.transform = line.style.MozTransform = line.style.WebkitTransform = line.style.msTransform = line.style.OTransform = "rotate(" + angle + "rad)";

  return line;
};

$scope.OnSet1MouseUp = function(event, DotID, ID, ParentID) {

	if($scope.ArrSelItem.length === 0){
		var IsLineToRemove = false;
		$scope.ArrSelItem = [];		
		var ArrIndex = $scope.ReturnArrIndex($scope.ArrInfoDot1, ID);
		
		if($scope.ArrInfoDot1[ArrIndex].NgClass == "ClsEnableDot"){IsLineToRemove = true;}
		else if($scope.ArrInfoDot1[ArrIndex].NgClass == "ClsDisableDot"){IsLineToRemove = false;}	
		
		for(var i=0; i<$scope.ArrInfoDot1.length; i++){			
			if(!$scope.ArrInfoDot1[i].IsLine){
				$scope.ArrInfoDot1[i].NgClass = "ClsDisableDot";
			}
		}
		$scope.ArrInfoDot1[ArrIndex].NgClass = "ClsEnableDot";	
		
		$scope.SelectedItem = {"DotID":null, "ID":null, "ParentID":null, "DotX":0, "DotY":0};		
		$scope.SelectedItem = {"DotID":DotID+ID, "ID":ID, "ParentID":ParentID, "DotX":0, "DotY":0};
		$scope.SelectedItem.DotX = $scope.ArrInfoDot1[ArrIndex].DotX;
		$scope.SelectedItem.DotY = $scope.ArrInfoDot1[ArrIndex].DotY;
		$scope.ArrSelItem.push($scope.SelectedItem);

		if(IsLineToRemove){		
			//push another linked point in set2
			var TempLeftID = $scope.ReturnArrIndex($scope.ArrInfoDot2, $scope.ArrInfoDot1[$scope.ArrSelItem[0].ID].CurrentMatchID);
			
			$scope.SelectedItem = {"DotID":null, "ID":null, "ParentID":null, "DotX":0, "DotY":0};		
			$scope.SelectedItem = {"DotID":"DvSet2_SelDot"+TempLeftID, "ID":TempLeftID, "ParentID":"DvContSet2", "DotX":0, "DotY":0};
			$scope.SelectedItem.DotX = $scope.ArrInfoDot2[ArrIndex].DotX;
			$scope.SelectedItem.DotY = $scope.ArrInfoDot2[ArrIndex].DotY;
			$scope.ArrSelItem.push($scope.SelectedItem);			

			//Remove Line if exists :  same code, else part of OnSet2MouseUp when ArrSelItem.length > 1
			var LeftDotArrIndex = $scope.ReturnArrIndex($scope.ArrInfoDot1, $scope.ArrSelItem[0].ID); 
			var RightDotArrIndex = $scope.ReturnArrIndex($scope.ArrInfoDot2, $scope.ArrSelItem[1].ID);
						
			if($scope.ArrInfoDot1[LeftDotArrIndex].IsLine){
				var ArrIndexLeft = LeftDotArrIndex;
				var ArrIndexRight = $scope.ReturnArrIndex($scope.ArrInfoDot2, $scope.ArrInfoDot1[LeftDotArrIndex].CurrentMatchID);

				//remove Line
				var TempLine = angular.element( document.querySelector( '#'+$scope.ArrInfoDot1[LeftDotArrIndex].LineID));
				TempLine.remove();

				//update Array : left hand side				
				$scope.ArrInfoDot1[ArrIndexLeft].IsLine = false;
				$scope.ArrInfoDot1[ArrIndexLeft].CurrentMatchID = null;
				$scope.ArrInfoDot1[ArrIndexLeft].LineID = null;
				$scope.ArrInfoDot1[ArrIndexLeft].NgClass = "ClsDisableDot";

				//update Array : right hand side			
				$scope.ArrInfoDot2[ArrIndexRight].IsLine = false;
				$scope.ArrInfoDot2[ArrIndexRight].CurrentMatchID = null;
				$scope.ArrInfoDot2[ArrIndexRight].LineID = null;
				$scope.ArrInfoDot2[ArrIndexRight].NgClass = "ClsDisableDot";
			}
			if($scope.ArrInfoDot2[RightDotArrIndex].IsLine){
				var ArrIndexLeft =  $scope.ReturnArrIndex($scope.ArrInfoDot1, $scope.ArrInfoDot2[RightDotArrIndex].CurrentMatchID);
				var ArrIndexRight = RightDotArrIndex;

				//remove Line
				var TempLine = angular.element( document.querySelector( '#'+$scope.ArrInfoDot2[RightDotArrIndex].LineID));
				TempLine.remove();

				//update Array : left hand side				
				$scope.ArrInfoDot1[ArrIndexLeft].IsLine = false;
				$scope.ArrInfoDot1[ArrIndexLeft].CurrentMatchID = null;
				$scope.ArrInfoDot1[ArrIndexLeft].LineID = null;
				$scope.ArrInfoDot1[ArrIndexLeft].NgClass = "ClsDisableDot";
				
				//update Array : right hand side			
				$scope.ArrInfoDot2[ArrIndexRight].IsLine = false;
				$scope.ArrInfoDot2[ArrIndexRight].CurrentMatchID = null;
				$scope.ArrInfoDot2[ArrIndexRight].LineID = null;
				$scope.ArrInfoDot2[ArrIndexRight].NgClass = "ClsDisableDot";
			}		
			$scope.ArrSelItem = [];
			$scope.SelectedItem = {"DotID":DotID+ID, "ID":ID, "ParentID":ParentID, "DotX":0, "DotY":0};
			console.log($scope.ArrSelItem)
		}
	}
	else if($scope.ArrSelItem.length === 1 && $scope.ArrSelItem[0].ParentID == "DvContSet2"){
		var ArrIndex = $scope.ReturnArrIndex($scope.ArrInfoDot1, ID);

		if($scope.ArrSelItem.length === 1){
			$scope.ArrInfoDot1[ArrIndex].NgClass = "ClsEnableDot";

			$scope.SelectedItem = {"DotID":null, "ID":null, "ParentID":null, "DotX":0, "DotY":0};		
			$scope.SelectedItem = {"DotID":DotID+ID, "ID":ID, "ParentID":ParentID, "DotX":0, "DotY":0};
			$scope.SelectedItem.DotX = $scope.ArrInfoDot1[ArrIndex].DotX;
			$scope.SelectedItem.DotY = $scope.ArrInfoDot1[ArrIndex].DotY;
			$scope.ArrSelItem.push($scope.SelectedItem);			

			//Remove Line if exists
			var LeftDotArrIndex = $scope.ReturnArrIndex($scope.ArrInfoDot2, $scope.ArrSelItem[0].ID); 
			var RightDotArrIndex = $scope.ReturnArrIndex($scope.ArrInfoDot1, $scope.ArrSelItem[1].ID);

			if($scope.ArrInfoDot2[LeftDotArrIndex].IsLine){
				var ArrIndexLeft = LeftDotArrIndex;
				var ArrIndexRight = $scope.ReturnArrIndex($scope.ArrInfoDot1, $scope.ArrInfoDot2[LeftDotArrIndex].CurrentMatchID);

				//remove Line
				var TempLine = angular.element( document.querySelector( '#'+$scope.ArrInfoDot2[LeftDotArrIndex].LineID));
				TempLine.remove();

				//update Array : left hand side				
				$scope.ArrInfoDot2[ArrIndexLeft].IsLine = false;
				$scope.ArrInfoDot2[ArrIndexLeft].CurrentMatchID = null;
				$scope.ArrInfoDot2[ArrIndexLeft].LineID = null;
				$scope.ArrInfoDot2[ArrIndexLeft].NgClass = "ClsDisableDot";

				//update Array : right hand side			
				$scope.ArrInfoDot1[ArrIndexRight].IsLine = false;
				$scope.ArrInfoDot1[ArrIndexRight].CurrentMatchID = null;
				$scope.ArrInfoDot1[ArrIndexRight].LineID = null;
				$scope.ArrInfoDot1[ArrIndexRight].NgClass = "ClsDisableDot";
			}
			if($scope.ArrInfoDot1[RightDotArrIndex].IsLine){
				var ArrIndexLeft =  $scope.ReturnArrIndex($scope.ArrInfoDot2, $scope.ArrInfoDot1[RightDotArrIndex].CurrentMatchID);
				var ArrIndexRight = RightDotArrIndex;

				//remove Line
				var TempLine = angular.element( document.querySelector( '#'+$scope.ArrInfoDot1[RightDotArrIndex].LineID));
				TempLine.remove();

				//update Array : left hand side				
				$scope.ArrInfoDot2[ArrIndexLeft].IsLine = false;
				$scope.ArrInfoDot2[ArrIndexLeft].CurrentMatchID = null;
				$scope.ArrInfoDot2[ArrIndexLeft].LineID = null;
				$scope.ArrInfoDot2[ArrIndexLeft].NgClass = "ClsDisableDot";
				
				//update Array : right hand side			
				$scope.ArrInfoDot1[ArrIndexRight].IsLine = false;
				$scope.ArrInfoDot1[ArrIndexRight].CurrentMatchID = null;
				$scope.ArrInfoDot1[ArrIndexRight].LineID = null;
				$scope.ArrInfoDot1[ArrIndexRight].NgClass = "ClsDisableDot";
			}

			//Draw Line
			//set Line ID
			var NewLineID = "Line"+$scope.ArrSelItem[0].ID+$scope.ArrSelItem[1].ID;
			angular.element("#DvContLine").append($scope.createLine($scope.ArrSelItem[0].DotX, $scope.ArrSelItem[0].DotY, $scope.ArrSelItem[1].DotX, $scope.ArrSelItem[1].DotY, NewLineID, $scope.LineColorBlack));							

			//NewDotNode = {"ID":$scope.ArrSet2[i].ID, "DotX":0, "DotY":0, "MatchID":$scope.ArrSet2[i].MatchID, "CurrentMatchID":null, "IsLine":false, "LineID":null, "NgClass":"ClsDisableDot"};
			//update Array : left hand side				
			$scope.ArrInfoDot2[LeftDotArrIndex].IsLine = true;
			$scope.ArrInfoDot2[LeftDotArrIndex].CurrentMatchID = $scope.ArrSelItem[1].ID;
			$scope.ArrInfoDot2[LeftDotArrIndex].LineID = NewLineID;
			$scope.ArrInfoDot2[LeftDotArrIndex].NgClass = "ClsEnableDot";

			//update Array : right hand side			
			$scope.ArrInfoDot1[RightDotArrIndex].IsLine = true;
			$scope.ArrInfoDot1[RightDotArrIndex].CurrentMatchID = $scope.ArrSelItem[0].ID;
			$scope.ArrInfoDot1[RightDotArrIndex].LineID = NewLineID;
			$scope.ArrInfoDot1[RightDotArrIndex].NgClass = "ClsEnableDot";			
			//console.log($scope.ArrInfoDot2);		
			
			//Enable Reset - Submit
			$scope.ClsReset = 'ClsEnableBtn';
			$scope.ClsSubmit = 'ClsEnableBtn';
		}

		$scope.ArrSelItem = [];
		$scope.SelectedItem = {"DotID":DotID+ID, "ID":ID, "ParentID":ParentID, "DotX":0, "DotY":0};

	}	

	else{
		var TempArrIndex = $scope.ReturnArrIndex($scope.ArrInfoDot1, $scope.ArrSelItem[0].ID);
		$scope.ArrInfoDot1[TempArrIndex].NgClass = "ClsDisableDot";
		$scope.ArrSelItem = [];
		$scope.SelectedItem = {"DotID":DotID+ID, "ID":ID, "ParentID":ParentID, "DotX":0, "DotY":0};		
	}

	if($scope.UpdateCheckAnsSubmit()){
		$scope.ClsReset = 'ClsEnableBtn';
		$scope.ClsSubmit = 'ClsEnableBtn';
	}
	else {
		$scope.ClsReset = 'ClsDisableBtn';
		$scope.ClsSubmit = 'ClsDisableBtn';
	}
	
	//console.log($scope.ArrSelItem);
	$scope.CheckAnswerEachStep();
};

$scope.OnSet2MouseUp = function(event, DotID, ID, ParentID) {
	console.log( DotID, ID, ParentID)
	if($scope.ArrSelItem.length === 0){
		var IsLineToRemove = false;
		$scope.ArrSelItem = [];		
		var ArrIndex = $scope.ReturnArrIndex($scope.ArrInfoDot2, ID);	

		console.log(ArrIndex)

		if($scope.ArrInfoDot2[ArrIndex].NgClass == "ClsEnableDot"){IsLineToRemove = true;}
		else if($scope.ArrInfoDot2[ArrIndex].NgClass == "ClsDisableDot"){IsLineToRemove = false;}

		for(var i=0; i<$scope.ArrInfoDot2.length; i++){			
			if(!$scope.ArrInfoDot2[i].IsLine){
				$scope.ArrInfoDot2[i].NgClass = "ClsDisableDot";
			}
		}		
		$scope.ArrInfoDot2[ArrIndex].NgClass = "ClsEnableDot";			
		$scope.SelectedItem = {"DotID":null, "ID":null, "ParentID":null, "DotX":0, "DotY":0};		
		$scope.SelectedItem = {"DotID":DotID+ID, "ID":ID, "ParentID":ParentID, "DotX":0, "DotY":0};
		$scope.SelectedItem.DotX = $scope.ArrInfoDot2[ArrIndex].DotX;
		$scope.SelectedItem.DotY = $scope.ArrInfoDot2[ArrIndex].DotY;
		$scope.ArrSelItem.push($scope.SelectedItem);

		if(IsLineToRemove){		
			//push another linked point in set1
			var TempRightID = $scope.ReturnArrIndex($scope.ArrInfoDot1, $scope.ArrInfoDot2[$scope.ArrSelItem[0].ID].CurrentMatchID);
			$scope.SelectedItem = {"DotID":null, "ID":null, "ParentID":null, "DotX":0, "DotY":0};		
			$scope.SelectedItem = {"DotID":"DvSet1_SelDot"+TempRightID, "ID":TempRightID, "ParentID":"DvContSet1", "DotX":0, "DotY":0};
			$scope.SelectedItem.DotX = $scope.ArrInfoDot2[ArrIndex].DotX;
			$scope.SelectedItem.DotY = $scope.ArrInfoDot2[ArrIndex].DotY;
			$scope.ArrSelItem.push($scope.SelectedItem);
			

			//Remove Line if exists :  same code, else part of OnSet1MouseUp when ArrSelItem.length > 1
			var LeftDotArrIndex = $scope.ReturnArrIndex($scope.ArrInfoDot2, $scope.ArrSelItem[0].ID); 
			var RightDotArrIndex = $scope.ReturnArrIndex($scope.ArrInfoDot1, $scope.ArrSelItem[1].ID);

			if($scope.ArrInfoDot2[LeftDotArrIndex].IsLine){
				var ArrIndexLeft = LeftDotArrIndex;
				var ArrIndexRight = $scope.ReturnArrIndex($scope.ArrInfoDot1, $scope.ArrInfoDot2[LeftDotArrIndex].CurrentMatchID);

				//remove Line
				var TempLine = angular.element( document.querySelector( '#'+$scope.ArrInfoDot2[LeftDotArrIndex].LineID));
				TempLine.remove();

				//update Array : left hand side				
				$scope.ArrInfoDot2[ArrIndexLeft].IsLine = false;
				$scope.ArrInfoDot2[ArrIndexLeft].CurrentMatchID = null;
				$scope.ArrInfoDot2[ArrIndexLeft].LineID = null;
				$scope.ArrInfoDot2[ArrIndexLeft].NgClass = "ClsDisableDot";

				//update Array : right hand side			
				$scope.ArrInfoDot1[ArrIndexRight].IsLine = false;
				$scope.ArrInfoDot1[ArrIndexRight].CurrentMatchID = null;
				$scope.ArrInfoDot1[ArrIndexRight].LineID = null;
				$scope.ArrInfoDot1[ArrIndexRight].NgClass = "ClsDisableDot";
			}
			if($scope.ArrInfoDot1[RightDotArrIndex].IsLine){
				var ArrIndexLeft =  $scope.ReturnArrIndex($scope.ArrInfoDot2, $scope.ArrInfoDot1[RightDotArrIndex].CurrentMatchID);
				var ArrIndexRight = RightDotArrIndex;

				//remove Line
				var TempLine = angular.element( document.querySelector( '#'+$scope.ArrInfoDot1[RightDotArrIndex].LineID));
				TempLine.remove();

				//update Array : left hand side				
				$scope.ArrInfoDot2[ArrIndexLeft].IsLine = false;
				$scope.ArrInfoDot2[ArrIndexLeft].CurrentMatchID = null;
				$scope.ArrInfoDot2[ArrIndexLeft].LineID = null;
				$scope.ArrInfoDot2[ArrIndexLeft].NgClass = "ClsDisableDot";
				
				//update Array : right hand side			
				$scope.ArrInfoDot1[ArrIndexRight].IsLine = false;
				$scope.ArrInfoDot1[ArrIndexRight].CurrentMatchID = null;
				$scope.ArrInfoDot1[ArrIndexRight].LineID = null;
				$scope.ArrInfoDot1[ArrIndexRight].NgClass = "ClsDisableDot";
			}
			

			$scope.ArrSelItem = [];
			$scope.SelectedItem = {"DotID":DotID+ID, "ID":ID, "ParentID":ParentID, "DotX":0, "DotY":0};
			
		}	
	}
	else if($scope.ArrSelItem.length === 1 && $scope.ArrSelItem[0].ParentID == "DvContSet1"){

		var ArrIndex = $scope.ReturnArrIndex($scope.ArrInfoDot2, ID);

		if($scope.ArrSelItem.length === 1){
			$scope.ArrInfoDot2[ArrIndex].NgClass = "ClsEnableDot";

			$scope.SelectedItem = {"DotID":null, "ID":null, "ParentID":null, "DotX":0, "DotY":0};		
			$scope.SelectedItem = {"DotID":DotID+ID, "ID":ID, "ParentID":ParentID, "DotX":0, "DotY":0};
			$scope.SelectedItem.DotX = $scope.ArrInfoDot2[ArrIndex].DotX;
			$scope.SelectedItem.DotY = $scope.ArrInfoDot2[ArrIndex].DotY;
			$scope.ArrSelItem.push($scope.SelectedItem);			

			var LeftDotArrIndex = $scope.ReturnArrIndex($scope.ArrInfoDot1, $scope.ArrSelItem[0].ID); 
			var RightDotArrIndex = $scope.ReturnArrIndex($scope.ArrInfoDot2, $scope.ArrSelItem[1].ID);


			//Remove Line if exists			
			if($scope.ArrInfoDot1[LeftDotArrIndex].IsLine){
				var ArrIndexLeft = LeftDotArrIndex;
				var ArrIndexRight = $scope.ReturnArrIndex($scope.ArrInfoDot2, $scope.ArrInfoDot1[LeftDotArrIndex].CurrentMatchID);

				//remove Line
				var TempLine = angular.element( document.querySelector( '#'+$scope.ArrInfoDot1[LeftDotArrIndex].LineID));
				TempLine.remove();

				//update Array : left hand side				
				$scope.ArrInfoDot1[ArrIndexLeft].IsLine = false;
				$scope.ArrInfoDot1[ArrIndexLeft].CurrentMatchID = null;
				$scope.ArrInfoDot1[ArrIndexLeft].LineID = null;
				$scope.ArrInfoDot1[ArrIndexLeft].NgClass = "ClsDisableDot";

				//update Array : right hand side			
				$scope.ArrInfoDot2[ArrIndexRight].IsLine = false;
				$scope.ArrInfoDot2[ArrIndexRight].CurrentMatchID = null;
				$scope.ArrInfoDot2[ArrIndexRight].LineID = null;
				$scope.ArrInfoDot2[ArrIndexRight].NgClass = "ClsDisableDot";
			}
			if($scope.ArrInfoDot2[RightDotArrIndex].IsLine){
				var ArrIndexLeft =  $scope.ReturnArrIndex($scope.ArrInfoDot1, $scope.ArrInfoDot2[RightDotArrIndex].CurrentMatchID);
				var ArrIndexRight = RightDotArrIndex;

				//remove Line
				var TempLine = angular.element( document.querySelector( '#'+$scope.ArrInfoDot2[RightDotArrIndex].LineID));
				TempLine.remove();

				//update Array : left hand side				
				$scope.ArrInfoDot1[ArrIndexLeft].IsLine = false;
				$scope.ArrInfoDot1[ArrIndexLeft].CurrentMatchID = null;
				$scope.ArrInfoDot1[ArrIndexLeft].LineID = null;
				$scope.ArrInfoDot1[ArrIndexLeft].NgClass = "ClsDisableDot";
				
				//update Array : right hand side			
				$scope.ArrInfoDot2[ArrIndexRight].IsLine = false;
				$scope.ArrInfoDot2[ArrIndexRight].CurrentMatchID = null;
				$scope.ArrInfoDot2[ArrIndexRight].LineID = null;
				$scope.ArrInfoDot2[ArrIndexRight].NgClass = "ClsDisableDot";
			}

			//Draw Line
			//set Line ID
			var NewLineID = "Line"+$scope.ArrSelItem[0].ID+$scope.ArrSelItem[1].ID;
			angular.element("#DvContLine").append($scope.createLine($scope.ArrSelItem[0].DotX, $scope.ArrSelItem[0].DotY, $scope.ArrSelItem[1].DotX, $scope.ArrSelItem[1].DotY, NewLineID, $scope.LineColorBlack));							

			//NewDotNode = {"ID":$scope.ArrSet2[i].ID, "DotX":0, "DotY":0, "MatchID":$scope.ArrSet2[i].MatchID, "CurrentMatchID":null, "IsLine":false, "LineID":null, "NgClass":"ClsDisableDot"};
			//update Array : left hand side				
			$scope.ArrInfoDot1[LeftDotArrIndex].IsLine = true;
			$scope.ArrInfoDot1[LeftDotArrIndex].CurrentMatchID = $scope.ArrSelItem[1].ID;
			$scope.ArrInfoDot1[LeftDotArrIndex].LineID = NewLineID;
			$scope.ArrInfoDot1[LeftDotArrIndex].NgClass = "ClsEnableDot";

			//update Array : right hand side			
			$scope.ArrInfoDot2[RightDotArrIndex].IsLine = true;
			$scope.ArrInfoDot2[RightDotArrIndex].CurrentMatchID = $scope.ArrSelItem[0].ID;
			$scope.ArrInfoDot2[RightDotArrIndex].LineID = NewLineID;
			$scope.ArrInfoDot2[RightDotArrIndex].NgClass = "ClsEnableDot";			
			//console.log($scope.ArrInfoDot1);		
			
			//Enable Reset - Submit
			$scope.ClsReset = 'ClsEnableBtn';
			$scope.ClsSubmit = 'ClsEnableBtn';
		}		

		$scope.ArrSelItem = [];
		$scope.SelectedItem = {"DotID":DotID+ID, "ID":ID, "ParentID":ParentID, "DotX":0, "DotY":0};
	}

	else{
		var TempArrIndex = $scope.ReturnArrIndex($scope.ArrInfoDot2, $scope.ArrSelItem[0].ID);
		$scope.ArrInfoDot2[TempArrIndex].NgClass = "ClsDisableDot";
		$scope.ArrSelItem = [];
		$scope.SelectedItem = {"DotID":DotID+ID, "ID":ID, "ParentID":ParentID, "DotX":0, "DotY":0};
	}
	//console.log($scope.ArrSelItem);	
	//console.log($scope.ArrInfoDot1, $scope.ArrInfoDot2);

	if($scope.UpdateCheckAnsSubmit()){
		$scope.ClsReset = 'ClsEnableBtn';
		$scope.ClsSubmit = 'ClsEnableBtn';
	}
	else {
		$scope.ClsReset = 'ClsDisableBtn';
		$scope.ClsSubmit = 'ClsDisableBtn';
	}

	$scope.CheckAnswerEachStep();
}

$scope.ReturnArrIndex = function(Arr, ID){
	for(var i=0; i<Arr.length; i++){
		if(Arr[i].ID === ID){
			return i;
		}
	}
};


$scope.UpdateCheckAnsSubmit = function(){
	var IsEnable = false;
	for(var i=0; i<$scope.ArrInfoDot1.length; i++){
		if($scope.ArrInfoDot1[i].CurrentMatchID != null){
			IsEnable = true;
		}
	}
	return IsEnable;
};


// console.log($scope.ArrSet1[i].ID, $scope.ArrSet1[i].MatchID)

$scope.GenerateArrDataFun = function(){
	$scope.ArrInfoDot1 = [];
	$scope.ArrInfoDot2 = [];
	for(var i=0; i<$scope.ArrSet1.length; i++){			
		var NewDotNode = {"ID":$scope.ArrSet1[i].ID, "DotX":0, "DotY":0, "MatchID":$scope.ArrSet1[i].MatchID, "CurrentMatchID":null, "IsLine":false, "LineID":null, "NgClass":"ClsDisableDot", "ResStatus": false, "ResClass":"ClsInCorrect"};
		// console.log(NewDotNode)
		
		var DivObj = angular.element(document.querySelector('#DvSet1_'+i));			
				
		// var ObjCSS = {'Width':"", 'Height':DivObj.css('min-height'),'Top':DivObj.css('top'),'Left':DivObj.css('left')};	
		var ObjCSS = {'Width':"", 'Height': $('#DvSet1_'+i)[0].clientHeight,'Top': $('#DvSet1_'+i)[0].offsetTop,'Left': $('#DvSet1_'+i)[0].offsetLeft};			

		
		var DivObjCont = angular.element(document.querySelector('#DvContSet1'));
		ObjCSS.Width = Number(DivObjCont.css('width').replace("px",""));			
		
		NewDotNode.DotX = Number(ObjCSS.Left + Number(Math.round(ObjCSS.Width)) + $scope.LineX1);
		NewDotNode.DotY = Number(ObjCSS.Top + Number(Math.round(ObjCSS.Height/2))) - Number($scope.LineWidthVal/2);

		$scope.ArrInfoDot1.push(NewDotNode);
	}

	for(var i=0; i<$scope.ArrSet2.length; i++){
		var NewDotNode = {"ID":$scope.ArrSet2[i].ID, "DotX":0, "DotY":0, "MatchID":$scope.ArrSet2[i].MatchID, "CurrentMatchID":null, "IsLine":false, "LineID":null, "NgClass":"ClsDisableDot"};

		var DivObj = angular.element(document.querySelector('#DvSet2_'+i));			
		// var ObjCSS = {'Width':"", 'Height':DivObj.css('min-height'),'Top':DivObj.css('top'),'Left':DivObj.css('left')};
		var ObjCSS = {'Width':"", 'Height': $('#DvSet2_'+i)[0].clientHeight,'Top': $('#DvSet2_'+i)[0].offsetTop,'Left': $('#DvSet2_'+i)[0].offsetLeft};			
		
		var DivObjCont = angular.element(document.querySelector('#DvContSet2'));
		var RMContLeft = Number(DivObjCont.css('left').replace("px",""));
		ObjCSS.Width = Number(DivObjCont.css('width').replace("px",""));			
				
		NewDotNode.DotX = Number(RMContLeft-$scope.LineX2);
		NewDotNode.DotY = Number(ObjCSS.Top + Number(Math.round(ObjCSS.Height/2))) - Number($scope.LineWidthVal/2);

		$scope.ArrInfoDot2.push(NewDotNode);
	}

	//console.log($scope.ArrInfoDot1, $scope.ArrInfoDot2);
}

/*Activity Functions : Ends*/

/*Footer Functions : Starts*/
$scope.ShowAnswer = function() {
	//remove all lines
	
	var TempCont = angular.element( document.querySelector('#DvContLine'));
	TempCont.html("");

	for(var i=0; i<$scope.ArrInfoDot1.length; i++){			
		$scope.ArrInfoDot1[i].NgClass = "ClsDisableDot";
		$scope.ArrInfoDot1[i].ResStatus = true;	
		$scope.ArrInfoDot1[i].ResClass = "ClsCorrect";	
		var NewLineID = "Line"+$scope.ArrInfoDot1[i].ID+$scope.ArrInfoDot1[i].MatchID;			 
		var ArrIndexRight = $scope.ReturnArrIndex($scope.ArrInfoDot2, $scope.ArrInfoDot1[i].MatchID);
		angular.element("#DvContLine").append($scope.createLine($scope.ArrInfoDot1[i].DotX, $scope.ArrInfoDot1[i].DotY, $scope.ArrInfoDot2[ArrIndexRight].DotX, $scope.ArrInfoDot2[ArrIndexRight].DotY, NewLineID, $scope.LineColorGreen));							
	}
	for(var i=0; i<$scope.ArrInfoDot2.length; i++){						
		$scope.ArrInfoDot2[i].NgClass = "ClsDisableDot";							
	}		
	
	//Enable Reset - Submit
	$scope.ClsReset = 'ClsEnableBtn';
	$scope.ClsSubmit = 'ClsDisableBtn';
	$scope.ClsShow = 'ClsDisableBtn';

	$scope.IsHeaderBlocker = false;
	$scope.IsActBlocker = true;
	$scope.IsFooterBlocker = false;
};	

$scope.CheckAnswer = function() {
	
	var TempCont = angular.element( document.querySelector('#DvContLine'));
	TempCont.html("");
	
	for(var i=0; i<$scope.ArrInfoDot1.length; i++){			
		$scope.ArrInfoDot1[i].NgClass = "ClsDisableDot";			
		if($scope.ArrInfoDot1[i].IsLine){
			$scope.ArrInfoDot1[i].ResStatus = true;
			var NewLineID = "Line"+$scope.ArrInfoDot1[i].ID+$scope.ArrInfoDot1[i].CurrentMatchID;			 
			var ArrIndexRight = $scope.ReturnArrIndex($scope.ArrInfoDot2, $scope.ArrInfoDot1[i].CurrentMatchID);
			
			if($scope.ArrInfoDot1[i].MatchID === $scope.ArrInfoDot1[i].CurrentMatchID){					
				$scope.ArrInfoDot1[i].ResClass = "ClsCorrect";
				angular.element("#DvContLine").append($scope.createLine($scope.ArrInfoDot1[i].DotX, $scope.ArrInfoDot1[i].DotY, $scope.ArrInfoDot2[ArrIndexRight].DotX, $scope.ArrInfoDot2[ArrIndexRight].DotY, NewLineID, $scope.LineColorGreen));
				$scope.IsAllCorrect++;
			}
			else{					
				$scope.ArrInfoDot1[i].ResClass = "ClsInCorrect";
				angular.element("#DvContLine").append($scope.createLine($scope.ArrInfoDot1[i].DotX, $scope.ArrInfoDot1[i].DotY, $scope.ArrInfoDot2[ArrIndexRight].DotX, $scope.ArrInfoDot2[ArrIndexRight].DotY, NewLineID, $scope.LineColorRed));
				
				$rootScope.$broadcast('showRevealButton', {'showRevealButton': true}); // Added for disable reaveal button when all answer is correct
			}
		}					
	}
	for(var i=0; i<$scope.ArrInfoDot2.length; i++){						
		$scope.ArrInfoDot2[i].NgClass = "ClsDisableDot";							
	}

	//Enable Reset - Submit
	$scope.ClsReset = 'ClsEnableBtn';
	$scope.ClsSubmit = 'ClsDisableBtn';
	

	if($scope.IsAllCorrect === $scope.ArrInfoDot1.length){
		$scope.ClsShow = 'ClsDisableBtn';
	}
	else{
		$scope.ClsShow = 'ClsEnableBtn';
	}

	$scope.IsHeaderBlocker = false;
	$scope.IsActBlocker = true;
	$scope.IsFooterBlocker = false;
};


//check answer on each steps
$scope.CheckAnswerEachStep = function() {
	
	var TempCont = angular.element( document.querySelector('#DvContLine'));
	TempCont.html("");
	
	for(var i=0; i<$scope.ArrInfoDot1.length; i++){			
		$scope.ArrInfoDot1[i].NgClass = "ClsDisableDot";			
		if($scope.ArrInfoDot1[i].IsLine){
			$scope.ArrInfoDot1[i].ResStatus = true;
			var NewLineID = "Line"+$scope.ArrInfoDot1[i].ID+$scope.ArrInfoDot1[i].CurrentMatchID;			 
			var ArrIndexRight = $scope.ReturnArrIndex($scope.ArrInfoDot2, $scope.ArrInfoDot1[i].CurrentMatchID);
			
			if($scope.ArrInfoDot1[i].MatchID === $scope.ArrInfoDot1[i].CurrentMatchID){					
				$scope.ArrInfoDot1[i].ResClass = "ClsCorrect";
				angular.element("#DvContLine").append($scope.createLine($scope.ArrInfoDot1[i].DotX, $scope.ArrInfoDot1[i].DotY, $scope.ArrInfoDot2[ArrIndexRight].DotX, $scope.ArrInfoDot2[ArrIndexRight].DotY, NewLineID, $scope.LineColorGreen));
				$scope.IsAllCorrect++;
			}
			else{					
				$scope.ArrInfoDot1[i].ResClass = "ClsInCorrect";
				angular.element("#DvContLine").append($scope.createLine($scope.ArrInfoDot1[i].DotX, $scope.ArrInfoDot1[i].DotY, $scope.ArrInfoDot2[ArrIndexRight].DotX, $scope.ArrInfoDot2[ArrIndexRight].DotY, NewLineID, $scope.LineColorRed));
				
				$rootScope.$broadcast('showRevealButton', {'showRevealButton': true}); // Added for disable reaveal button when all answer is correct
			}
		}					
	}
	for(var i=0; i<$scope.ArrInfoDot2.length; i++){						
		$scope.ArrInfoDot2[i].NgClass = "ClsDisableDot";							
	}

	//Enable Reset - Submit
	// $scope.ClsReset = 'ClsEnableBtn';
	// $scope.ClsSubmit = 'ClsDisableBtn';
	

	// if($scope.IsAllCorrect === $scope.ArrInfoDot1.length){
	// 	$scope.ClsShow = 'ClsDisableBtn';
	// }
	// else{
	// 	$scope.ClsShow = 'ClsEnableBtn';
	// }

	// $scope.IsHeaderBlocker = false;
	// $scope.IsActBlocker = true;
	// $scope.IsFooterBlocker = false;
};

$scope.ResetActivity = function(){	 
	
	//disable all Dots
	//LHS
	for(var i=0; i<$scope.ArrInfoDot1.length; i++){						
		$scope.ArrInfoDot1[i].ID = "";
		$scope.ArrInfoDot1[i].DotX = 0;
		$scope.ArrInfoDot1[i].DotY = 0;
		$scope.ArrInfoDot1[i].MatchID = "";
		$scope.ArrInfoDot1[i].CurrentMatchID = null;
		$scope.ArrInfoDot1[i].IsLine = false;
		$scope.ArrInfoDot1[i].LineID = null;
		$scope.ArrInfoDot1[i].NgClass = "ClsDisableDot";			
		$scope.ArrInfoDot1[i].ResStatus = false;
		$scope.ArrInfoDot1[i].ResClass = "ClsInCorrect";			
	}
	//RHS
	for(var i=0; i<$scope.ArrInfoDot2.length; i++){						
		$scope.ArrInfoDot2[i].ID = "";
		$scope.ArrInfoDot2[i].DotX = 0;
		$scope.ArrInfoDot2[i].DotY = 0;
		$scope.ArrInfoDot2[i].MatchID = "";
		$scope.ArrInfoDot2[i].CurrentMatchID = null;
		$scope.ArrInfoDot2[i].IsLine = false;
		$scope.ArrInfoDot2[i].LineID = null;
		$scope.ArrInfoDot2[i].NgClass = "ClsDisableDot";			
	}
	//remove all lines
	var TempCont = angular.element( document.querySelector('#DvContLine'));
	TempCont.html("");
	

	setTimeout(function(){
		$scope.ArrSet1 = [];
		$scope.ArrSet2 = [];										
		$scope.IsSubmitClicked = false;		
		$scope.ClsSubmit = 'ClsDisableBtn';
		$scope.ClsReset = 'ClsDisableBtn';
		$scope.ClsShow = 'ClsDisableBtn';	
		$scope.ArrInfoDot1 = [];
		$scope.ArrInfoDot2 = [];
		$scope.SelectedItem = {"DotID":null, "ID":null, "ParentID":null, "DotX":0, "DotY":0};
		$scope.ArrSelItem = [];		
		$scope.InitActivity();		
		$rootScope.$apply();
	},10);
	
	$scope.CurrQuesCounter = 0;			
	$scope.IsAudPlaying = false;		
	
	$scope.ArrAnsData = [];		
	$scope.IsAudPlaying = false;	
	$scope.IsGamePopUp = false;

	$scope.IsHeaderBlocker = false;
	$scope.IsActBlocker = false;
	$scope.IsFooterBlocker = false;

	$scope.IsAllCorrect = 0;

	//$scope.InitActivity();
			  
};	

/*Footer Functions : Ends*/

/*-- Template Functionality :: Ends--*/
	
$scope.InitActivity();


}]);