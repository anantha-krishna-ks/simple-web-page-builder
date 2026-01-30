var ActData =
[
	{				
		"instruct":"Match the following.",
		"audSrc":"assets/data/audios/actAudio.mp3",
		"ques" : "Which of these vehicles move on road?",
		"Set1Status" : {"Text":true,"Image":false},								
		"Set2Status" : {"Text":true,"Image":false},
		"LineX1"     : 29, /*Left hand Dots X*/
		"LineX2"     : 0, /*Right hand Dots X value : Should be (equal to)= $M1ContLeftSet1 in CSS*/							
		"ArrSet1"    : [
						
							{"Text":"carbohydrates",     "ImgSrc":"", "ID":0, "MatchID":1},
							{"Text":"proteins",          "ImgSrc":"", "ID":1, "MatchID":3},
							{"Text":"water",             "ImgSrc":"", "ID":2, "MatchID":0},
							{"Text":"roughage",          "ImgSrc":"", "ID":3, "MatchID":4},
							{"Text":"apple and milk",    "ImgSrc":"", "ID":4, "MatchID":2}	
							
						],
		"ArrSet2" 	 : [ 
			
							// {"Text":"Option1", "ImgSrc":"assets/data/images/01.png", "ID":0, "MatchID":2},									
							// {"Text":"Option2", "ImgSrc":"assets/data/images/02.png", "ID":1, "MatchID":1},
							// {"Text":"Option3", "ImgSrc":"assets/data/images/03.png", "ID":2, "MatchID":0},
							// {"Text":"Option4", "ImgSrc":"assets/data/images/04.png", "ID":3, "MatchID":4},
							// {"Text":"Option5", "ImgSrc":"assets/data/images/05.png", "ID":4, "MatchID":3}
							
							{"Text":"absorb nutrients",           "ImgSrc":"", "ID":0, "MatchID":2},
							{"Text":"give us energy",             "ImgSrc":"", "ID":1, "MatchID":0},
							{"Text":"protect us from diseases",   "ImgSrc":"", "ID":2, "MatchID":4},
							{"Text":"repair muscles",             "ImgSrc":"", "ID":3, "MatchID":1},
							{"Text":"removal of waste",           "ImgSrc":"", "ID":4, "MatchID":3}					
						]
	}
];