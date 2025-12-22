import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { RecipeWithRelations, Ingredient } from "../types";
import { getRecipe } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useGroceryListContext } from "../context/GroceryListContext";
import Header from "../Header/Header";
import Navigation from "../Navigation/Navigation";
import Rating from "../components/Rating";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  margin-top: 64px;
  margin-bottom: 64px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const HeroImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 300px;
  background-color: #e0d6c8;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  color: #8b7355;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-family: var(--font-display);
  color: #484848;
  margin-bottom: 8px;
`;

const Tagline = styled.p`
  font-style: italic;
  color: #666;
  margin-bottom: 16px;
`;

const MetaRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 24px;
  color: #666;
  font-size: 14px;
`;

const MetaItem = styled.span`
  background-color: #f4f1e1;
  padding: 4px 12px;
  border-radius: 16px;
`;

const Section = styled.section`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  color: #6a0d2b;
  font-size: 18px;
  margin-bottom: 12px;
  border-bottom: 2px solid #c6b7a8;
  padding-bottom: 4px;
`;

const IngredientList = styled.ul`
  list-style: none;
  padding: 0;
`;

const IngredientItem = styled.li`
  padding: 8px 0;
  border-bottom: 1px solid #e0d6c8;

  &:last-child {
    border-bottom: none;
  }
`;

const LinkedRecipe = styled(Link)`
  color: #6a0d2b;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &::after {
    content: " →";
  }
`;

const InstructionList = styled.ol`
  padding-left: 24px;
`;

const InstructionItem = styled.li`
  padding: 12px 0;
  line-height: 1.6;
`;

const TagList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background-color: #c6b7a8;
  color: #484848;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
`;

const EditButton = styled(Link)`
  display: inline-block;
  background-color: #6a0d2b;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 24px;

  &:hover {
    background-color: #8a1d3b;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 48px;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 48px;
  color: #dc3545;
`;

const AddButton = styled.button<{ $added?: boolean }>`
  background: ${(props) => (props.$added ? "#4CAF50" : "#6a0d2b")};
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 16px;
  cursor: pointer;
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    background: ${(props) => (props.$added ? "#4CAF50" : "#8a1d3b")};
  }
`;

const AddAllButton = styled.button`
  background: #6a0d2b;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 16px;

  &:hover {
    background: #8a1d3b;
  }
`;

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
      <PageContainer>
        <Header />
        <MainContent>
          <LoadingMessage>Loading recipe...</LoadingMessage>
        </MainContent>
        <Navigation />
      </PageContainer>
    );
  }

  if (error || !recipe) {
    return (
      <PageContainer>
        <Header />
        <MainContent>
          <ErrorMessage>{error || "Recipe not found"}</ErrorMessage>
        </MainContent>
        <Navigation />
      </PageContainer>
    );
  }

  const primaryImage = recipe.images?.find((img) => img.role === "primary");

  return (
    <PageContainer>
      <Header />
      <MainContent>
        {isAdmin && (
          <EditButton to={`/recipes/${id}/edit`}>Edit Recipe</EditButton>
        )}

        {primaryImage ? (
          <HeroImage src={primaryImage.url} alt={recipe.name} />
        ) : (
          <PlaceholderImage>🍽️</PlaceholderImage>
        )}

        <Title>{recipe.name}</Title>
        {recipe.tagline && <Tagline>{recipe.tagline}</Tagline>}

        <MetaRow>
          {recipe.servings && <MetaItem>Serves: {recipe.servings}</MetaItem>}
          {recipe.prep_time && <MetaItem>Prep: {recipe.prep_time}</MetaItem>}
          {recipe.cook_time && <MetaItem>Cook: {recipe.cook_time}</MetaItem>}
          {recipe.difficulty && <MetaItem>{recipe.difficulty}</MetaItem>}
        </MetaRow>

        {recipe.tags && recipe.tags.length > 0 && (
          <TagList>
            {recipe.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </TagList>
        )}

        <Section>
          <SectionTitle>Ingredients</SectionTitle>
          {recipe.ingredients.length > 0 && (
            <AddAllButton onClick={handleAddAllIngredients}>
              Add All to Grocery List
            </AddAllButton>
          )}
          <IngredientList>
            {recipe.ingredients?.map((ing, idx) => (
              <IngredientItem key={idx}>
                {ing.amount && `${ing.amount} `}
                {ing.unit && `${ing.unit} `}
                {ing.linked_recipe_id ? (
                  <LinkedRecipe to={`/recipes/${ing.linked_recipe_id}`}>
                    {ing.linked_recipe?.name || "Linked Recipe"}
                  </LinkedRecipe>
                ) : (
                  ing.item
                )}
                <AddButton
                  $added={addedItems.has(ing.id)}
                  onClick={() => handleAddIngredient(ing)}
                  title="Add to grocery list"
                >
                  {addedItems.has(ing.id) ? "✓" : "+"}
                </AddButton>
              </IngredientItem>
            ))}
          </IngredientList>
        </Section>

        <Section>
          <SectionTitle>Instructions</SectionTitle>
          <InstructionList>
            {recipe.instructions?.map((inst, idx) => (
              <InstructionItem key={idx}>{inst.text}</InstructionItem>
            ))}
          </InstructionList>
        </Section>

        {recipe.equipment && recipe.equipment.length > 0 && (
          <Section>
            <SectionTitle>Equipment</SectionTitle>
            <p>{recipe.equipment.join(", ")}</p>
          </Section>
        )}

        <Rating
          recipeId={recipe.id}
          reviews={recipe.reviews || []}
          averageRating={recipe.average_rating}
          onReviewChange={fetchRecipe}
        />
      </MainContent>
      <Navigation />
    </PageContainer>
  );
};

export default RecipeDetail;
