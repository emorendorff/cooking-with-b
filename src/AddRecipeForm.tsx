import { useState } from "react";
import styled from "styled-components";
import RecipeForm from "./RecipeForm";
import Header from "./Header/Header";
import Navigation from "./Navigation/Navigation";
import { Recipe } from "./recipes";
import { recipeApi } from "./apiServer";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  margin-top: 64px;
  margin-bottom: 64px;
`;

const StatusMessage = styled.div<{ success?: boolean }>`
  margin: 20px 0;
  padding: 12px;
  border-radius: 4px;
  background-color: ${(props) => (props.success ? "#e6f7e6" : "#f8d7da")};
  color: ${(props) => (props.success ? "#28a745" : "#dc3545")};
  font-family: var(--font-secondary);
`;

const AddRecipePage = () => {
  const [status, setStatus] = useState<{
    message: string;
    success: boolean;
  } | null>(null);

  const handleSubmit = async (recipe: Partial<Recipe>) => {
    try {
      // Remove the client-side generated ID before sending to the server
      const { ...recipeWithoutId } = recipe;

      await recipeApi.createRecipe(recipeWithoutId as Omit<Recipe, "id">);

      setStatus({
        message: "Recipe submitted successfully!",
        success: true
      });

      // Optionally, you could redirect the user to another page after successful submission
      // history.push('/recipes');
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

  return (
    <PageContainer>
      <Header />
      <MainContent>
        <h2>Add a New Recipe</h2>

        {status && (
          <StatusMessage success={status.success}>
            {status.message}
          </StatusMessage>
        )}

        <RecipeForm onSubmit={handleSubmit} />
      </MainContent>
      <Navigation />
    </PageContainer>
  );
};

export default AddRecipePage;
