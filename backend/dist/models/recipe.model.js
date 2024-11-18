"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class MealModel {
    constructor() {
        this.recipes = [];
    }
    findAll(userId) {
        const meals = this.recipes.filter(meal => meal.userId === userId);
        return meals;
    }
    findById(idMeal) {
        const meal = this.recipes.find(meal => meal.idMeal === idMeal);
        if (!meal)
            return undefined;
        return meal;
    }
    create(newData) {
        const newRecipe = Object.assign({ idMeal: (0, uuid_1.v4)() }, newData);
        this.recipes.push(newRecipe);
        return newRecipe;
    }
    edit(idMeal, newData) {
        const index = this.recipes.findIndex(meal => meal.idMeal === idMeal);
        if (index === -1)
            return undefined;
        if (this.recipes[index].userId !== newData.userId)
            return undefined;
        const updatedMeal = Object.assign(Object.assign({}, this.recipes[index]), newData);
        this.recipes[index] = updatedMeal;
        return updatedMeal;
    }
    delete(idMeal, userId) {
        const index = this.recipes.findIndex(meal => meal.idMeal === idMeal && meal.userId === userId);
        if (index === 1)
            return false;
        this.recipes.splice(index, 1);
        return true;
    }
}
exports.default = new MealModel;
