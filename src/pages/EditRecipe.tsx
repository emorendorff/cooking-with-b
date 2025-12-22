import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  RecipeWithRelations,
  RecipeFormData,
  IngredientFormData
} from "../types";
import { getRecipe, updateRecipe } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import Header from "../Header/Header";
import Navigation from "../Navigation/Navigation";
import RecipeForm from "../RecipeForm";
import ImageUpload from "../components/ImageUpload";
import {
  LoadingMessage,
  MainContent,
  PageContainer,
  Section,
  SectionTitle,
  StatusMessage
} from "./styles";

const EditRecipe = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const [recipe, setRecipe] = useState<RecipeWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{
    message: string;
    success: boolean;
  } | null>(null);

  useEffect(() => {
    if (!id) return;
    getRecipe(id)
      .then(setRecipe)
      .catch((err) => {
        setStatus({ message: err.message, success: false });
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!isAdmin) {
    return (
      <PageContainer>
        <Header />
        <MainContent>
          <StatusMessage $success={false}>
            You must be an admin to edit recipes.
          </StatusMessage>
        </MainContent>
        <Navigation />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <Header />
        <MainContent>
          <LoadingMessage>Loading recipe...</LoadingMessage>
        </MainContent>
        <Navigation />
      </PageContainer>
    );
  }

  if (!recipe) {
    return (
      <PageContainer>
        <Header />
        <MainContent>
          <StatusMessage $success={false}>Recipe not found</StatusMessage>
        </MainContent>
        <Navigation />
      </PageContainer>
    );
  }

  // Convert recipe to form data format
  const initialFormData: RecipeFormData = {
    name: recipe.name,
    tagline: recipe.tagline || "",
    servings: recipe.servings || "",
    prep_time: recipe.prep_time || "",
    cook_time: recipe.cook_time || "",
    total_time: recipe.total_time || "",
    difficulty: recipe.difficulty || "easy",
    instructions: recipe.instructions || [{ step: 1, text: "" }],
    equipment: recipe.equipment?.length ? recipe.equipment : [""],
    tags: recipe.tags?.length ? recipe.tags : [""]
  };

  const initialIngredients: IngredientFormData[] = recipe.ingredients?.length
    ? recipe.ingredients.map((ing) => ({
        item: ing.item || "",
        amount: ing.amount || "",
        unit: ing.unit || "",
        linked_recipe_id: ing.linked_recipe_id,
        isLinkedRecipe: !!ing.linked_recipe_id
      }))
    : [
        {
          item: "",
          amount: "",
          unit: "",
          linked_recipe_id: null,
          isLinkedRecipe: false
        }
      ];

  const handleSubmit = async (
    formData: RecipeFormData,
    ingredients: IngredientFormData[]
  ) => {
    if (!id) return;
    try {
      await updateRecipe(id, formData, ingredients);
      setStatus({ message: "Recipe updated successfully!", success: true });
      // Refresh recipe data
      const updated = await getRecipe(id);
      setRecipe(updated);
    } catch (error) {
      setStatus({
        message: `Failed to update: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        success: false
      });
    }
  };

  const handleImagesChange = async () => {
    // Refresh recipe to get updated images
    if (!id) return;
    const updated = await getRecipe(id);
    setRecipe(updated);
  };

  return (
    <PageContainer>
      <Header />
      <MainContent>
        <Section>
          <SectionTitle>Edit Recipe: {recipe.name}</SectionTitle>
        </Section>

        {status && (
          <StatusMessage $success={status.success}>
            {status.message}
          </StatusMessage>
        )}

        <Section>
          <SectionTitle>Images</SectionTitle>
          <ImageUpload
            recipeId={recipe.id}
            images={recipe.images || []}
            onImagesChange={handleImagesChange}
          />
        </Section>

        <Section>
          <SectionTitle>Recipe Details</SectionTitle>
          <RecipeForm
            onSubmit={handleSubmit}
            initialData={initialFormData}
            initialIngredients={initialIngredients}
          />
        </Section>
      </MainContent>
      <Navigation />
    </PageContainer>
  );
};

export default EditRecipe;
