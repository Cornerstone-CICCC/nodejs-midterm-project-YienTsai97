"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const recipe_controller_1 = __importDefault(require("../controller/recipe.controller"));
const recipeRouter = (0, express_1.Router)();
recipeRouter.post('/add', auth_1.checkAuth, recipe_controller_1.default.addRecipe);
recipeRouter.delete('/delete/:id', auth_1.checkAuth, recipe_controller_1.default.deleteRecipeById);
recipeRouter.get('/', auth_1.checkAuth, recipe_controller_1.default.getRecipes);
exports.default = recipeRouter;
