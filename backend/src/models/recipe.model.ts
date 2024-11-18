import { v4 as uuidv4 } from 'uuid'
import { Meal } from '../shared/meals'

class MealModel {
  private recipes: Meal[] = []

  findAll(userId: string): Meal[] {
    const meals = this.recipes.filter(meal => meal.userId === userId)
    return meals
  }

  findById(idMeal: string): Meal | undefined {
    const meal = this.recipes.find(meal => meal.idMeal === idMeal)
    if (!meal) return undefined
    return meal
  }

  create(newData: Omit<Meal, 'idMeal'>): Meal {
    const newRecipe = {
        idMeal: uuidv4(),
      ...newData
    }
    this.recipes.push(newRecipe)
    return newRecipe
  }

  edit(idMeal: string, newData: Partial<Meal>): Meal | undefined {
    const index = this.recipes.findIndex(meal => meal.idMeal === idMeal)
    if (index === -1) return undefined
    if (this.recipes[index].userId !== newData.userId) return undefined
    const updatedMeal = {
      ...this.recipes[index],
      ...newData
    }
    this.recipes[index] = updatedMeal
    return updatedMeal
  }

  delete(idMeal: string, userId: string): boolean {
    const index = this.recipes.findIndex(meal => meal.idMeal === idMeal && meal.userId === userId)
    if (index === 1) return false
    this.recipes.splice(index, 1)
    return true
  }
}

export default new MealModel