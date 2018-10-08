'use strict';

/**
 * Module dependencies
 */
var addproductsPolicy = require('../policies/addproducts.server.policy'),
  addproducts = require('../controllers/addproducts.server.controller');

module.exports = function(app) {
  // Addproducts Routes
  app.route('/api/addproducts').all(addproductsPolicy.isAllowed)
    .get(addproducts.list)
    .post(addproducts.create);

  app.route('/api/addproducts/:addproductId').all(addproductsPolicy.isAllowed)
    .get(addproducts.read)
    .put(addproducts.update)
    .delete(addproducts.delete);

  // Finish by binding the Addproduct middleware
  app.param('addproductId', addproducts.addproductByID);
};
