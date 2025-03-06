import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = ({ isMobile, toggleSidebar, onNavClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  // Toggle full mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
    setActiveMenu(null);
  };

  // Toggle specific submenu in mobile view
  const toggleSubMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  // Close menu on suboption click (only for mobile)
  const handleSubOptionClick = (section) => {
    onNavClick(section); // Show suboptions in sidebar (for mobile too)
    setMobileMenuOpen(false);
    setActiveMenu(null);
  };

  return (
    <nav className="bg-gray-600 text-white p-4 flex justify-between items-center shadow-md relative">
      {/* Dashboard Title */}
      <h1 className="text-xl font-bold">DASHBOARD</h1>

      {/* Menu Button for Mobile */}
      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          className="p-2 bg-gray-700 rounded-md focus:outline-none"
        >
          ☰
        </button>
      )}

      {/* Desktop Navigation - No Dropdowns */}
      {!isMobile && (
        <div className="flex space-x-4">
          <Link to="/" className="px-4 hover:text-gray-300">Home</Link>
          <Link to='/' onClick={() => onNavClick("Employees")} className="px-4 hover:text-gray-300">
            Employees
          </Link>
          <Link to="/" onClick={() => onNavClick("Documents")} className="px-4 hover:text-gray-300">
            Documents
          </Link>
          <Link to='/' onClick={() => onNavClick("Issued Documents")} className="px-4 hover:text-gray-300">
            Issued Documents
          </Link>
        </div>
      )}

      {/* Mobile Dropdown Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="absolute top-14 left-0 w-full bg-gray-900 p-4">
          <ul>
            <li>
              <Link to="/" className="block py-2 hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            </li>

            {/* Employees Dropdown in Mobile */}
            <li>
              <button className="w-full text-left py-2 hover:bg-gray-700" onClick={() => toggleSubMenu("Employees")}>
                Employees {activeMenu === "Employees" ? "▲" : "▼"}
              </button>
              {activeMenu === "Employees" && (
                <ul className="ml-4 bg-gray-800 p-2 rounded-md">
                  <li>
                    <Link to="/employees/add" className="block py-2 hover:bg-gray-700" onClick={() => handleSubOptionClick("Employees")}>
                      Add Employee
                    </Link>
                  </li>
                  <li>
                    <Link to="/employees/view" className="block py-2 hover:bg-gray-700" onClick={() => handleSubOptionClick("Employees")}>
                      View Employees
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Documents Dropdown in Mobile */}
            <li>
              <button className="w-full text-left py-2 hover:bg-gray-700" onClick={() => toggleSubMenu("Documents")}>
                Documents {activeMenu === "Documents" ? "▲" : "▼"}
              </button>
              {activeMenu === "Documents" && (
                <ul className="ml-4 bg-gray-800 p-2 rounded-md">
                  <li>
                    <Link to="/documents/add" className="block py-2 hover:bg-gray-700" onClick={() => handleSubOptionClick("Documents")}>
                      Add Document
                    </Link>
                  </li>
                  <li>
                    <Link to="/documents/view" className="block py-2 hover:bg-gray-700" onClick={() => handleSubOptionClick("Documents")}>
                      View Documents
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Issued Documents Dropdown in Mobile */}
            <li>
              <button className="w-full text-left py-2 hover:bg-gray-700" onClick={() => toggleSubMenu("Issued Documents")}>
                Issued Documents {activeMenu === "Issued Documents" ? "▲" : "▼"}
              </button>
              {activeMenu === "Issued Documents" && (
                <ul className="ml-4 bg-gray-800 p-2 rounded-md">
                  <li>
                    <Link to="/issued-documents/add" className="block py-2 hover:bg-gray-700" onClick={() => handleSubOptionClick("Issued Documents")}>
                      Add Issued Document
                    </Link>
                  </li>
                  <li>
                    <Link to="/issued-documents/view" className="block py-2 hover:bg-gray-700" onClick={() => handleSubOptionClick("Issued Documents")}>
                      View Issued Documents
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
