'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator','$timeout',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator, $timeout) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();
    var registerPath="/api/auth/registerByUser";
    var responseMessage;

    if ($scope.authentication.user && $scope.authentication.user.roles[0] === 'admin') {
      registerPath = "/api/auth/register";
      responseMessage = "User added successfully.";
    }else{
      responseMessage = "Your request is submitted to admin for approval";
    }
    

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

      $http.post(registerPath, $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
       // $scope.authentication.user = response;

        // And redirect to the previous or home page
        $scope.error =responseMessage;
      //  alert("User is register");
        // $timeout(function(){
        //   $state.go($state.previous.state.name || 'home', $state.previous.params);
        // },5000);
        
      }).error(function (response) {
        $scope.error = response.message;
      });
    };


    function getChildren(username){
      $http.post('api/auth/getChild',{"username":username}).then(function(response){
        console.log("Response :"+JSON.stringify(response));
        console.log("Response lengthhhh:"+response.data.length);
       // var mlmTree = new Tree();

 
        if(response.data.length==1){
         //  var leftRight ={
         //     left:(response.data[i].side == 'L') ? 'left':'right',
         //     right:(response.data[i].side == 'R') ? 'right':'left'
         //  };
         // mlmTree.add(leftRight);
         // nodes.push({ name: response.data[i].username, nodes: [] ,side:response.data[i].side});

          var side = response.data[0].side[0];

          if(side === 'LR'){
            $scope.both = true;
            $scope.right = false;
            $scope.left =false;
            $scope.full =false;
            $scope.UncheckedStatus = false;

          }else if(side === 'L'){
            $scope.left =true;
            $scope.both = false;
            $scope.right = false;
            $scope.full =false;    
            $scope.UncheckedStatus = false;


          }else if(side === 'R'){
            $scope.right = true;
            $scope.both = false;              
            $scope.left =false;
            $scope.full =false;
            $scope.UncheckedStatus = false;

          }else if(side === 'head'){
            //  $scope.invaliduser = true;
              $scope.right = false;
              $scope.both = false;              
              $scope.left =false;
              $scope.full =false;
              $scope.UncheckedStatus = false;
              $scope.sponsorId = "";
            }
            else if(side === 'full'){
              //  $scope.invaliduser = true;
                $scope.right = false;
                $scope.both = false;              
                $scope.left =false;
                $scope.full =true;
                $scope.UncheckedStatus = false;
                $scope.sponsorId = "";
              }
          else{
            alert("Oops ! Something went wrong,Please try again");
            return;
          }





        }else if (response.data.length == 2){

          $scope.right = false;
          $scope.both = false;              
          $scope.left =false;
          $scope.full =true;
          $scope.UncheckedStatus = false;
          $scope.sponsorId = "";

        }else if(response.data.length == 0){
          $scope.both = true;
          $scope.right = false;
          $scope.left =false;
          $scope.full =false;
          $scope.UncheckedStatus = false;

        }else{

          $scope.right = false;
          $scope.both = false;              
          $scope.left =false;
          $scope.full =false;
          $scope.checkedStatus = false;
          $scope.UncheckedStatus = true;
          $scope.sponsorId = "";
       
        }
      //  $scope.tree = nodes;
       // $scope.tree = mlmTree;
        
       //$scope.tree = [{ name: "Add Gudichi Member", nodes: response.data }];
      }).catch(function(error){
         alert("error :"+JSON.stringify(error));
      });
    }



    $scope.checkedStatus = false;
    $scope.UncheckedStatus = false;
    $scope.validateSponsorId = function(sponsorId){
       // alert(sponsorId);
        $http.get('api/auth/getSponsor/'+sponsorId).then(function(response){
            
            
           // var side = response.data.side;
           if(response.data.side === 'NA'){
              // $scope.test = true;          
            $scope.errorSponsorId = response.data.displayName;
            return false;
           }else{
            $scope.validatedDisplayName = response.data.displayName;
            $scope.checkedStatus = true;
            $scope.errorSponsorId =null;
            getChildren(sponsorId);
           }
            
            
         //  alert("Result: "+JSON.stringify(response));
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


    $scope.approveUser = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = $scope.user;
      console.log("User Object before update==="+JSON.stringify(user));

      $http.post('api/auth/approveUser', $scope.user).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
      //  $state.go($state.previous.state.name || 'home', $state.previous.params);
        $state.go('admin.user', { userId: user._id});
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
