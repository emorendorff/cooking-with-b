import { Link } from "react-router-dom";
import styled from "styled-components";
import { RecipeWithRelations } from "../types";

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
  display: flex;
  height: 100px;
  overflow: hidden;
  background-color: #e0d6c8;
  border-radius: 4px;
`;

const Image = styled.img`
  min-height: 100%;
  object-fit: cover;
  width: 100%;
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
  const primaryImage = recipe.images?.find((img) => img.role === "primary")?.url;

  return (
    <CardLink to={`/recipes/${recipe.id}`}>
      <CardContainer>
        {primaryImage && (
          <ImageBox>
            <Image src={primaryImage} alt={recipe.name} />
          </ImageBox>
        )}
        <RecipeName>{recipe.name}</RecipeName>
        <Tagline>{recipe.tagline}</Tagline>
      </CardContainer>
    </CardLink>
  );
};

export default RecipeCard;
