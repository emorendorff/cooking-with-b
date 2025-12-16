// Database types (matches Supabase schema)
export interface Recipe {
  id: string
  name: string
  tagline: string | null
  servings: string | null
  prep_time: string | null
  cook_time: string | null
  total_time: string | null
  difficulty: 'easy' | 'medium' | 'hard' | null
  instructions: Instruction[]
  equipment: string[]
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Instruction {
  step: number
  text: string
}

export interface Ingredient {
  id: string
  recipe_id: string
  item: string | null
  amount: string | null
  unit: string | null
  linked_recipe_id: string | null
  sort_order: number
  // Joined data (when fetching with linked recipe)
  linked_recipe?: Pick<Recipe, 'id' | 'name'> | null
}

export interface RecipeImage {
  id: string
  recipe_id: string
  url: string
  role: 'primary' | 'secondary' | null
  sort_order: number
}

export interface Profile {
  id: string
  display_name: string | null
  is_admin: boolean
  created_at: string
}

export interface Review {
  id: string
  recipe_id: string
  user_id: string
  rating: number
  comment: string | null
  created_at: string
  // Joined data
  profile?: Pick<Profile, 'display_name'> | null
}

// Extended recipe with all related data
export interface RecipeWithRelations extends Recipe {
  ingredients: Ingredient[]
  images: RecipeImage[]
  reviews?: Review[]
  average_rating?: number
}

// Form types (for creating/editing)
export interface RecipeFormData {
  name: string
  tagline: string
  servings: string
  prep_time: string
  cook_time: string
  total_time: string
  difficulty: 'easy' | 'medium' | 'hard'
  instructions: Instruction[]
  equipment: string[]
  tags: string[]
}

export interface IngredientFormData {
  item: string
  amount: string
  unit: string
  linked_recipe_id: string | null
  isLinkedRecipe: boolean
}
