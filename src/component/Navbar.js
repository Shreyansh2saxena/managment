import { Link } from "react-router-dom";

const Navbar = ({ onNavClick, toggleSidebar }) => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
     
      {/* Dashboard Title */}
      <h1 className="text-xl font-bold">DASHBOARD</h1>
      

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-4">
        <Link to="/" className="px-4 hover:text-gray-300" onClick={() => onNavClick("Home")}>
          Home
        </Link>
        <button className="px-4 hover:text-gray-300" onClick={() => onNavClick("Employees")}>
          Employees
        </button>
        <button className="px-4 hover:text-gray-300" onClick={() => onNavClick("Documents")}>
          Documents
        </button>
        <button className="px-4 hover:text-gray-300" onClick={() => onNavClick("Issued Documents")}>
          Issued Documents
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
