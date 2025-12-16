import { createClient } from '@supabase/supabase-js'

// Use service role key for verification
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function verify() {
  console.log('Verifying migration...\n')

  // Check recipes
  const { data: recipes, error: recipeError } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: true })

  if (recipeError) {
    console.error('Error fetching recipes:', recipeError)
    return
  }

  console.log(`Found ${recipes.length} recipes in Supabase:\n`)

  for (const recipe of recipes) {
    console.log(`- ${recipe.name}`)
    console.log(`  ID: ${recipe.id}`)
    console.log(`  Tagline: ${recipe.tagline}`)
    console.log(`  Servings: ${recipe.servings}`)
    console.log(`  Prep Time: ${recipe.prep_time}`)
    console.log(`  Cook Time: ${recipe.cook_time}`)
    console.log(`  Difficulty: ${recipe.difficulty}`)
    console.log(`  Tags: ${recipe.tags?.join(', ')}`)

    // Check ingredients for this recipe
    const { data: ingredients, error: ingError } = await supabase
      .from('ingredients')
      .select('*')
      .eq('recipe_id', recipe.id)
      .order('sort_order')

    if (ingError) {
      console.error(`  Error fetching ingredients:`, ingError)
    } else {
      console.log(`  Ingredients (${ingredients.length}):`)
      for (const ing of ingredients) {
        console.log(`    - ${ing.amount || ''} ${ing.unit || ''} ${ing.item || ''}`.trim())
      }
    }
    console.log('')
  }

  console.log('========================================')
  console.log('Verification complete!')
  console.log(`Total recipes: ${recipes.length}`)
  console.log('========================================')
}

verify().catch(console.error)
