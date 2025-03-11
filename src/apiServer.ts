import { Recipe } from './recipes';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api/recipes' 
  : 'http://localhost:3001/recipes';

export const recipeApi = {
  /**
   * Get all recipes
   */
  async getRecipes(): Promise<Recipe[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Error fetching recipes: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      throw error;
    }
  },

  /**
   * Get a single recipe by ID
   */
  async getRecipe(id: number): Promise<Recipe> {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`Error fetching recipe: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error(`Failed to fetch recipe ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new recipe
   */
  async createRecipe(recipe: Omit<Recipe, 'id'>): Promise<Recipe> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      });
      
      if (!response.ok) {
        throw new Error(`Error creating recipe: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to create recipe:', error);
      throw error;
    }
  },

  /**
   * Update an existing recipe
   */
  async updateRecipe(id: number, recipe: Partial<Recipe>): Promise<Recipe> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH', // or 'PUT' if replacing the entire resource
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      });
      
      if (!response.ok) {
        throw new Error(`Error updating recipe: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error(`Failed to update recipe ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a recipe
   */
  async deleteRecipe(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error deleting recipe: ${response.status}`);
      }
    } catch (error) {
      console.error(`Failed to delete recipe ${id}:`, error);
      throw error;
    }
  }
};