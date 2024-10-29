import express from 'express';

import recipeControllers from '../controllers/recipe.js';

const { getAllRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe } =
recipeControllers;

const router = express.Router();

// routes
router.get('recipes', getAllRecipes);
router.get('/recipes/:id', getRecipe);
router.post('/recipes', createRecipe);
router.put('/recipes/:id', updateRecipe);
router.delete('/recipes/:id', deleteRecipe);

export default router;
