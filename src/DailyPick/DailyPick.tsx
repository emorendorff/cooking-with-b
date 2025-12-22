import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { RecipeWithRelations } from "../types";
import { getRecipes } from "../lib/api";

const PreviewLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 32px;
  background-color: #c6b7a8;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

export const ImageBox = styled.div`
  display: flex;
  height: 250px;
  overflow: hidden;
  background-color: #e0d6c8;
  border-radius: 4px;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b7355;
  font-size: 48px;
`;

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
    return <PreviewContainer>Loading today's pick...</PreviewContainer>;
  if (!recipe) return null;
  const primaryImage = recipe?.images?.find((img) => img.role === "primary");

  return (
    <PreviewLink to={`/recipes/${recipe.id}`}>
      <PreviewContainer>
        {primaryImage ? (
          <ImageBox>
            <img
              src={primaryImage.url}
              alt={recipe.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </ImageBox>
        ) : (
          <ImageBox>
            <PlaceholderImage>🍽️</PlaceholderImage>
          </ImageBox>
        )}

        <h2>Today's Pick: {recipe.name}</h2>
        <p>{recipe.tagline}</p>
      </PreviewContainer>
    </PreviewLink>
  );
};

export default DailyPick;
