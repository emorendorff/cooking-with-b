import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { RecipeFormData, IngredientFormData, Instruction, Recipe } from './types'
import { getRecipes } from './lib/api'

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  background-color: #f4f1e1;
  border-radius: 8px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.label`
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 14px;
  color: #484848;
`

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #c6b7a8;
  border-radius: 4px;
  font-family: var(--font-secondary);
  font-size: 14px;
`

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #c6b7a8;
  border-radius: 4px;
  font-family: var(--font-secondary);
  font-size: 14px;
`

const TextArea = styled.textarea`
  padding: 8px 12px;
  border: 1px solid #c6b7a8;
  border-radius: 8px;
  font-family: var(--font-secondary);
  font-size: 14px;
  min-height: 50px;
`

const Button = styled.button`
  background-color: #6a0d2b;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #8a1d3b;
  }
`

const DynamicFieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const DynamicField = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`

const RemoveButton = styled.button`
  background-color: #d18b4f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
`

const AddButton = styled.button`
  background-color: #c6b7a8;
  color: #484848;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  margin-top: 8px;
  cursor: pointer;
  align-self: flex-start;
`

const ToggleButton = styled.button<{ $active: boolean }>`
  background-color: ${props => props.$active ? '#6a0d2b' : '#c6b7a8'};
  color: ${props => props.$active ? 'white' : '#484848'};
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
`

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

  // Ingredient handlers
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

  // Instruction handlers
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

  // Tag handlers
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

  // Equipment handlers
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

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Recipe Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            type="text"
            id="tagline"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="servings">Servings</Label>
          <Input
            type="text"
            id="servings"
            name="servings"
            placeholder="e.g., 4 or 2-3"
            value={formData.servings}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="prep_time">Prep Time</Label>
          <Input
            type="text"
            id="prep_time"
            name="prep_time"
            placeholder="e.g., 20 minutes, overnight"
            value={formData.prep_time}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="cook_time">Cook Time</Label>
          <Input
            type="text"
            id="cook_time"
            name="cook_time"
            placeholder="e.g., 30 minutes"
            value={formData.cook_time}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Ingredients</Label>
          <DynamicFieldsContainer>
            {ingredients.map((ingredient, index) => (
              <DynamicField key={index}>
                <ToggleButton
                  type="button"
                  $active={ingredient.isLinkedRecipe}
                  onClick={() => toggleIngredientType(index)}
                >
                  {ingredient.isLinkedRecipe ? 'Recipe Link' : 'Ingredient'}
                </ToggleButton>

                {ingredient.isLinkedRecipe ? (
                  <>
                    <Input
                      type="text"
                      placeholder="Amount (e.g., 1 batch)"
                      value={ingredient.amount}
                      onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                      style={{ width: '120px' }}
                    />
                    <Select
                      value={ingredient.linked_recipe_id || ''}
                      onChange={(e) => handleIngredientChange(index, 'linked_recipe_id', e.target.value)}
                      style={{ flex: 1 }}
                    >
                      <option value="">Select a recipe...</option>
                      {availableRecipes.map((recipe) => (
                        <option key={recipe.id} value={recipe.id}>
                          {recipe.name}
                        </option>
                      ))}
                    </Select>
                  </>
                ) : (
                  <>
                    <Input
                      type="text"
                      placeholder="Item"
                      value={ingredient.item}
                      onChange={(e) => handleIngredientChange(index, 'item', e.target.value)}
                      style={{ flex: 2 }}
                      required={!ingredient.isLinkedRecipe}
                    />
                    <Input
                      type="text"
                      placeholder="Amount"
                      value={ingredient.amount}
                      onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                      style={{ width: '80px' }}
                    />
                    <Input
                      type="text"
                      placeholder="Unit"
                      value={ingredient.unit}
                      onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                      style={{ width: '80px' }}
                    />
                  </>
                )}

                <RemoveButton
                  type="button"
                  onClick={() => removeIngredient(index)}
                  disabled={ingredients.length === 1}
                >
                  Remove
                </RemoveButton>
              </DynamicField>
            ))}
          </DynamicFieldsContainer>
          <AddButton type="button" onClick={addIngredient}>
            Add Ingredient
          </AddButton>
        </FormGroup>

        <FormGroup>
          <Label>Instructions</Label>
          <DynamicFieldsContainer>
            {formData.instructions.map((instruction, index) => (
              <DynamicField key={index}>
                <span style={{ minWidth: '30px', textAlign: 'center' }}>
                  {instruction.step}.
                </span>
                <TextArea
                  placeholder="Instruction step"
                  value={instruction.text}
                  onChange={(e) => handleInstructionChange(index, e.target.value)}
                  style={{ flex: 1 }}
                  required
                />
                <RemoveButton
                  type="button"
                  onClick={() => removeInstruction(index)}
                  disabled={formData.instructions.length === 1}
                >
                  Remove
                </RemoveButton>
              </DynamicField>
            ))}
          </DynamicFieldsContainer>
          <AddButton type="button" onClick={addInstruction}>
            Add Instruction
          </AddButton>
        </FormGroup>

        <FormGroup>
          <Label>Tags</Label>
          <DynamicFieldsContainer>
            {formData.tags.map((tag, index) => (
              <DynamicField key={index}>
                <Input
                  type="text"
                  placeholder="Tag"
                  value={tag}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                  style={{ flex: 1 }}
                />
                <RemoveButton
                  type="button"
                  onClick={() => removeTag(index)}
                  disabled={formData.tags.length === 1}
                >
                  Remove
                </RemoveButton>
              </DynamicField>
            ))}
          </DynamicFieldsContainer>
          <AddButton type="button" onClick={addTag}>
            Add Tag
          </AddButton>
        </FormGroup>

        <FormGroup>
          <Label>Equipment</Label>
          <DynamicFieldsContainer>
            {formData.equipment.map((item, index) => (
              <DynamicField key={index}>
                <Input
                  type="text"
                  placeholder="Equipment item"
                  value={item}
                  onChange={(e) => handleEquipmentChange(index, e.target.value)}
                  style={{ flex: 1 }}
                />
                <RemoveButton
                  type="button"
                  onClick={() => removeEquipment(index)}
                  disabled={formData.equipment.length === 1}
                >
                  Remove
                </RemoveButton>
              </DynamicField>
            ))}
          </DynamicFieldsContainer>
          <AddButton type="button" onClick={addEquipment}>
            Add Equipment
          </AddButton>
        </FormGroup>

        <Button type="submit">Submit Recipe</Button>
      </Form>
    </FormContainer>
  )
}

export default RecipeForm
