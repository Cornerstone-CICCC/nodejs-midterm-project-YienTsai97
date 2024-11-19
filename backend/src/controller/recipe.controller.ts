import { Request, Response } from 'express'
import recipeModel from '../models/recipe.model'
import { Meal } from '../shared/meals'

// Get all recipes
const getRecipes = (req: Request, res: Response): void => {
  const { userId } = req.session
  const recipes = recipeModel.findAll(userId)
  res.json(recipes)
}

// Get recipe by idMeal
const getRecipesById = (req: Request<{ idMeal: string }>, res: Response): void => {
  const { idMeal } = req.params
  const recipe = recipeModel.findById(idMeal)
  if (!recipe) {
    res.status(404).json({ message: 'Recipe not found' })
    return
  }
  res.json(recipe)
}

// Add recipe
const addRecipe = (req: Request<{}, {}, Omit<Meal, 'idMeal'>>, res: Response): void => {
  const { userId } = req.session
  const mealData = req.body
  if (!mealData.strMeal || !userId) {
    res.status(400).json({ message: 'Missing meal title or user id' })
    return
  }
  const recipe = recipeModel.create({ ...mealData, userId })
  res.status(201).json(recipe)
}

// Update recipe by idMeal
const updateRecipeById = (req: Request<{ idMeal: string }, {}, Partial<Meal>>, res: Response): void => {
  const { userId } = req.session
  const { idMeal } = req.params
  const mealData = req.body
  const recipe = recipeModel.edit(idMeal, { ...mealData, userId })
  if (!recipe) {
    res.status(404).json({ message: "Recipe not found" })
    return
  }
  res.json(recipe)
}

// Delete recipes by idMeal
const deleteRecipeById = (req: Request<{ idMeal: string }>, res: Response) => {
  const { userId } = req.session
  const { idMeal } = req.params
  const response = recipeModel.delete(idMeal, userId)
  if (!response) {
    res.status(404).json({ message: "Recipe not found" })
    return
  }
  res.status(204).send()
}

export default {
    getRecipes,
    getRecipesById,
    addRecipe,
    updateRecipeById,
    deleteRecipeById
}