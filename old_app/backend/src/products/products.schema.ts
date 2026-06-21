import * as mongoose from 'mongoose';

export const ProductWebSchema = new mongoose.Schema({

  active: Boolean,
  name: String,
  description: String,
  img_url: String,
  category: String,
  hit: Boolean,
  id: String,
  available: Number,
  top_effect: String,
  top_flavour: String,
  price_tag: String,
  type: String

});
