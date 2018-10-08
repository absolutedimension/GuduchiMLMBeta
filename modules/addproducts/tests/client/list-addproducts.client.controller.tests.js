(function () {
  'use strict';

  describe('Addproducts List Controller Tests', function () {
    // Initialize global variables
    var AddproductsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      AddproductsService,
      mockAddproduct;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _AddproductsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      AddproductsService = _AddproductsService_;

      // create mock article
      mockAddproduct = new AddproductsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Addproduct Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Addproducts List controller.
      AddproductsListController = $controller('AddproductsListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockAddproductList;

      beforeEach(function () {
        mockAddproductList = [mockAddproduct, mockAddproduct];
      });

      it('should send a GET request and return all Addproducts', inject(function (AddproductsService) {
        // Set POST response
        $httpBackend.expectGET('api/addproducts').respond(mockAddproductList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.addproducts.length).toEqual(2);
        expect($scope.vm.addproducts[0]).toEqual(mockAddproduct);
        expect($scope.vm.addproducts[1]).toEqual(mockAddproduct);

      }));
    });
  });
}());
