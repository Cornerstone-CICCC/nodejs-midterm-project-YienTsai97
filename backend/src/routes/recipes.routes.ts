import { Router, Request, Response } from "express";
import { checkAuth } from "../middleware/auth";

import recipeController from "../controller/recipe.controller";
const recipeRouter = Router()

recipeRouter.post('/add', checkAuth, recipeController.addRecipe)
recipeRouter.delete('/delete/:id',checkAuth, recipeController.deleteRecipeById)
recipeRouter.get('/', checkAuth, recipeController.getRecipes)


export default recipeRouter