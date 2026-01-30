iwb.controller('IwbController', ['$scope', '$location', 'preloader', function($scope, $location, preloader){
	var thisRef = this;

	//thisRef.navType = Config.navType;
	thisRef.theme = Config.theme;
	thisRef.title = Config.title;
	thisRef.logoFilename = Config.logo;

	$scope.isLoading = true;
	$scope.isSuccessful = false;
	$scope.percentLoaded = 0;

	$scope.imageLocations = Config.preloadImages;

	preloader.preloadImages( $scope.imageLocations ).then(
		function handleResolve( imageLocations ) {
			// Loading was successful.
			$scope.isLoading = false;
			$scope.isSuccessful = true;
		},
		
		function handleReject( imageLocation ) {
			// Loading failed on at least one image.
			$scope.isLoading = false;
			$scope.isSuccessful = false;
		},

		function handleNotify( event ) {
			$scope.percentLoaded = event.percent;
		}
	);

	this.changeIWBMode = function (mode) {
		$location.path("/" + Config[mode]);
	};
}]);