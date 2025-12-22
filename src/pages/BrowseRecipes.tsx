import { useEffect, useState } from "react";
import { RecipeWithRelations } from "../types";
import { getRecipes } from "../lib/api";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import Header from "../Header/Header";
import Navigation from "../Navigation/Navigation";

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

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(query) ||
          recipe.tagline?.toLowerCase().includes(query)
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter((recipe) =>
        selectedTags.every((tag) => recipe.tags?.includes(tag))
      );
    }

    setFilteredRecipes(result);
  }, [searchQuery, selectedTags, recipes]);

  if (loading) return (
    <div className="pt-16 pb-16 min-h-screen">
      <Header />
      <div className="max-w-5xl mx-auto p-4">Loading recipes...</div>
      <Navigation />
    </div>
  );

  if (error) return (
    <div className="pt-16 pb-16 min-h-screen">
      <Header />
      <div className="max-w-5xl mx-auto p-4">Error: {error}</div>
      <Navigation />
    </div>
  );

  return (
    <div className="pt-16 pb-16 min-h-screen">
      <Header />
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="mb-6 text-gray-700">Browse Recipes</h1>
        <SearchBar
          onSearch={setSearchQuery}
          onTagsChange={setSelectedTags}
          selectedTags={selectedTags}
        />
        {filteredRecipes.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">No recipes found matching your criteria.</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(175px,1fr))] gap-4 justify-items-center">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
      <Navigation />
    </div>
  );
};

export default BrowseRecipes;
