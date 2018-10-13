(function () {
  'use strict';

  angular
    .module('addproducts')
    .controller('AddproductsListController', AddproductsListController);

  AddproductsListController.$inject = ['AddproductsService'];

  function AddproductsListController(AddproductsService) {
    var vm = this;

    vm.addproducts = AddproductsService.query();
  }
}());
