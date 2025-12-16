import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Use service role key for migration (bypasses RLS)
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Fraction conversion map
const fractionMap: Record<number, string> = {
  0.25: '1/4',
  0.33: '1/3',
  0.5: '1/2',
  0.66: '2/3',
  0.75: '3/4',
}

function convertToFraction(num: number): string {
  // Check for exact matches
  if (fractionMap[num]) return fractionMap[num]

  // Check for close matches (within 0.01)
  for (const [decimal, fraction] of Object.entries(fractionMap)) {
    if (Math.abs(num - parseFloat(decimal)) < 0.01) {
      return fraction
    }
  }

  // Return as string if no fraction match
  return num.toString()
}

function convertTime(time: { value: number | null; unit: string } | undefined): string | null {
  if (!time || time.value === null || time.value === 0) return null
  return `${time.value} ${time.unit}`
}

interface OldRecipe {
  id: number
  name: string
  tagline: string
  servings?: number | string
  prepTime?: { value: number | null; unit: string }
  cookTime?: { value: number | null; unit: string }
  totalTime?: { value: number | null; unit: string }
  difficulty?: string
  ingredients?: Array<{
    item: string
    amount?: number
    unit?: string
    notes?: string
  }>
  instructions?: Array<{ step: number; text: string }>
  tags?: string[]
  equipment?: string[]
}

async function migrate() {
  // Read db.json
  const dbPath = path.join(process.cwd(), 'db.json')
  const dbContent = fs.readFileSync(dbPath, 'utf-8')
  const db = JSON.parse(dbContent)

  const oldRecipes: OldRecipe[] = db.recipes

  console.log(`Found ${oldRecipes.length} recipes to migrate`)

  let successCount = 0
  let errorCount = 0

  for (const oldRecipe of oldRecipes) {
    console.log(`Migrating: ${oldRecipe.name}`)

    try {
      // Insert recipe
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          name: oldRecipe.name,
          tagline: oldRecipe.tagline,
          servings: oldRecipe.servings?.toString() || null,
          prep_time: convertTime(oldRecipe.prepTime),
          cook_time: convertTime(oldRecipe.cookTime),
          total_time: convertTime(oldRecipe.totalTime),
          difficulty: oldRecipe.difficulty || 'easy',
          instructions: oldRecipe.instructions || [],
          equipment: oldRecipe.equipment || [],
          tags: oldRecipe.tags || [],
        })
        .select()
        .single()

      if (recipeError) {
        console.error(`Failed to insert recipe ${oldRecipe.name}:`, recipeError)
        errorCount++
        continue
      }

      // Insert ingredients
      if (oldRecipe.ingredients && oldRecipe.ingredients.length > 0) {
        const ingredients = oldRecipe.ingredients.map((ing, index) => ({
          recipe_id: recipe.id,
          item: ing.item,
          amount: ing.amount ? convertToFraction(ing.amount) : null,
          unit: ing.unit || null,
          sort_order: index,
        }))

        const { error: ingError } = await supabase
          .from('ingredients')
          .insert(ingredients)

        if (ingError) {
          console.error(`Failed to insert ingredients for ${oldRecipe.name}:`, ingError)
          errorCount++
          continue
        }
      }

      console.log(`  ✓ Migrated ${oldRecipe.name}`)
      successCount++
    } catch (error) {
      console.error(`Exception migrating ${oldRecipe.name}:`, error)
      errorCount++
    }
  }

  console.log('\n========================================')
  console.log('Migration complete!')
  console.log(`Success: ${successCount} recipes`)
  console.log(`Errors: ${errorCount} recipes`)
  console.log('========================================')
}

migrate().catch(console.error)
