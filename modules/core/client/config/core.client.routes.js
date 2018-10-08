'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/users/client/views/authentication/dashboard.client.view.html'
    });
    $stateProvider
    .state('treeview', {
      url: '/treeview',
      templateUrl: 'modules/users/client/views/members.treeview.client.html'
    });

    // $stateProvider
    // .state('home2', {
    //   url: '/',
    //   templateUrl: 'modules/core/client/views/home2.client.view.html'
    // });

    $stateProvider
    .state('buy', {
      url: '/buy',
      templateUrl: 'modules/users/client/views/authentication/buy.client.view.html'
    });


    // $stateProvider
    // .state('addschemes', {
    //   url: '/addschemes',
    //   templateUrl: 'modules/users/client/views/authentication/add-schemes.client.view.html'

    //   // templateUrl: 'modules/users/client/views/admin/add-schemes.client.view.html'
    // });

    // $stateProvider
    // .state('addproducts', {
    //   url: '/addproducts',
    //   templateUrl: 'modules/addproducts/client/views/form-addproduct.client.view.html'

    //   // templateUrl: 'modules/users/client/views/admin/add-schemes.client.view.html'
    // });


    $stateProvider
    .state('addmember', {
      url: '/addmember',
      templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
    });

    $stateProvider
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'modules/users/client/views/authentication/dashboard.client.view.html'
    });

    $stateProvider
    .state('read', {
      url: '/read',
      templateUrl: 'modules/users/client/views/authentication/read.client.view.html'
    });

    $stateProvider
    .state('password.offer', {
      url: '/offer',
      templateUrl: 'modules/users/client/views/password/offer.client.view.html'
    })



    
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);
