import { Link } from "react-router-dom";
import { Settings } from "../assets";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user } = useAuth();
  return (
    <header className="flex items-center justify-center bg-tan-light h-16 fixed left-0 right-0 top-0 z-1000 shadow-md border-b border-tan">
      <Link to="/" className="no-underline text-2xl color-brown">
        Chef Boyar-<span className="text-burgundy">B</span>
      </Link>
      <Link
        to={user ? "/settings" : "/login"}
        className="flex items-center text-burgundy absolute right-4 top-1/2 -translate-y-1/2"
      >
        <Settings width={24} height={24} />
      </Link>
    </header>
  );
};

export default Header;
