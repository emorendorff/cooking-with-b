import React, { useState } from "react";
import styled from "styled-components";
import { Recipe } from "./recipes";

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  background-color: #f4f1e1;
  border-radius: 8px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 14px;
  color: #484848;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #c6b7a8;
  border-radius: 4px;
  font-family: var(--font-secondary);
  font-size: 14px;
`;

const TextArea = styled.textarea`
  padding: 8px 12px;
  border: 1px solid #c6b7a8;
  border-radius: 8px;
  font-family: var(--font-secondary);
  font-size: 14px;
  min-height: 50px;
`;

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
`;

const DynamicFieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DynamicField = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const RemoveButton = styled.button`
  background-color: #d18b4f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
`;

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
`;

interface RecipeFormProps {
  onSubmit: (recipe: Partial<Recipe>) => void;
}

const initialValues: Partial<Recipe> = {
  name: "",
  tagline: "",
  servings: 4,
  prepTime: { value: 0, unit: "minutes" },
  cookTime: { value: 0, unit: "minutes" },
  totalTime: { value: 0, unit: "minutes" },
  difficulty: "easy",
  ingredients: [{ item: "", amount: 0, unit: "", notes: "" }],
  instructions: [{ step: 1, text: "" }],
  tags: [""],
  equipment: [""]
};

const RecipeForm: React.FC<RecipeFormProps> = ({ onSubmit }) => {
  const [recipe, setRecipe] = useState<Partial<Recipe>>(initialValues);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      const parentValue = recipe[parent as keyof Recipe];
      if (parentValue && typeof parentValue === "object") {
        setRecipe({
          ...recipe,
          [parent]: {
            ...parentValue,
            [child]: value
          }
        });
      }
    } else {
      setRecipe({ ...recipe, [name]: value });
    }
  };

  const handleTimeChange = (
    field: "prepTime" | "cookTime" | "totalTime",
    type: "value" | "unit",
    value: string
  ) => {
    setRecipe({
      ...recipe,
      [field]: {
        ...recipe[field],
        [type]: type === "value" ? parseInt(value) : value
      }
    });
  };

  const handleIngredientChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedIngredients = recipe.ingredients?.map((ingredient, i) => {
      if (i === index) {
        return {
          ...ingredient,
          [field]: field === "amount" ? parseFloat(value) : value
        };
      }
      return ingredient;
    });

    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  const addIngredient = () => {
    if (recipe.ingredients) {
      setRecipe({
        ...recipe,
        ingredients: [
          ...recipe.ingredients,
          { item: "", amount: 0, unit: "", notes: "" }
        ]
      });
    }
  };

  const removeIngredient = (index: number) => {
    if (recipe.ingredients && recipe.ingredients.length > 1) {
      const updatedIngredients = recipe.ingredients.filter(
        (_, i) => i !== index
      );
      setRecipe({ ...recipe, ingredients: updatedIngredients });
    }
  };

  const handleInstructionChange = (index: number, text: string) => {
    const updatedInstructions = recipe.instructions?.map((instruction, i) => {
      if (i === index) {
        return { ...instruction, text };
      }
      return instruction;
    });

    setRecipe({ ...recipe, instructions: updatedInstructions });
  };

  const addInstruction = () => {
    if (recipe.instructions) {
      const nextStep = recipe.instructions.length + 1;
      setRecipe({
        ...recipe,
        instructions: [...recipe.instructions, { step: nextStep, text: "" }]
      });
    }
  };

  const removeInstruction = (index: number) => {
    if (recipe.instructions && recipe.instructions.length > 1) {
      const updatedInstructions = recipe.instructions
        .filter((_, i) => i !== index)
        .map((instruction, i) => ({ ...instruction, step: i + 1 }));

      setRecipe({ ...recipe, instructions: updatedInstructions });
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const updatedTags = recipe.tags?.map((tag, i) =>
      i === index ? value : tag
    );
    setRecipe({ ...recipe, tags: updatedTags });
  };

  const addTag = () => {
    if (recipe.tags) {
      setRecipe({ ...recipe, tags: [...recipe.tags, ""] });
    }
  };

  const removeTag = (index: number) => {
    if (recipe.tags && recipe.tags.length > 1) {
      const updatedTags = recipe.tags.filter((_, i) => i !== index);
      setRecipe({ ...recipe, tags: updatedTags });
    }
  };

  const handleEquipmentChange = (index: number, value: string) => {
    const updatedEquipment = recipe.equipment?.map((item, i) =>
      i === index ? value : item
    );
    setRecipe({ ...recipe, equipment: updatedEquipment });
  };

  const addEquipment = () => {
    if (recipe.equipment) {
      setRecipe({ ...recipe, equipment: [...recipe.equipment, ""] });
    }
  };

  const removeEquipment = (index: number) => {
    if (recipe.equipment && recipe.equipment.length > 1) {
      const updatedEquipment = recipe.equipment.filter((_, i) => i !== index);
      setRecipe({ ...recipe, equipment: updatedEquipment });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate a unique ID if creating a new recipe
    const recipeWithId = {
      ...recipe,
      id: Date.now()
    };
    onSubmit(recipeWithId);
    // Reset the form after submission
    setRecipe(initialValues);
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Recipe Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={recipe.name}
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
            value={recipe.tagline}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="servings">Servings</Label>
          <Input
            type="number"
            id="servings"
            name="servings"
            min="1"
            value={recipe.servings}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Prep Time</Label>
          <DynamicField>
            <Input
              type="number"
              min="0"
              value={recipe.prepTime?.value}
              onChange={(e) =>
                handleTimeChange("prepTime", "value", e.target.value)
              }
              style={{ width: "80px" }}
            />
            <select
              value={recipe.prepTime?.unit}
              onChange={(e) =>
                handleTimeChange("prepTime", "unit", e.target.value)
              }
            >
              <option value="minutes">minutes</option>
              <option value="hours">hours</option>
            </select>
          </DynamicField>
        </FormGroup>

        <FormGroup>
          <Label>Cook Time</Label>
          <DynamicField>
            <Input
              type="number"
              min="0"
              value={recipe.cookTime?.value}
              onChange={(e) =>
                handleTimeChange("cookTime", "value", e.target.value)
              }
              style={{ width: "80px" }}
            />
            <select
              value={recipe.cookTime?.unit}
              onChange={(e) =>
                handleTimeChange("cookTime", "unit", e.target.value)
              }
            >
              <option value="minutes">minutes</option>
              <option value="hours">hours</option>
            </select>
          </DynamicField>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="difficulty">Difficulty</Label>
          <select
            id="difficulty"
            name="difficulty"
            value={recipe.difficulty}
            onChange={handleChange}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </FormGroup>

        <FormGroup>
          <Label>Ingredients</Label>
          <DynamicFieldsContainer>
            {recipe.ingredients?.map((ingredient, index) => (
              <DynamicField key={index}>
                <Input
                  type="text"
                  placeholder="Item"
                  value={ingredient.item}
                  onChange={(e) =>
                    handleIngredientChange(index, "item", e.target.value)
                  }
                  style={{ flex: 2 }}
                  required
                />
                <Input
                  type="number"
                  placeholder="Amount"
                  value={ingredient.amount || ""}
                  onChange={(e) =>
                    handleIngredientChange(index, "amount", e.target.value)
                  }
                  style={{ flex: 1 }}
                  min="0"
                  step="0.25"
                />
                <Input
                  type="text"
                  placeholder="Unit"
                  value={ingredient.unit}
                  onChange={(e) =>
                    handleIngredientChange(index, "unit", e.target.value)
                  }
                  style={{ flex: 1 }}
                />
                {/* <Input
                  type="text"
                  placeholder="Notes (optional)"
                  value={ingredient.notes || ""}
                  onChange={(e) =>
                    handleIngredientChange(index, "notes", e.target.value)
                  }
                  style={{ flex: 2 }}
                /> */}
                <RemoveButton
                  type="button"
                  onClick={() => removeIngredient(index)}
                  disabled={recipe.ingredients?.length === 1}
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
            {recipe.instructions?.map((instruction, index) => (
              <DynamicField key={index}>
                <span style={{ minWidth: "30px", textAlign: "center" }}>
                  {instruction.step}.
                </span>
                <TextArea
                  placeholder="Instruction step"
                  value={instruction.text}
                  onChange={(e) =>
                    handleInstructionChange(index, e.target.value)
                  }
                  style={{ flex: 1 }}
                  required
                />
                <RemoveButton
                  type="button"
                  onClick={() => removeInstruction(index)}
                  disabled={recipe.instructions?.length === 1}
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
            {recipe.tags?.map((tag, index) => (
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
                  disabled={recipe.tags?.length === 1}
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
            {recipe.equipment?.map((item, index) => (
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
                  disabled={recipe.equipment?.length === 1}
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
  );
};

export default RecipeForm;
