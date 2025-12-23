import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Add, CardView, GroceryList, Search } from "../assets";

const Navigation = () => {
  const { isAdmin } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-burgundy h-16 z-1000">
      <ul className="flex items-center justify-around list-none m-0 p-0 h-full">
        <Link to="/" className="text-white no-underline text-xs">
          <li className="flex flex-col items-center justify-center cursor-pointer px-4 py-2 gap-1 text-white">
            <CardView width={16} height={16} />
            Home
          </li>
        </Link>
        <Link to="/recipes" className="text-white no-underline text-xs">
          <li className="flex flex-col items-center justify-center cursor-pointer px-4 py-2 gap-1 text-white">
            <Search width={16} height={16} />
            Browse
          </li>
        </Link>
        <Link to="/grocery-list" className="text-white no-underline text-xs">
          <li className="flex flex-col items-center justify-center cursor-pointer px-4 py-2 gap-1 text-white">
            <GroceryList width={16} height={16} />
            Grocery List
          </li>
        </Link>
        {isAdmin && (
          <Link to="/recipes/add" className="text-white no-underline text-xs">
            <li className="flex flex-col items-center justify-center cursor-pointer px-4 py-2 gap-1 text-white">
              <Add width={16} height={16} />
              Add Recipe
            </li>
          </Link>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
