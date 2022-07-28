const mongoose = require("mongoose");

let reviewsSchema = mongoose.Schema({
  review_id: Number,
  rating: Number,
  summary: String,
  recommend: Boolean,
  response: String,
  body: String,
  date: Date,
  reviewer_name: String,
  helpfulness: Number,
  photos: []
});

let metadataSchema = mongoose.Schema({
  product_id: Number,
  ratings: {},
  recommended: {},
  characteristics: {}
});

let repoSchema = mongoose.Schema({
  product_id: Number,
  result: [reviewsSchema]
});