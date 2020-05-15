const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  recipeImage: {
    type: String,
    required: false,
  },
  calorie: {
    type: String,
    required: false,
  },
  cholesterol: {
    type: String,
    required: false,
  },
  fiber: {
    type: String,
    required: false,
  },
  fat: {
    type: String,
    required: false,
  },
  protein: {
    type: String,
    required: false,
  },
  ingredients: [
    {
      key: String,
      value: String,
    },
  ],
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
