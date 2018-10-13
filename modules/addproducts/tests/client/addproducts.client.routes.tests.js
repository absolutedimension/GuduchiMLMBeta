(function () {
  'use strict';

  describe('Addproducts Route Tests', function () {
    // Initialize global variables
    var $scope,
      AddproductsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AddproductsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AddproductsService = _AddproductsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('addproducts');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/addproducts');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          AddproductsController,
          mockAddproduct;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('addproducts.view');
          $templateCache.put('modules/addproducts/client/views/view-addproduct.client.view.html', '');

          // create mock Addproduct
          mockAddproduct = new AddproductsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Addproduct Name'
          });

          // Initialize Controller
          AddproductsController = $controller('AddproductsController as vm', {
            $scope: $scope,
            addproductResolve: mockAddproduct
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:addproductId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.addproductResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            addproductId: 1
          })).toEqual('/addproducts/1');
        }));

        it('should attach an Addproduct to the controller scope', function () {
          expect($scope.vm.addproduct._id).toBe(mockAddproduct._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/addproducts/client/views/view-addproduct.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AddproductsController,
          mockAddproduct;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('addproducts.create');
          $templateCache.put('modules/addproducts/client/views/form-addproduct.client.view.html', '');

          // create mock Addproduct
          mockAddproduct = new AddproductsService();

          // Initialize Controller
          AddproductsController = $controller('AddproductsController as vm', {
            $scope: $scope,
            addproductResolve: mockAddproduct
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.addproductResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/addproducts/create');
        }));

        it('should attach an Addproduct to the controller scope', function () {
          expect($scope.vm.addproduct._id).toBe(mockAddproduct._id);
          expect($scope.vm.addproduct._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/addproducts/client/views/form-addproduct.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AddproductsController,
          mockAddproduct;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('addproducts.edit');
          $templateCache.put('modules/addproducts/client/views/form-addproduct.client.view.html', '');

          // create mock Addproduct
          mockAddproduct = new AddproductsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Addproduct Name'
          });

          // Initialize Controller
          AddproductsController = $controller('AddproductsController as vm', {
            $scope: $scope,
            addproductResolve: mockAddproduct
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:addproductId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.addproductResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            addproductId: 1
          })).toEqual('/addproducts/1/edit');
        }));

        it('should attach an Addproduct to the controller scope', function () {
          expect($scope.vm.addproduct._id).toBe(mockAddproduct._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/addproducts/client/views/form-addproduct.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
