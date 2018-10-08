'use strict';

describe('Addproducts E2E Tests:', function () {
  describe('Test Addproducts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/addproducts');
      expect(element.all(by.repeater('addproduct in addproducts')).count()).toEqual(0);
    });
  });
});
