import { useEffect, useState } from "react";
import styled from "styled-components";
import { RecipeWithRelations } from "../types";
import { getRecipes } from "../lib/api";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import RecipeCard from "../components/RecipeCard";

const CarouselContainer = styled.div`
  margin-top: 12px;

  .react-multi-carousel-arrow {
    background: rgba(106, 13, 43, 0.8);
    min-width: 36px;
    min-height: 36px;

    &:hover {
      background: rgba(106, 13, 43, 1);
    }
  }

  .react-multi-carousel-arrow--left {
    left: 4px;
  }

  .react-multi-carousel-arrow--right {
    right: 4px;
  }

  /* Hide arrows on mobile, rely on swipe */
  @media (max-width: 600px) {
    .react-multi-carousel-arrow {
      display: none;
    }
  }

  .react-multi-carousel-dot-list {
    bottom: -8px;
    display: none;

    @media (max-width: 600px) {
      display: flex;
    }
  }

  .react-multi-carousel-dot button {
    background: #c6b7a8;
    border: none;
  }

  .react-multi-carousel-dot--active button {
    background: #6a0d2b;
  }
`;

const CarouselItem = styled.div`
  padding: 0 6px;
  display: flex;
  justify-content: center;
`;

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
    <CarouselContainer>
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
          <CarouselItem key={recipe.id}>
            <RecipeCard recipe={recipe} />
          </CarouselItem>
        ))}
      </Carousel>
    </CarouselContainer>
  );
};

export default RecipeBrowser;
