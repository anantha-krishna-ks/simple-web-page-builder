iwb.service('DataLoadingService', ['$http', function($http){
	var thisRef = this;

	thisRef.loadData = function(fileName, successCallBack, errorCallBack) {
		var fileURL = "data/" + fileName;
		
		return $http({url: fileURL});
		/*$http.get(url).
		success(
			function(data, status, headers, config) {
				successCallBack(data, status, headers, config);
			}
		).
		error(
			function(data, status, headers, config) {
				errorCallBack(data, status, headers, config);
			}
		);*/
	};
}]);
