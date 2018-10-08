'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Addproduct = mongoose.model('Addproduct'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Addproduct
 */
exports.create = function(req, res) {
  var addproduct = new Addproduct(req.body);
  addproduct.user = req.user;

  addproduct.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(addproduct);
    }
  });
};

/**
 * Show the current Addproduct
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var addproduct = req.addproduct ? req.addproduct.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  addproduct.isCurrentUserOwner = req.user && addproduct.user && addproduct.user._id.toString() === req.user._id.toString();

  res.jsonp(addproduct);
};

/**
 * Update a Addproduct
 */
exports.update = function(req, res) {
  var addproduct = req.addproduct;

  addproduct = _.extend(addproduct, req.body);

  addproduct.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(addproduct);
    }
  });
};

/**
 * Delete an Addproduct
 */
exports.delete = function(req, res) {
  var addproduct = req.addproduct;

  addproduct.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(addproduct);
    }
  });
};

/**
 * List of Addproducts
 */
exports.list = function(req, res) {
  Addproduct.find().sort('-created').populate('user', 'displayName').exec(function(err, addproducts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(addproducts);
    }
  });
};

/**
 * Addproduct middleware
 */
exports.addproductByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Addproduct is invalid'
    });
  }

  Addproduct.findById(id).populate('user', 'displayName').exec(function (err, addproduct) {
    if (err) {
      return next(err);
    } else if (!addproduct) {
      return res.status(404).send({
        message: 'No Addproduct with that identifier has been found'
      });
    }
    req.addproduct = addproduct;
    next();
  });
};
