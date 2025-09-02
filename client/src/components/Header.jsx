import React from "react";
import { UserCog } from "lucide-react";

const Header = () => {
  return (
    <header className="page flex items-center gap-3 bg-gray-100">
      <span className="p-2 rounded-full bg-black flex-center">
        <UserCog size={24} color="white" className="pl-1" />
      </span>
      <h1 className="text-3xl font-black font-playfair">Management</h1>
    </header>
  );
};

export default Header;
