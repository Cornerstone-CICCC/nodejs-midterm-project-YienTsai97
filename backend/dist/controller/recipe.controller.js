"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const recipe_model_1 = __importDefault(require("../models/recipe.model"));
// Get all recipes
const getRecipes = (req, res) => {
    const { userId } = req.session;
    const recipes = recipe_model_1.default.findAll(userId);
    res.json(recipes);
};
// Get recipe by idMeal
const getRecipesById = (req, res) => {
    const { idMeal } = req.params;
    const recipe = recipe_model_1.default.findById(idMeal);
    if (!recipe) {
        res.status(404).json({ message: 'Recipe not found' });
        return;
    }
    res.json(recipe);
};
// Add recipe
const addRecipe = (req, res) => {
    const { userId } = req.session;
    const mealData = req.body;
    if (!mealData.strMeal || !userId) {
        res.status(400).json({ message: 'Missing meal title or user id' });
        return;
    }
    const recipe = recipe_model_1.default.create(Object.assign(Object.assign({}, mealData), { userId }));
    res.status(201).json(recipe);
};
// Update recipe by idMeal
const updateRecipeById = (req, res) => {
    const { userId } = req.session;
    const { idMeal } = req.params;
    const mealData = req.body;
    const recipe = recipe_model_1.default.edit(idMeal, Object.assign(Object.assign({}, mealData), { userId }));
    if (!recipe) {
        res.status(404).json({ message: "Recipe not found" });
        return;
    }
    res.json(recipe);
};
// Delete recipes by idMeal
const deleteRecipeById = (req, res) => {
    const { userId } = req.session;
    const { idMeal } = req.params;
    const response = recipe_model_1.default.delete(idMeal, userId);
    if (!response) {
        res.status(404).json({ message: "Recipe not found" });
        return;
    }
    res.status(204).send();
};
exports.default = {
    getRecipes,
    getRecipesById,
    addRecipe,
    updateRecipeById,
    deleteRecipeById
};
