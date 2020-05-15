const Recipe = require("../models/recipe");
const User = require("../models/user");

exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    const usersId = await User.find().distinct('_id')
    return res.status(200).json({
      recipes,
      usersId
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

exports.addRecipe = async (req, res) => {
  try {
    const file = req.files.file;
    const title = req.body.title;
    const description = req.body.description;
    const calorie = req.body.calorie;
    const cholesterol = req.body.cholesterol;
    const fiber = req.body.fiber;
    const fat = req.body.fat;
    const protein = req.body.protein;
    const ingredients = JSON.parse(req.body.ingredients);
    const creator = req.userId;
    const user = await User.findById({ _id: creator });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const recipe = new Recipe({
      title,
      description,
      calorie,
      cholesterol,
      fiber,
      fat,
      protein,
      ingredients,
      recipeImage: file.name,
      creator,
    });

    user.createdRecipes.push(recipe);
    await user.save();
    await recipe.save();
    // eslint-disable-next-line
    file.mv(`${__dirname}/../../client/public/uploads/${file.name}`, (err) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }
      return res.status(200).json({
        message: "Successfully added",
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

exports.getRecipeDetails = async (req, res) => {
  try {
    const id = req.params.recipeId;
    const recipe = await Recipe.findById({ _id: id });
    if(!recipe) {
      return res.status(500).json({
        error: "Something went wrong",
      });
    }
    const user = await User.findById({ _id: recipe.creator });
    if(!user) {
      return res.status(500).json({
        error: "Something went wrong",
      });
    }
    return res.status(200).json({
      recipe,
      user
    });
  } catch (err) {
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

exports.editRecipeDetails = async (req, res) => {
  try {
    const recipeId = req.body.recipeId;
    if(!recipeId) {
      return res.status(500).json({
        error: "Something went wrong",
      });
    }

    const recipe = await Recipe.findById({ _id: recipeId });

    if(recipe) {
      return res.status(200).json({
        success: "recipe found",
        recipeId
      });
    }

    return res.status(404).json({
      error: "Not found"
    });
  } catch (err) {
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
}

exports.saveEditRecipe = async (req, res) => {
  try {
    const recipeId = req.params.recipeId;
    const ingredients = JSON.parse(req.body.ingredients);
    const recipe = await Recipe.updateOne({_id: recipeId}, {$set: {
      title: req.body.title,
      description: req.body.description,
      calorie: req.body.calorie,
      cholesterol: req.body.cholesterol,
      fiber: req.body.fiber,
      fat: req.body.fat,
      protein: req.body.protein,
      ingredients
    }})
    return res.status(200).json({
      successMsg: "updated",
      recipe
    });
  } catch (err) {
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
}

exports.deleteRecipe = async (req, res) => {
  try {
    const recipeId = req.body.recipeId;

    if(!recipeId) {
      return res.status(500).json({
        error: "Something went wrong",
      });
    }

    const recipe = await Recipe.deleteOne({ _id: recipeId });
    if(!recipe) {
      return res.status(404).json({
        error: "No recipe found",
      });
    }

    return res.status(200).json({
      successMsg: "Successfully deleted",
    });
  } catch(err) {
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
}
