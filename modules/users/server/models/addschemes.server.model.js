'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var JoiningSchemes = new Schema({
  joining_pair: {
    type: Number
  },
  cashback: {
    type: Number,

  },
  gift: {
    type:String,
  },
  InsteadGift: {
    type: Number,

  },

});

mongoose.model('JoiningSchemes', JoiningSchemes);