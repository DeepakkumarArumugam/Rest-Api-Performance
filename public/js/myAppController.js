var myApp = angular.module('myApp',[]);

myApp.controller('myAppController', ['$scope', '$http', function($scope, $http) {
    $scope.infoMessage="";
    $scope.appInfo = {};
    $scope.copyrightYears = "2016-2020";
    $scope.copyrightCompany = "Company Name";
    
   
    $scope.showInfoBar = false;
    // info message 
    $scope.infoMsg = function(message) {
        $scope.infoMessage = message;
        $scope.showInfoBar = true;

    }

    /// remove  info message
    $scope.removeInfoBar = function() {
        $scope.showInfoBar = false;
    }
    $scope.serviceData = {};
    $scope.submitClick =function () {
       let requestObj = $scope.serviceData; 
       
       
       
       var req = {
           method: 'POST',
           url: '/v1/benchMark',
           headers: {
               'Content-Type': 'application/json'
           },
           data: { requestObj: requestObj }
       }
       
       $http(req).then(function(response){
           
           
           
       }, function(response){
           
           
       });
       
    }


   

  

}]);