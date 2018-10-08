(function () {
  'use strict';

  // Addproducts controller
  angular
    .module('addproducts')
    .controller('AddproductsController', AddproductsController);

  AddproductsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'addproductResolve'];

  function AddproductsController ($scope, $state, $window, Authentication, addproduct) {
    var vm = this;

    vm.authentication = Authentication;
    vm.addproduct = addproduct;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Addproduct
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.addproduct.$remove($state.go('addproducts.list'));
      }
    }

    // Save Addproduct
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.addproductForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.addproduct._id) {
        vm.addproduct.$update(successCallback, errorCallback);
      } else {
        vm.addproduct.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('addproducts.view', {
          addproductId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
