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

export async function getRecipes(): Promise<RecipeWithRelations[]> {
  try {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY

    // Fetch recipes with their images
    const response = await fetch(
      `${url}/rest/v1/recipes?select=*,images(*)&order=created_at.desc`,
      {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
        }
      }
    )
    const data = await response.json()

    // Filter to only recipes that have at least one image
    const recipesWithImages = data.filter(
      (recipe: RecipeWithRelations) => recipe.images && recipe.images.length > 0
    )

    return recipesWithImages as RecipeWithRelations[]
  } catch (err) {
    console.error('API: Direct fetch error', err)
    throw err
  }
}

export async function getRecipe(id: string): Promise<RecipeWithRelations> {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  const headers = {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
  }

  // Fetch recipe
  const recipeRes = await fetch(`${url}/rest/v1/recipes?id=eq.${id}&select=*`, { headers })
  if (!recipeRes.ok) throw new Error('Failed to fetch recipe')
  const recipes = await recipeRes.json()
  if (recipes.length === 0) throw new Error('Recipe not found')
  const recipe = recipes[0]

  // Fetch ingredients
  const ingRes = await fetch(`${url}/rest/v1/ingredients?recipe_id=eq.${id}&select=*&order=sort_order`, { headers })
  const ingredients = ingRes.ok ? await ingRes.json() : []

  // Fetch linked recipe names for ingredients that have linked_recipe_id
  const linkedIds = ingredients.filter((i: { linked_recipe_id: string | null }) => i.linked_recipe_id).map((i: { linked_recipe_id: string }) => i.linked_recipe_id)
  let linkedRecipes: Record<string, { id: string; name: string }> = {}
  if (linkedIds.length > 0) {
    const linkedRes = await fetch(`${url}/rest/v1/recipes?id=in.(${linkedIds.join(',')})&select=id,name`, { headers })
    if (linkedRes.ok) {
      const linked = await linkedRes.json()
      linkedRecipes = Object.fromEntries(linked.map((r: { id: string; name: string }) => [r.id, r]))
    }
  }

  // Add linked_recipe to ingredients
  const ingredientsWithLinked = ingredients.map((ing: { linked_recipe_id: string | null }) => ({
    ...ing,
    linked_recipe: ing.linked_recipe_id ? linkedRecipes[ing.linked_recipe_id] : null
  }))

  // Fetch images
  const imgRes = await fetch(`${url}/rest/v1/images?recipe_id=eq.${id}&select=*&order=sort_order`, { headers })
  const images = imgRes.ok ? await imgRes.json() : []

  // Fetch reviews
  const revRes = await fetch(`${url}/rest/v1/reviews?recipe_id=eq.${id}&select=*&order=created_at.desc`, { headers })
  const reviews = revRes.ok ? await revRes.json() : []

  // Fetch profile names for reviews
  const userIds = reviews.map((r: { user_id: string }) => r.user_id)
  let profiles: Record<string, { display_name: string }> = {}
  if (userIds.length > 0) {
    const profileRes = await fetch(`${url}/rest/v1/profiles?id=in.(${userIds.join(',')})&select=id,display_name`, { headers })
    if (profileRes.ok) {
      const profileData = await profileRes.json()
      profiles = Object.fromEntries(profileData.map((p: { id: string; display_name: string }) => [p.id, p]))
    }
  }

  // Add profile to reviews
  const reviewsWithProfile = reviews.map((rev: { user_id: string }) => ({
    ...rev,
    profile: profiles[rev.user_id] || null
  }))

  // Calculate average rating
  const average_rating = reviews.length > 0
    ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
    : undefined

  return {
    ...recipe,
    ingredients: ingredientsWithLinked,
    images: images as RecipeImage[],
    reviews: reviewsWithProfile as Review[],
    average_rating,
  } as RecipeWithRelations
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
