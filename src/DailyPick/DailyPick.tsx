import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RecipeWithRelations } from "../types";
import { getRecipes } from "../lib/api";

// Simple deterministic "random" pick based on date
function getDailyIndex(length: number): number {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();
  return seed % length;
}

const DailyPick = () => {
  const [recipe, setRecipe] = useState<RecipeWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDailyPick() {
      try {
        const recipes = await getRecipes();
        if (recipes.length > 0) {
          const index = getDailyIndex(recipes.length);
          setRecipe(recipes[index]);
        }
      } catch (err) {
        console.error("Failed to fetch daily pick:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDailyPick();
  }, []);

  if (loading)
    return <div className="flex flex-col rounded-lg p-4 mb-8 bg-tan shadow-lg">Loading today's pick...</div>;
  if (!recipe) return null;
  const primaryImage = recipe?.images?.find((img) => img.role === "primary");

  return (
    <Link to={`/recipes/${recipe.id}`} className="no-underline text-inherit">
      <div className="flex flex-col rounded-lg p-4 mb-8 bg-tan shadow-lg cursor-pointer transition-transform hover:-translate-y-1">
        <div className="flex h-[250px] overflow-hidden bg-tan-light rounded">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brown text-5xl">
              🍽️
            </div>
          )}
        </div>

        <h2>Today's Pick: {recipe.name}</h2>
        <p className="text-gray-700">{recipe.tagline}</p>
      </div>
    </Link>
  );
};

export default DailyPick;
