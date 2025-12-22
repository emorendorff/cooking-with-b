import { useState, useEffect } from 'react'
import { RecipeFormData, IngredientFormData, Instruction, Recipe } from './types'
import { getRecipes } from './lib/api'

interface RecipeFormProps {
  onSubmit: (recipe: RecipeFormData, ingredients: IngredientFormData[]) => void
  initialData?: RecipeFormData
  initialIngredients?: IngredientFormData[]
}

const emptyIngredient: IngredientFormData = {
  item: '',
  amount: '',
  unit: '',
  linked_recipe_id: null,
  isLinkedRecipe: false,
}

const emptyInstruction: Instruction = { step: 1, text: '' }

const initialFormData: RecipeFormData = {
  name: '',
  tagline: '',
  servings: '',
  prep_time: '',
  cook_time: '',
  total_time: '',
  difficulty: 'easy',
  instructions: [emptyInstruction],
  equipment: [''],
  tags: [''],
}

const RecipeForm = ({ onSubmit, initialData, initialIngredients }: RecipeFormProps) => {
  const [formData, setFormData] = useState<RecipeFormData>(initialData || initialFormData)
  const [ingredients, setIngredients] = useState<IngredientFormData[]>(
    initialIngredients || [emptyIngredient]
  )
  const [availableRecipes, setAvailableRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    getRecipes().then(setAvailableRecipes).catch(console.error)
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleIngredientChange = (index: number, field: keyof IngredientFormData, value: string | boolean) => {
    setIngredients(prev => prev.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    ))
  }

  const toggleIngredientType = (index: number) => {
    setIngredients(prev => prev.map((ing, i) =>
      i === index ? {
        ...ing,
        isLinkedRecipe: !ing.isLinkedRecipe,
        item: '',
        unit: '',
        linked_recipe_id: null,
      } : ing
    ))
  }

  const addIngredient = () => {
    setIngredients(prev => [...prev, emptyIngredient])
  }

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleInstructionChange = (index: number, text: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) =>
        i === index ? { ...inst, text } : inst
      ),
    }))
  }

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        { step: prev.instructions.length + 1, text: '' },
      ],
    }))
  }

  const removeInstruction = (index: number) => {
    if (formData.instructions.length > 1) {
      setFormData(prev => ({
        ...prev,
        instructions: prev.instructions
          .filter((_, i) => i !== index)
          .map((inst, i) => ({ ...inst, step: i + 1 })),
      }))
    }
  }

  const handleTagChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => (i === index ? value : tag)),
    }))
  }

  const addTag = () => {
    setFormData(prev => ({ ...prev, tags: [...prev.tags, ''] }))
  }

  const removeTag = (index: number) => {
    if (formData.tags.length > 1) {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.filter((_, i) => i !== index),
      }))
    }
  }

  const handleEquipmentChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.map((item, i) => (i === index ? value : item)),
    }))
  }

  const addEquipment = () => {
    setFormData(prev => ({ ...prev, equipment: [...prev.equipment, ''] }))
  }

  const removeEquipment = (index: number) => {
    if (formData.equipment.length > 1) {
      setFormData(prev => ({
        ...prev,
        equipment: prev.equipment.filter((_, i) => i !== index),
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData, ingredients)
  }

  const inputClass = "px-3 py-2 border border-tan rounded font-secondary text-sm"
  const selectClass = "px-3 py-2 border border-tan rounded font-secondary text-sm"
  const textareaClass = "px-3 py-2 border border-tan rounded-lg font-secondary text-sm min-h-[50px]"

  return (
    <div className="max-w-3xl mx-auto p-6 bg-cream rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-display font-semibold text-sm text-gray-700">
            Recipe Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="tagline" className="font-display font-semibold text-sm text-gray-700">
            Tagline
          </label>
          <input
            type="text"
            id="tagline"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="servings" className="font-display font-semibold text-sm text-gray-700">
            Servings
          </label>
          <input
            type="text"
            id="servings"
            name="servings"
            placeholder="e.g., 4 or 2-3"
            value={formData.servings}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="prep_time" className="font-display font-semibold text-sm text-gray-700">
            Prep Time
          </label>
          <input
            type="text"
            id="prep_time"
            name="prep_time"
            placeholder="e.g., 20 minutes, overnight"
            value={formData.prep_time}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cook_time" className="font-display font-semibold text-sm text-gray-700">
            Cook Time
          </label>
          <input
            type="text"
            id="cook_time"
            name="cook_time"
            placeholder="e.g., 30 minutes"
            value={formData.cook_time}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="difficulty" className="font-display font-semibold text-sm text-gray-700">
            Difficulty
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className={selectClass}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-display font-semibold text-sm text-gray-700">Ingredients</label>
          <div className="flex flex-col gap-3">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 items-center flex-wrap">
                <button
                  type="button"
                  onClick={() => toggleIngredientType(index)}
                  className={`border-none rounded px-2 py-1 text-xs cursor-pointer ${
                    ingredient.isLinkedRecipe ? 'bg-burgundy text-white' : 'bg-tan text-gray-700'
                  }`}
                >
                  {ingredient.isLinkedRecipe ? 'Recipe Link' : 'Ingredient'}
                </button>

                {ingredient.isLinkedRecipe ? (
                  <>
                    <input
                      type="text"
                      placeholder="Amount (e.g., 1 batch)"
                      value={ingredient.amount}
                      onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                      className={`${inputClass} w-[120px]`}
                    />
                    <select
                      value={ingredient.linked_recipe_id || ''}
                      onChange={(e) => handleIngredientChange(index, 'linked_recipe_id', e.target.value)}
                      className={`${selectClass} flex-1`}
                    >
                      <option value="">Select a recipe...</option>
                      {availableRecipes.map((recipe) => (
                        <option key={recipe.id} value={recipe.id}>
                          {recipe.name}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Item"
                      value={ingredient.item}
                      onChange={(e) => handleIngredientChange(index, 'item', e.target.value)}
                      className={`${inputClass} flex-[2]`}
                      required={!ingredient.isLinkedRecipe}
                    />
                    <input
                      type="text"
                      placeholder="Amount"
                      value={ingredient.amount}
                      onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                      className={`${inputClass} w-20`}
                    />
                    <input
                      type="text"
                      placeholder="Unit"
                      value={ingredient.unit}
                      onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                      className={`${inputClass} w-20`}
                    />
                  </>
                )}

                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  disabled={ingredients.length === 1}
                  className="bg-copper text-white border-none rounded px-2 py-1 text-xs cursor-pointer disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addIngredient}
            className="bg-tan text-gray-700 border-none rounded px-3 py-2 text-sm mt-2 cursor-pointer self-start"
          >
            Add Ingredient
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-display font-semibold text-sm text-gray-700">Instructions</label>
          <div className="flex flex-col gap-3">
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-2 items-center flex-wrap">
                <span className="min-w-[30px] text-center">{instruction.step}.</span>
                <textarea
                  placeholder="Instruction step"
                  value={instruction.text}
                  onChange={(e) => handleInstructionChange(index, e.target.value)}
                  className={`${textareaClass} flex-1`}
                  required
                />
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  disabled={formData.instructions.length === 1}
                  className="bg-copper text-white border-none rounded px-2 py-1 text-xs cursor-pointer disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addInstruction}
            className="bg-tan text-gray-700 border-none rounded px-3 py-2 text-sm mt-2 cursor-pointer self-start"
          >
            Add Instruction
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-display font-semibold text-sm text-gray-700">Tags</label>
          <div className="flex flex-col gap-3">
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Tag"
                  value={tag}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                  className={`${inputClass} flex-1`}
                />
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  disabled={formData.tags.length === 1}
                  className="bg-copper text-white border-none rounded px-2 py-1 text-xs cursor-pointer disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addTag}
            className="bg-tan text-gray-700 border-none rounded px-3 py-2 text-sm mt-2 cursor-pointer self-start"
          >
            Add Tag
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-display font-semibold text-sm text-gray-700">Equipment</label>
          <div className="flex flex-col gap-3">
            {formData.equipment.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Equipment item"
                  value={item}
                  onChange={(e) => handleEquipmentChange(index, e.target.value)}
                  className={`${inputClass} flex-1`}
                />
                <button
                  type="button"
                  onClick={() => removeEquipment(index)}
                  disabled={formData.equipment.length === 1}
                  className="bg-copper text-white border-none rounded px-2 py-1 text-xs cursor-pointer disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addEquipment}
            className="bg-tan text-gray-700 border-none rounded px-3 py-2 text-sm mt-2 cursor-pointer self-start"
          >
            Add Equipment
          </button>
        </div>

        <button
          type="submit"
          className="bg-burgundy text-white border-none rounded px-6 py-3 font-display font-semibold text-base cursor-pointer transition-colors hover:bg-burgundy-hover"
        >
          Submit Recipe
        </button>
      </form>
    </div>
  )
}

export default RecipeForm
