import { useState } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { RecipeWithRelations } from "../types";

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const CardContainer = styled.div`
  background-color: #c6b7a8;
  border-radius: 8px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  width: 175px;
  height: 250px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ImageBox = styled.div`
  position: relative;
  height: 100px;
  overflow: hidden;
  background-color: #e0d6c8;
  border-radius: 4px;
`;

const SkeletonOverlay = styled.div<{ $isLoading: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    #e0d6c8 0%,
    #f0ebe3 50%,
    #e0d6c8 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  opacity: ${(props) => (props.$isLoading ? 1 : 0)};
  transition: opacity 0.3s ease-out;
  pointer-events: none;
`;

const Image = styled.img<{ $isLoaded: boolean }>`
  min-height: 100%;
  object-fit: cover;
  width: 100%;
  opacity: ${(props) => (props.$isLoaded ? 1 : 0)};
  transition: opacity 0.3s ease-in;
`;

const RecipeName = styled.h3`
  margin: 12px 0 8px 0;
  font-size: 14px;
`;

const Tagline = styled.p`
  margin: 0;
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface RecipeCardProps {
  recipe: RecipeWithRelations;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const primaryImage = recipe.images?.find((img) => img.role === "primary")?.url;

  return (
    <CardLink to={`/recipes/${recipe.id}`}>
      <CardContainer>
        {primaryImage && (
          <ImageBox>
            <SkeletonOverlay $isLoading={!imageLoaded} />
            <Image
              src={primaryImage}
              alt={recipe.name}
              $isLoaded={imageLoaded}
              onLoad={() => setImageLoaded(true)}
            />
          </ImageBox>
        )}
        <RecipeName>{recipe.name}</RecipeName>
        <Tagline>{recipe.tagline}</Tagline>
      </CardContainer>
    </CardLink>
  );
};

export default RecipeCard;
