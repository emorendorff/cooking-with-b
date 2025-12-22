import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Add, CardView, GroceryList, Search } from "../assets";

const Navigation = () => {
  const { isAdmin } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-burgundy h-16 z-[1000]">
      <ul className="flex justify-around list-none m-0 p-0 h-full">
        <li className="flex flex-col items-center justify-center cursor-pointer px-4 py-2 gap-1 text-white">
          <CardView width={16} height={16} />
          <Link to="/" className="text-white no-underline text-xs">Home</Link>
        </li>
        <li className="flex flex-col items-center justify-center cursor-pointer px-4 py-2 gap-1 text-white">
          <Search width={16} height={16} />
          <Link to="/recipes" className="text-white no-underline text-xs">Browse</Link>
        </li>
        <li className="flex flex-col items-center justify-center cursor-pointer px-4 py-2 gap-1 text-white">
          <GroceryList width={16} height={16} />
          <Link to="/grocery-list" className="text-white no-underline text-xs">Grocery List</Link>
        </li>
        {isAdmin && (
          <li className="flex flex-col items-center justify-center cursor-pointer px-4 py-2 gap-1 text-white">
            <Add width={16} height={16} />
            <Link to="/recipes/add" className="text-white no-underline text-xs">Add Recipe</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
