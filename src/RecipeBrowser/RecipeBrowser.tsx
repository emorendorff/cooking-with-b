import { useEffect, useState } from "react";
import { RecipeWithRelations } from "../types";
import { getRecipes } from "../lib/api";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import RecipeCard from "../components/RecipeCard";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    partialVisibilityGutter: 40
  },
  tablet: {
    breakpoint: { max: 1024, min: 600 },
    items: 2,
    partialVisibilityGutter: 30
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 1,
    partialVisibilityGutter: 20
  }
};

const RecipeBrowser = () => {
  const [recipes, setRecipes] = useState<RecipeWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const data = await getRecipes();
        setRecipes(data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError(err instanceof Error ? err.message : "Failed to load recipes");
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  if (loading) return <div>Loading recipes...</div>;
  if (error) return <div>Error: {error}</div>;
  if (recipes.length === 0) return <div>No recipes yet!</div>;

  return (
    <div className="mt-3 carousel-container">
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={300}
        centerMode={false}
        draggable
        infinite
        keyBoardControl
        minimumTouchDrag={10}
        pauseOnHover
        responsive={responsive}
        showDots
        swipeable
      >
        {recipes.map((recipe) => (
          <div key={recipe.id} className="px-1.5 flex justify-center">
            <RecipeCard recipe={recipe} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default RecipeBrowser;
