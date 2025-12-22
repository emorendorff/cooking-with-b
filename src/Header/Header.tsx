import { Link } from "react-router-dom";
import { Settings } from "../assets";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user } = useAuth();
  return (
    <header className="flex items-center justify-center bg-cream h-16 fixed left-0 right-0 top-0 z-[1000]">
      <Link to="/" className="no-underline">
        <h1>
          Chef Boyar-<span className="text-copper">B</span>
        </h1>
      </Link>
      <Link
        to={user ? "/settings" : "/login"}
        className="flex items-center text-copper absolute right-4 top-1/2 -translate-y-1/2"
      >
        <Settings width={24} height={24} />
      </Link>
    </header>
  );
};

export default Header;
