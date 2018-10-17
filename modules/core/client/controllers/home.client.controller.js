'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication','$http','Socket',
  function ($scope, Authentication,$http,Socket) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    Socket.on('test.notification', function(test) {
      alert("Recieved.....");
    });

    $scope.testNotification = function(){
      $http.get('test/notification').then(function(response){
       // alert("Alert :"+JSON.stringify(response));
      }).catch(function(error){

      });
    }
  }
]);
