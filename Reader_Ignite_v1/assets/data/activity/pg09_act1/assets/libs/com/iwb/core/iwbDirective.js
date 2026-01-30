iwb.directive("stopScreenMove", function() {
	return {
		restrict: 'A',
		scope: true,
		link: function (scope, element, attrs) {
			element.on("touchmove", function (event) {
				event.preventDefault();
			});
		}
	};
});

var zoomFactor = 1;
iwb.directive('onResize', ['$window', function ($window) {
	return function (scope, el, attrs) {
		var w = angular.element($window);
		
		scope.scaleStage = function () {
			var scale = {x: 1, y: 1};
			scale.x = ($window.innerWidth) / 1024;
			scale.y = ($window.innerHeight) / 768;
	        
			if (scale.x < scale.y) {
				zoomFactor = scale.x;
				scale = scale.x + ', ' + scale.x;
			} else {
				zoomFactor = scale.y;
				scale = scale.y + ', ' + scale.y;
			}
			
			var newWidth = Number(scale.split(',')[0]) * 1024;
			
			var leftPos = ($window.innerWidth - newWidth) / 2;

			return {
				'scale' : scale,
				'leftPos' : leftPos
			};
		}
		
		scope.$watch('scaleStage()', function(newValue, oldValue) {
			var scale = newValue.scale;
			var leftPos = newValue.leftPos;

			scope.style = function() {
				return {
					'-webkit-transform-origin' : 'left top',
					'-moz-transform-origin' : 'left top',
					'-ms-transform-origin' : 'left top',
					'-o-transform-origin' : 'left top',
					'transform-origin' : 'left top',
					'-webkit-transform' : 'scale3d(' + scale + ', 1)',
					'-moz-transform' : 'scale(' + scale + ')',
					'-ms-transform' : 'scale(' + scale + ')',
					'-o-transform' : 'scale(' + scale + ')',
					'transform' : 'scale(' + scale + ')',
					'position' : 'absolute',
					'top' : '0px',
					'left' : leftPos + 'px'
				};
			};
		}, true);

		w.bind('resize', function() {
			//console.log('resize')
			scope.$apply();
		});
	}
}]);