"use strict";

/**
 * Main module of the application.
 */
angular.module("ngApp", [])
.controller("ngCtrl", ["$scope", function ($scope) {
    var thisRef = $scope;

    thisRef.tocData = window.tocData;
  },
]);