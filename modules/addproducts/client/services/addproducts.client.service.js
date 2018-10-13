// Addproducts service used to communicate Addproducts REST endpoints
(function () {
  'use strict';

  angular
    .module('addproducts')
    .factory('AddproductsService', AddproductsService);

  AddproductsService.$inject = ['$resource'];

  function AddproductsService($resource) {
    return $resource('api/addproducts/:addproductId', {
      addproductId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
