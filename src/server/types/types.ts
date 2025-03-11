export interface Recipe {
  id: number;
  name: string;
  tagline: string;
  ingredients?: {
    item: string;
    amount: number;
    unit: string;
    notes?: string;
  }[];
}

export interface RecipeData {
  recipes: Recipe[];
}