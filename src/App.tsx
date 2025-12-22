import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage.tsx";
import AddRecipePage from "./AddRecipeForm.tsx";
import Navigation from "./Navigation/Navigation.tsx";
import Login from "./components/Login.tsx";
import Header from "./Header/Header.tsx";
import RecipeDetail from "./pages/RecipeDetail.tsx";
import EditRecipe from "./pages/EditRecipe.tsx";
import BrowseRecipes from "./pages/BrowseRecipes.tsx";
import GroceryList from "./pages/GroceryList.tsx";
import Settings from "./pages/Settings.tsx";

const LoginPage = () => (
  <div className="pt-16 pb-16 min-h-screen">
    <Header />
    <div className="p-4">
      <Login />
    </div>
    <Navigation />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recipes" element={<BrowseRecipes />} />
        <Route path="/recipes/add" element={<AddRecipePage />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/recipes/:id/edit" element={<EditRecipe />} />
        <Route path="/grocery-list" element={<GroceryList />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <Navigation />
    </Router>
  );
}

export default App;
