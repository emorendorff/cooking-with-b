import { Link } from "react-router-dom";
import { NavigationWrapper, NavItem, NavList } from "./styles";
import { useAuth } from "../context/AuthContext";

const Navigation = () => {
  const { user, signOut } = useAuth();

  return (
    <NavigationWrapper>
      <NavList>
        <NavItem>
          <Link to="/">Home</Link>
        </NavItem>
        <NavItem>
          <Link to="/recipes">Browse</Link>
        </NavItem>
        <NavItem>
          <Link to="/recipes/add">Add Recipe</Link>
        </NavItem>
        {user && (
          <NavItem>
            <Link to="/grocery-list">Grocery List</Link>
          </NavItem>
        )}
        {user ? (
          <NavItem onClick={() => signOut()} style={{ cursor: "pointer" }}>
            Logout
          </NavItem>
        ) : (
          <NavItem>
            <Link to="/login">Login</Link>
          </NavItem>
        )}
      </NavList>
    </NavigationWrapper>
  );
};

export default Navigation;
