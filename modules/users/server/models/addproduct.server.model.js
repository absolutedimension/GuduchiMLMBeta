'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var AddProducts = new Schema({
  product_name: {
    type: Number
  },
  product_specifications: {
    type: Number,

  },
  price: {
    type:String,
  },
  fixed_money: {
    type: Number,

  },

  emi_per_month: {
    type: Number,

  },
});

mongoose.model('AddProducts', AddProducts);