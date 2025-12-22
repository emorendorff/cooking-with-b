import { useState } from "react";
import RecipeForm from "./RecipeForm";
import Header from "./Header/Header";
import Navigation from "./Navigation/Navigation";
import { RecipeFormData, IngredientFormData } from "./types";
import { createRecipe } from "./lib/api";
import { useAuth } from "./context/AuthContext";
import { MainContent, PageContainer, StatusMessage } from "./pages/styles";

const AddRecipePage = () => {
  const { isAdmin } = useAuth();
  const [status, setStatus] = useState<{
    message: string;
    success: boolean;
  } | null>(null);

  const handleSubmit = async (
    formData: RecipeFormData,
    ingredients: IngredientFormData[]
  ) => {
    try {
      await createRecipe(formData, ingredients);
      setStatus({
        message: "Recipe submitted successfully!",
        success: true
      });
    } catch (error) {
      console.error("Error submitting recipe:", error);
      setStatus({
        message: `Failed to submit recipe: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        success: false
      });
    }
  };

  if (!isAdmin) {
    return (
      <PageContainer>
        <Header />
        <MainContent>
          <h2>Add a New Recipe</h2>
          <StatusMessage $success={false}>
            You must be an admin to add recipes.
          </StatusMessage>
        </MainContent>
        <Navigation />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header />
      <MainContent>
        <h2>Add a New Recipe</h2>
        <RecipeForm onSubmit={handleSubmit} />
        {status && (
          <StatusMessage $success={status.success}>
            {status.message}
          </StatusMessage>
        )}
      </MainContent>
      <Navigation />
    </PageContainer>
  );
};

export default AddRecipePage;
