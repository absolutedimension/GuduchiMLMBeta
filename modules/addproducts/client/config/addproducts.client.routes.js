
(function () {
  'use strict';

  angular
    .module('addproducts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('addproducts', {
        abstract: true,
        url: '/addproducts',
        template: '<ui-view/>'
      })
      .state('addproducts.list', {
        url: '',
        templateUrl: 'modules/addproducts/client/views/list-addproducts.client.view.html',
        controller: 'AddproductsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Addproducts List'
        }
      })
      .state('addproducts.create', {
        url: '/create',
        templateUrl: 'modules/addproducts/client/views/form-addproduct.client.view.html',
        controller: 'AddproductsController',
        controllerAs: 'vm',
        resolve: {
          addproductResolve: newAddproduct
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Addproducts Create'
        }
      })
      .state('addproducts.edit', {
        url: '/:addproductId/edit',
        templateUrl: 'modules/addproducts/client/views/form-addproduct.client.view.html',
        controller: 'AddproductsController',
        controllerAs: 'vm',
        resolve: {
          addproductResolve: getAddproduct
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Addproduct {{ addproductResolve.name }}'
        }
      })
      .state('addproducts.view', {
        url: '/:addproductId',
        templateUrl: 'modules/addproducts/client/views/view-addproduct.client.view.html',
        controller: 'AddproductsController',
        controllerAs: 'vm',
        resolve: {
          addproductResolve: getAddproduct
        },
        data: {
          pageTitle: 'Addproduct {{ addproductResolve.name }}'
        }
      });
  }

  getAddproduct.$inject = ['$stateParams', 'AddproductsService'];

  function getAddproduct($stateParams, AddproductsService) {
    return AddproductsService.get({
      addproductId: $stateParams.addproductId
    }).$promise;
  }

  newAddproduct.$inject = ['AddproductsService'];

  function newAddproduct(AddproductsService) {
    return new AddproductsService();
  }
}());
