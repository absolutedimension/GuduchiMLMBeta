'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;
    // $scope.isAdmin = false;
    // $scope.isUser = false;

    // if(Authentication.user.roles[0] === 'admin'){
    //   $scope.isAdmin = true;
    // }else if(Authentication.user.roles[0] === 'user'){
    //   $scope.isUser = true;
    // }
    

    //console.log("Authentication object==="+JSON.stringify(Authentication.user.roles[0]));

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    console.log("menu for topbar=="+JSON.stringify($scope.menu));

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);
