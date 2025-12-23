import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const EditRecipe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 mt-16 mb-16">
          <div className="my-5 mx-auto max-w-3xl p-3 rounded bg-red-100 text-red-600">
            You must be an admin to edit recipes.
          </div>
        </main>
        <Navigation />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 mt-16 mb-16">
          <div className="text-center py-12 text-gray-500">Loading recipe...</div>
        </main>
        <Navigation />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 mt-16 mb-16">
          <div className="my-5 mx-auto max-w-3xl p-3 rounded bg-red-100 text-red-600">
            Recipe not found
          </div>
        </main>
        <Navigation />
      </div>
    );
  }

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
  ): Promise<string> => {
    if (!id) throw new Error("No recipe ID");
    try {
      await updateRecipe(id, formData, ingredients);
      navigate(`/recipes/${id}`);
      return id;
    } catch (error) {
      setStatus({
        message: `Failed to update: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        success: false
      });
      throw error;
    }
  };

  const handleImagesChange = async () => {
    if (!id) return;
    const updated = await getRecipe(id);
    setRecipe(updated);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 mt-16 mb-16">
        <section className="max-w-3xl mx-auto mb-8">
          <h2 className="font-display text-burgundy mb-4">Edit Recipe: {recipe.name}</h2>
        </section>

        {status && (
          <div className={`my-5 mx-auto max-w-3xl p-3 rounded ${
            status.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
            {status.message}
          </div>
        )}

        <section className="max-w-3xl mx-auto mb-8">
          <h2 className="font-display text-burgundy mb-4">Images</h2>
          <ImageUpload
            recipeId={recipe.id}
            images={recipe.images || []}
            onImagesChange={handleImagesChange}
          />
        </section>

        <section className="max-w-3xl mx-auto mb-8">
          <h2 className="font-display text-burgundy mb-4">Recipe Details</h2>
          <RecipeForm
            onSubmit={handleSubmit}
            initialData={initialFormData}
            initialIngredients={initialIngredients}
            mode="edit"
          />
        </section>
      </main>
      <Navigation />
    </div>
  );
};

export default EditRecipe;
