import { useEffect, useState } from "react";
import styled from "styled-components";
import { RecipeWithRelations } from "../types";
import { getRecipes } from "../lib/api";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import Header from "../Header/Header";
import Navigation from "../Navigation/Navigation";

const PageWrapper = styled.div`
  padding-top: 64px;
  padding-bottom: 64px;
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
`;

const Title = styled.h1`
  margin-bottom: 24px;
  color: #484848;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
  gap: 16px;
  justify-items: center;
`;

const NoResults = styled.p`
  text-align: center;
  color: #666;
  margin-top: 32px;
`;

const BrowseRecipes = () => {
  const [recipes, setRecipes] = useState<RecipeWithRelations[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const data = await getRecipes();
        setRecipes(data);
        setFilteredRecipes(data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError(err instanceof Error ? err.message : "Failed to load recipes");
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  useEffect(() => {
    let result = recipes;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(query) ||
          recipe.tagline?.toLowerCase().includes(query)
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      result = result.filter((recipe) =>
        selectedTags.every((tag) => recipe.tags?.includes(tag))
      );
    }

    setFilteredRecipes(result);
  }, [searchQuery, selectedTags, recipes]);

  if (loading) return (
    <PageWrapper>
      <Header />
      <Container>Loading recipes...</Container>
      <Navigation />
    </PageWrapper>
  );

  if (error) return (
    <PageWrapper>
      <Header />
      <Container>Error: {error}</Container>
      <Navigation />
    </PageWrapper>
  );

  return (
    <PageWrapper>
      <Header />
      <Container>
        <Title>Browse Recipes</Title>
        <SearchBar
          onSearch={setSearchQuery}
          onTagsChange={setSelectedTags}
          selectedTags={selectedTags}
        />
        {filteredRecipes.length === 0 ? (
          <NoResults>No recipes found matching your criteria.</NoResults>
        ) : (
          <Grid>
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </Grid>
        )}
      </Container>
      <Navigation />
    </PageWrapper>
  );
};

export default BrowseRecipes;
