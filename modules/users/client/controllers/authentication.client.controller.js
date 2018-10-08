'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/register', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.checkedStatus = false;
    $scope.validateSponsorId = function(sponsorId){
       // alert(sponsorId);
        $http.get('api/auth/getSponsor/'+sponsorId).then(function(response){
            $scope.validatedDisplayName = response.data.displayName;
            $scope.checkedStatus = true;
            var side = response.data.side;
            if(side === 'LR'){
              $scope.both = true;
              $scope.right = false;
              $scope.left =false;

            }else if(side === 'L'){
              $scope.left =true;
              $scope.both = false;
              $scope.right = false;            


            }else if(side === 'R'){
              $scope.right = true;
              $scope.both = false;              
              $scope.left =false;

            }else if(side === 'NA'){
            //  $scope.invaliduser = true;
              $scope.right = false;
              $scope.both = false;              
              $scope.left =false;
              $scope.sponsorId = "";
            }else{
              alert("Oops ! Something went wrong,Please try again");
              return;
            }
           alert("Result: "+JSON.stringify(response));
        }).catch(function(error){
          $scope.error = error.message;
        });
    } 


    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go('dashboard');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);
