import { supabase } from './supabase'
import type {
  Recipe,
  RecipeWithRelations,
  RecipeImage,
  Review,
  RecipeFormData,
  IngredientFormData,
} from '../types'

// ============ RECIPES ============

export async function getRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as unknown as Recipe[]
}

export async function getRecipe(id: string): Promise<RecipeWithRelations> {
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single()

  if (recipeError) throw recipeError

  // Fetch ingredients with linked recipe names
  const { data: ingredients, error: ingError } = await supabase
    .from('ingredients')
    .select(`
      *,
      linked_recipe:recipes!ingredients_linked_recipe_id_fkey (id, name)
    `)
    .eq('recipe_id', id)
    .order('sort_order')

  if (ingError) throw ingError

  // Fetch images
  const { data: images, error: imgError } = await supabase
    .from('images')
    .select('*')
    .eq('recipe_id', id)
    .order('sort_order')

  if (imgError) throw imgError

  // Fetch reviews with profile names
  const { data: reviews, error: revError } = await supabase
    .from('reviews')
    .select(`
      *,
      profile:user_id (display_name)
    `)
    .eq('recipe_id', id)
    .order('created_at', { ascending: false })

  if (revError) throw revError

  // Calculate average rating
  const average_rating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : undefined

  return {
    ...recipe,
    ingredients: (ingredients || []) as unknown as any,
    images: (images || []) as unknown as RecipeImage[],
    reviews: (reviews || []) as unknown as Review[],
    average_rating,
  } as unknown as RecipeWithRelations
}

export async function createRecipe(
  formData: RecipeFormData,
  ingredients: IngredientFormData[]
): Promise<Recipe> {
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .insert({
      name: formData.name,
      tagline: formData.tagline || null,
      servings: formData.servings || null,
      prep_time: formData.prep_time || null,
      cook_time: formData.cook_time || null,
      total_time: formData.total_time || null,
      difficulty: formData.difficulty,
      instructions: formData.instructions as unknown as any,
      equipment: formData.equipment.filter(e => e.trim()),
      tags: formData.tags.filter(t => t.trim()),
    })
    .select()
    .single()

  if (recipeError) throw recipeError

  // Insert ingredients
  if (ingredients.length > 0) {
    const ingredientRows = ingredients.map((ing, index) => ({
      recipe_id: recipe.id,
      item: ing.isLinkedRecipe ? null : ing.item,
      amount: ing.amount || null,
      unit: ing.isLinkedRecipe ? null : (ing.unit || null),
      linked_recipe_id: ing.isLinkedRecipe ? ing.linked_recipe_id : null,
      sort_order: index,
    }))

    const { error: ingError } = await supabase
      .from('ingredients')
      .insert(ingredientRows)

    if (ingError) throw ingError
  }

  return recipe as unknown as Recipe
}

export async function updateRecipe(
  id: string,
  formData: RecipeFormData,
  ingredients: IngredientFormData[]
): Promise<Recipe> {
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .update({
      name: formData.name,
      tagline: formData.tagline || null,
      servings: formData.servings || null,
      prep_time: formData.prep_time || null,
      cook_time: formData.cook_time || null,
      total_time: formData.total_time || null,
      difficulty: formData.difficulty,
      instructions: formData.instructions as unknown as any,
      equipment: formData.equipment.filter(e => e.trim()),
      tags: formData.tags.filter(t => t.trim()),
    })
    .eq('id', id)
    .select()
    .single()

  if (recipeError) throw recipeError

  // Delete old ingredients and insert new ones
  await supabase.from('ingredients').delete().eq('recipe_id', id)

  if (ingredients.length > 0) {
    const ingredientRows = ingredients.map((ing, index) => ({
      recipe_id: id,
      item: ing.isLinkedRecipe ? null : ing.item,
      amount: ing.amount || null,
      unit: ing.isLinkedRecipe ? null : (ing.unit || null),
      linked_recipe_id: ing.isLinkedRecipe ? ing.linked_recipe_id : null,
      sort_order: index,
    }))

    const { error: ingError } = await supabase
      .from('ingredients')
      .insert(ingredientRows)

    if (ingError) throw ingError
  }

  return recipe as unknown as Recipe
}

export async function deleteRecipe(id: string): Promise<void> {
  // Check if recipe is linked as ingredient elsewhere
  const { data: linkedUsage } = await supabase
    .from('ingredients')
    .select('recipe_id, recipes!ingredients_recipe_id_fkey(name)')
    .eq('linked_recipe_id', id)

  if (linkedUsage && linkedUsage.length > 0) {
    const recipeNames = linkedUsage.map((l: Record<string, unknown>) => (l.recipes as any)?.name).join(', ')
    throw new Error(`Cannot delete: recipe is used as ingredient in: ${recipeNames}`)
  }

  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============ SEARCH ============

export async function searchRecipes(query: string): Promise<Recipe[]> {
  if (!query.trim()) return getRecipes()

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .textSearch('fts', query, { type: 'websearch' })
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as unknown as Recipe[]
}

export async function getRecipesByTag(tag: string): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .contains('tags', [tag])
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as unknown as Recipe[]
}

export async function getAllTags(): Promise<string[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('tags')

  if (error) throw error

  const allTags = new Set<string>()
  data.forEach(recipe => {
    recipe.tags?.forEach(tag => allTags.add(tag))
  })

  return Array.from(allTags).sort()
}

// ============ IMAGES ============

export async function uploadRecipeImage(
  recipeId: string,
  file: File
): Promise<RecipeImage> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${recipeId}/${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('recipe-images')
    .upload(fileName, file)

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('recipe-images')
    .getPublicUrl(fileName)

  // Get current max sort_order
  const { data: existing } = await supabase
    .from('images')
    .select('sort_order')
    .eq('recipe_id', recipeId)
    .order('sort_order', { ascending: false })
    .limit(1)

  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0

  const { data: image, error: dbError } = await supabase
    .from('images')
    .insert({
      recipe_id: recipeId,
      url: publicUrl,
      sort_order: nextOrder,
    })
    .select()
    .single()

  if (dbError) throw dbError
  return image as unknown as RecipeImage
}

export async function updateImageRole(
  imageId: string,
  role: 'primary' | 'secondary' | null
): Promise<void> {
  // If setting as primary, clear any existing primary
  if (role === 'primary') {
    const { data: image } = await supabase
      .from('images')
      .select('recipe_id')
      .eq('id', imageId)
      .single()

    if (image) {
      await supabase
        .from('images')
        .update({ role: null })
        .eq('recipe_id', image.recipe_id)
        .eq('role', 'primary')
    }
  }

  const { error } = await supabase
    .from('images')
    .update({ role })
    .eq('id', imageId)

  if (error) throw error
}

export async function deleteImage(imageId: string, url: string): Promise<void> {
  // Extract path from URL
  const urlParts = url.split('/recipe-images/')
  if (urlParts.length > 1) {
    await supabase.storage.from('recipe-images').remove([urlParts[1]])
  }

  const { error } = await supabase
    .from('images')
    .delete()
    .eq('id', imageId)

  if (error) throw error
}

// ============ REVIEWS ============

export async function createReview(
  recipeId: string,
  rating: number,
  comment: string | null
): Promise<Review> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Must be logged in to review')

  const { data, error } = await supabase
    .from('reviews')
    .upsert({
      recipe_id: recipeId,
      user_id: user.id,
      rating,
      comment,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteReview(reviewId: string): Promise<void> {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)

  if (error) throw error
}

// ============ AUTH ============

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signUp(email: string, password: string, displayName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
    },
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { user, profile }
}
