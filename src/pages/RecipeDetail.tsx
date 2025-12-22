import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { RecipeWithRelations, Ingredient } from "../types";
import { getRecipe } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useGroceryListContext } from "../context/GroceryListContext";
import Header from "../Header/Header";
import Navigation from "../Navigation/Navigation";
import Rating from "../components/Rating";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const { addRecipeIngredient, addAllRecipeIngredients } = useGroceryListContext();
  const [recipe, setRecipe] = useState<RecipeWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const fetchRecipe = async () => {
    if (!id) return;
    try {
      const data = await getRecipe(id);
      setRecipe(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load recipe");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const formatIngredient = (ing: Ingredient) => {
    const parts = [ing.amount, ing.unit, ing.item].filter(Boolean);
    return parts.join(" ");
  };

  const handleAddIngredient = (ing: Ingredient) => {
    const text = formatIngredient(ing);
    addRecipeIngredient(text, recipe!.id, recipe!.name);
    setAddedItems((prev) => new Set(prev).add(ing.id));
    setTimeout(() => {
      setAddedItems((prev) => {
        const next = new Set(prev);
        next.delete(ing.id);
        return next;
      });
    }, 1500);
  };

  const handleAddAllIngredients = () => {
    const texts = recipe!.ingredients.map(formatIngredient);
    addAllRecipeIngredients(texts, recipe!.id, recipe!.name);
    const allIds = new Set(recipe!.ingredients.map((i) => i.id));
    setAddedItems(allIds);
    setTimeout(() => setAddedItems(new Set()), 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 mt-16 mb-16 max-w-3xl mx-auto">
          <div className="text-center py-12 text-gray-500">Loading recipe...</div>
        </main>
        <Navigation />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 mt-16 mb-16 max-w-3xl mx-auto">
          <div className="text-center py-12 text-red-600">{error || "Recipe not found"}</div>
        </main>
        <Navigation />
      </div>
    );
  }

  const primaryImage = recipe.images?.find((img) => img.role === "primary");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 mt-16 mb-16 max-w-3xl mx-auto">
        {isAdmin && (
          <Link
            to={`/recipes/${id}/edit`}
            className="inline-block bg-burgundy text-white px-6 py-3 rounded no-underline font-semibold mb-6 hover:bg-burgundy-hover"
          >
            Edit Recipe
          </Link>
        )}

        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={recipe.name}
            className="w-full h-[300px] object-cover rounded-lg mb-4"
          />
        ) : (
          <div className="w-full h-[300px] bg-tan-light rounded-lg flex items-center justify-center text-6xl text-brown mb-4">
            🍽️
          </div>
        )}

        <h1 className="font-display text-gray-700 mb-2">{recipe.name}</h1>
        {recipe.tagline && <p className="italic text-gray-500 mb-4">{recipe.tagline}</p>}

        <div className="flex gap-4 flex-wrap mb-6 text-gray-500 text-sm">
          {recipe.servings && <span className="bg-cream px-3 py-1 rounded-2xl">Serves: {recipe.servings}</span>}
          {recipe.prep_time && <span className="bg-cream px-3 py-1 rounded-2xl">Prep: {recipe.prep_time}</span>}
          {recipe.cook_time && <span className="bg-cream px-3 py-1 rounded-2xl">Cook: {recipe.cook_time}</span>}
          {recipe.difficulty && <span className="bg-cream px-3 py-1 rounded-2xl">{recipe.difficulty}</span>}
        </div>

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {recipe.tags.map((tag) => (
              <span key={tag} className="bg-tan text-gray-700 px-3 py-1 rounded-2xl text-sm">
                {tag}
              </span>
            ))}
          </div>
        )}

        <section className="mb-6">
          <h2 className="font-display text-burgundy text-lg mb-3 border-b-2 border-tan pb-1 text-left normal-case">
            Ingredients
          </h2>
          {recipe.ingredients.length > 0 && (
            <button
              onClick={handleAddAllIngredients}
              className="bg-burgundy text-white border-none rounded px-4 py-2 text-sm cursor-pointer mb-4 hover:bg-burgundy-hover"
            >
              Add All to Grocery List
            </button>
          )}
          <ul className="list-none p-0">
            {recipe.ingredients?.map((ing, idx) => (
              <li key={idx} className="py-2 border-b border-tan-light last:border-b-0">
                {ing.amount && `${ing.amount} `}
                {ing.unit && `${ing.unit} `}
                {ing.linked_recipe_id ? (
                  <Link
                    to={`/recipes/${ing.linked_recipe_id}`}
                    className="text-burgundy no-underline hover:underline after:content-['_→']"
                  >
                    {ing.linked_recipe?.name || "Linked Recipe"}
                  </Link>
                ) : (
                  ing.item
                )}
                <button
                  onClick={() => handleAddIngredient(ing)}
                  title="Add to grocery list"
                  className={`${
                    addedItems.has(ing.id) ? 'bg-green-500 hover:bg-green-500' : 'bg-burgundy hover:bg-burgundy-hover'
                  } text-white border-none rounded-full w-6 h-6 text-base cursor-pointer ml-2 inline-flex items-center justify-center flex-shrink-0`}
                >
                  {addedItems.has(ing.id) ? "✓" : "+"}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="font-display text-burgundy text-lg mb-3 border-b-2 border-tan pb-1 text-left normal-case">
            Instructions
          </h2>
          <ol className="pl-6">
            {recipe.instructions?.map((inst, idx) => (
              <li key={idx} className="py-3 leading-relaxed">{inst.text}</li>
            ))}
          </ol>
        </section>

        {recipe.equipment && recipe.equipment.length > 0 && (
          <section className="mb-6">
            <h2 className="font-display text-burgundy text-lg mb-3 border-b-2 border-tan pb-1 text-left normal-case">
              Equipment
            </h2>
            <p className="text-gray-700">{recipe.equipment.join(", ")}</p>
          </section>
        )}

        <Rating
          recipeId={recipe.id}
          reviews={recipe.reviews || []}
          averageRating={recipe.average_rating}
          onReviewChange={fetchRecipe}
        />
      </main>
      <Navigation />
    </div>
  );
};

export default RecipeDetail;
