import { useState } from "react";
import RecipeForm from "./RecipeForm";
import Header from "./Header/Header";
import Navigation from "./Navigation/Navigation";
import { RecipeFormData, IngredientFormData } from "./types";
import { createRecipe } from "./lib/api";
import { useAuth } from "./context/AuthContext";

const AddRecipePage = () => {
  const { isAdmin } = useAuth();
  const [status, setStatus] = useState<{
    message: string;
    success: boolean;
  } | null>(null);

  const handleSubmit = async (
    formData: RecipeFormData,
    ingredients: IngredientFormData[]
  ): Promise<void> => {
    try {
      await createRecipe(formData, ingredients);
      setStatus({
        message: "Recipe submitted successfully! Form cleared for next recipe.",
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
      throw error; // Re-throw so RecipeForm knows it failed
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 mt-16 mb-16">
          <h2>Add a New Recipe</h2>
          <div className="my-5 mx-auto max-w-3xl p-3 rounded bg-red-100 text-red-600">
            You must be an admin to add recipes.
          </div>
        </main>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 mt-16 mb-16">
        <h2>Add a New Recipe</h2>
        <RecipeForm onSubmit={handleSubmit} />
        {status && (
          <div className={`my-5 mx-auto max-w-3xl p-3 rounded ${
            status.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
            {status.message}
          </div>
        )}
      </main>
      <Navigation />
    </div>
  );
};

export default AddRecipePage;
