import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = ({ isMobile, toggleSidebar, onNavClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
    setActiveMenu(null);
  };

  const toggleSubMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleSubOptionClick = (section) => {
    onNavClick(section);
    setMobileMenuOpen(false);
    setActiveMenu(null);
  };

  return (
    <nav className="bg-gray-600 text-white p-4 flex justify-between items-center shadow-md relative">
      <h1 className="text-xl font-bold">DASHBOARD</h1>

      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          className="p-2 bg-gray-700 rounded-md focus:outline-none"
        >
          ☰
        </button>
      )}

      {!isMobile && (
        <div className="flex space-x-4">
          <Link to="/" className="px-4 hover:text-gray-300">Home</Link>
          <Link to="/" onClick={() => onNavClick("Employees")} className="px-4 hover:text-gray-300">Employees</Link>
          <Link to="/" onClick={() => onNavClick("Documents")} className="px-4 hover:text-gray-300">Documents</Link>
          <Link to="/" onClick={() => onNavClick("Issued Documents")} className="px-4 hover:text-gray-300">Issued Documents</Link>
          <Link to="/" onClick={() => onNavClick("Mails")} className="px-4 hover:text-gray-300">Mails</Link>
          <Link to="/" onClick={() => onNavClick("Vendor")} className="px-4 hover:text-gray-300">Vendor</Link>
          <Link to="/" onClick={() => onNavClick("Attendance")} className="px-4 hover:text-gray-300">Attendance</Link>
        </div>
      )}

      {isMobile && mobileMenuOpen && (
        <div className="absolute top-14 left-0 w-full bg-gray-900 p-4">
          <ul>
            <li>
              <Link to="/" className="block py-2 hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            </li>
            <li>
              <button className="w-full text-left py-2 hover:bg-gray-700" onClick={() => toggleSubMenu("Employees")}>
                Employees {activeMenu === "Employees" ? "▲" : "▼"}
              </button>
              {activeMenu === "Employees" && (
                <ul className="ml-4 bg-gray-800 p-2 rounded-md">
                  <li>
                    <Link to="/employees/add" className="block py-2 hover:bg-gray-700" onClick={() => handleSubOptionClick("Employees")}>Add Employee</Link>
                  </li>
                  <li>
                    <Link to="/employees/view" className="block py-2 hover:bg-gray-700" onClick={() => handleSubOptionClick("Employees")}>View Employees</Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button className="w-full text-left py-2 hover:bg-gray-700" onClick={() => toggleSubMenu("Documents")}>
                Documents {activeMenu === "Documents" ? "▲" : "▼"}
              </button>
              {activeMenu === "Documents" && (
                <ul className="ml-4 bg-gray-800 p-2 rounded-md">
                  <li>
                    <Link to="/documents/add" className="block py-2 hover:bg-gray-700" onClick={() => handleSubOptionClick("Documents")}>Add Document</Link>
                  </li>
                  <li>
                    <Link to="/documents/view" className="block py-2 hover:bg-gray-700" onClick={() => handleSubOptionClick("Documents")}>View Documents</Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button className="w-full text-left py-2 hover:bg-gray-700" onClick={() => toggleSubMenu("Issued Documents")}>
                Issued Documents {activeMenu === "Issued Documents" ? "▲" : "▼"}
              </button>
              {activeMenu === "Issued Documents" && (
                <ul className="ml-4 bg-gray-800 p-2 rounded-md">
                  <li>
                    <Link to="/issued-documents/add" className="block py-2 hover:bg-gray-700" onClick={() => handleSubOptionClick("Issued Documents")}>Add Issued Document</Link>
                  </li>
                  <li>
                    <Link to="/issued-documents/view" className="block py-2 hover:bg-gray-700" onClick={() => handleSubOptionClick("Issued Documents")}>View Issued Documents</Link>
                  </li>
                </ul>
              )}
            </li>
             {/* Mails Submenu */}
             <li>
              <button className="w-full text-left py-2 hover:bg-gray-700" onClick={() => toggleSubMenu("Mails")}>
                Mails {activeMenu === "Mails" ? "▲" : "▼"}
              </button>
              {activeMenu === "Mails" && (
                <ul className="ml-4 bg-gray-800 p-2 rounded-md">
                  <li>
                    <Link to="/mails" className="block py-2 hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>Mail</Link>
                  </li>
                  <li>
                    <Link to="/mails/records" className="block py-2 hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>Mail Records</Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              
              <Link to="/Vendor" className="block py-2 hover:bg-gray-700 font-semibold" onClick={() => setMobileMenuOpen(false)}>bill</Link>
            </li>
            <li>
              <button 
                className="w-full text-left py-2 hover:bg-gray-700" 
                onClick={() => toggleSubMenu("Attendance")}
              >
                Attendance {activeMenu === "Attendance" ? "▲" : "▼"}
              </button>
              {activeMenu === "Attendance" && (
                <ul className="ml-4 bg-gray-800 p-2 rounded-md">
                  <li>
                    <Link 
                      to="/attendance/mark" 
                      className="block py-2 hover:bg-gray-700" 
                      onClick={() => handleSubOptionClick("Attendance")}
                    >
                      Mark Attendance
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/attendance/request" 
                      className="block py-2 hover:bg-gray-700" 
                      onClick={() => handleSubOptionClick("Attendance")}
                    >
                      Attendance Request
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/attendance/leave-request" 
                      className="block py-2 hover:bg-gray-700" 
                      onClick={() => handleSubOptionClick("Attendance")}
                    >
                      Leave Request
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/attendance/overtime-request" 
                      className="block py-2 hover:bg-gray-700" 
                      onClick={() => handleSubOptionClick("Attendance")}
                    >
                      Overtime Request
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/attendance/poh-request" 
                      className="block py-2 hover:bg-gray-700" 
                      onClick={() => handleSubOptionClick("Attendance")}
                    >
                      POH Request
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/attendance/new" 
                      className="block py-2 hover:bg-gray-700" 
                      onClick={() => handleSubOptionClick("Attendance")}
                    >
                      Attendance New
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
