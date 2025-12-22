import { Link } from "react-router-dom";
import { NavigationWrapper, NavItem, NavList } from "./styles";
import { useAuth } from "../context/AuthContext";
import { Add, CardView, GroceryList, Search } from "../assets";

const Navigation = () => {
  const { user, isAdmin } = useAuth();

  return (
    <NavigationWrapper>
      <NavList>
        <NavItem>
          <CardView width={16} height={16} />
          <Link to="/">Home</Link>
        </NavItem>
        <NavItem>
          <Search width={16} height={16} />
          <Link to="/recipes">Browse</Link>
        </NavItem>
        {user && (
          <NavItem>
            <GroceryList width={16} height={16} />
            <Link to="/grocery-list">Grocery List</Link>
          </NavItem>
        )}
        {isAdmin && (
          <NavItem>
            <Add width={16} height={16} />
            <Link to="/recipes/add">Add Recipe</Link>
          </NavItem>
        )}
      </NavList>
    </NavigationWrapper>
  );
};

export default Navigation;
