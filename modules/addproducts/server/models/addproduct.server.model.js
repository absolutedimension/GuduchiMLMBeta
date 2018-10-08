'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Addproduct Schema
 */
var AddproductSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Addproduct name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Addproduct', AddproductSchema);
