const express = require("express");

const checkAuth = require("../middlewares/check-auth");
const router = express.Router();
const recipeController = require("../controllers/recipes");

router.post("/", recipeController.getRecipes);

router.post("/addRecipe", checkAuth, recipeController.addRecipe);
router.get("/:recipeId", recipeController.getRecipeDetails);
router.post("/:recipeId", recipeController.editRecipeDetails);
router.put("/saveRecipe/:recipeId", recipeController.saveEditRecipe)

router.delete("/delete-recipe", recipeController.deleteRecipe);

module.exports = router;
