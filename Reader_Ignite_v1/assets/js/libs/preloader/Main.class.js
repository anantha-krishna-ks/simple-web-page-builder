// document.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
// var lastTouchEnd = 0;
// document.addEventListener('touchend', function (event) {
// 	var now = (new Date()).getTime();
// 	if (now - lastTouchEnd <= 50) { event.preventDefault(); }
// 	lastTouchEnd = now;
// }, { passive: false });  


function MainM() {
	
	this.fullScreenC = false;
	this.boxAjuda = false;
}

MainM.prototype = {
	
	enterAjuda: function(){

		if(Main.boxAjuda){
			
			Main.boxAjuda = false;
			$('.instrucoes').fadeOut('slow');
			//console.log("Here");

		}
		else{
			
			Main.boxAjuda = true;
			$('.instrucoes').fadeIn('slow');
			//console.log("Here");

		}

	},

	initPreloader: function(){
		var loaderAnimation = $("#html5Loader").LoaderAnimation({
			onComplete: function() {	
				openChapter('ch1', 0);	
				// setTimeout(() => { 
				// 	$("#DvLoaderProgressBgText").hide();
				// 	OnInitialStartClick();					
				// 	$("#preloaderBlock").remove();
				// 	$("#wrapper").css("opacity",1);
					
				// }, 2500);		
				
				//$("#theme_animation")[0].play();
				// $("#pl_startBtn").show().on("click", function (){
				// 	//console.log("Here");									
				// });
				// const el = document.getElementById("pl_startBtn");
				// el.onkeydown = (e) => {
				// 	if (e.key === 'Enter' || e.keyCode === 13) {
				// 		e.preventDefault(); // optional but helps avoid double key processing
				// 		el.click(); // triggers whatever is already bound to onclick
				// 	}
				// };
			}
		});		

		$.html5Loader({
			filesToLoad: filesPreloader,
			onComplete: function() {				
			},
			onUpdate: loaderAnimation.update
		});

	}

}