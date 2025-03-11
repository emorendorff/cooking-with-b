import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage.tsx";
import AddRecipePage from "./AddRecipeForm.tsx";
import Navigation from "./Navigation/Navigation.tsx";
const Recipe1 = () => <div>Recipe 1</div>;
const GroceryList = () => <div>Grocery List</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<Recipe1 />} />
        <Route path="/recipes/add" element={<AddRecipePage />} />
        <Route path="/grocery-list" element={<GroceryList />} />
      </Routes>
      <Navigation />
    </Router>
  );
}

export default App;
