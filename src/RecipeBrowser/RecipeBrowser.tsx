import { useEffect, useState } from "react";
import styled from "styled-components";
import { RecipeWithRelations } from "../types";
import { getRecipes } from "../lib/api";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import RecipeCard from "../components/RecipeCard";

const CarouselItem = styled.div`
  margin-right: 12px;
`;

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    partialVisibilityGutter: 40
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    partialVisibilityGutter: 30
  },
  mobile: {
    breakpoint: { max: 344, min: 0 },
    items: 1,
    partialVisibilityGutter: 30
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
    <div style={{ marginTop: "12px" }}>
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={300}
        centerMode={true}
        draggable
        infinite
        keyBoardControl
        minimumTouchDrag={10}
        pauseOnHover
        responsive={responsive}
        swipeable
      >
        {recipes.map((recipe) => (
          <CarouselItem key={recipe.id}>
            <RecipeCard recipe={recipe} />
          </CarouselItem>
        ))}
      </Carousel>
    </div>
  );
};

export default RecipeBrowser;
