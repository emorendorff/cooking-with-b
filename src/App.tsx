import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage.tsx";
const Recipe1 = () => <div>Recipe 1</div>;
const GroceryList = () => <div>Grocery List</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<Recipe1 />} />
        <Route path="/grocery-list" element={<GroceryList />} />
      </Routes>
    </Router>
  );
}

export default App;
