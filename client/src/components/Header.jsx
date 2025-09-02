import { UserCog } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="page bg-gray-100">
      <Link to={"/"} className="flex items-center gap-3">
        <span className="p-2 rounded-full bg-black flex-center">
          <UserCog size={24} color="white" className="pl-1" />
        </span>
        <h1 className="text-3xl font-black font-playfair">Management</h1>
      </Link>
    </header>
  );
};

export default Header;
