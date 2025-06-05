import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = ({ isMobile, toggleSidebar, onNavClick, onLogout }) => {
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
    <nav className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white shadow-2xl border-b border-slate-600 backdrop-blur-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Welcome Message - Left Side (Start) */}
          <div className="flex justify-start items-center space-x-4">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Welcome, {sessionStorage.getItem("user") || "User"}!
            </h1>
          </div>

          {/* Desktop Navigation - Right Side (End) */}
          {!isMobile && (
            <div className="flex items-center space-x-6">
              <Link 
                to="/dashboard" 
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 hover:text-blue-300 transition-all duration-200 transform hover:scale-105"
              >
                Home
              </Link>
              <Link 
                to="/dashboard" 
                onClick={() => onNavClick("Employees")} 
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 hover:text-blue-300 transition-all duration-200 transform hover:scale-105"
              >
                Employees
              </Link>
              <Link 
                to="/dashboard" 
                onClick={() => onNavClick("Documents")} 
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 hover:text-blue-300 transition-all duration-200 transform hover:scale-105"
              >
                Documents
              </Link>
              <Link 
                to="/dashboard" 
                onClick={() => onNavClick("Issued Documents")} 
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 hover:text-blue-300 transition-all duration-200 transform hover:scale-105"
              >
                Issued Documents
              </Link>
              <Link 
                to="/dashboard" 
                onClick={() => onNavClick("Mails")} 
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 hover:text-blue-300 transition-all duration-200 transform hover:scale-105"
              >
                Mails
              </Link>
              <Link 
                to="/dashboard" 
                onClick={() => onNavClick("Vendor")} 
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 hover:text-blue-300 transition-all duration-200 transform hover:scale-105"
              >
                Vendor
              </Link>
              {/* <Link 
                to="/dashboard" 
                onClick={() => onNavClick("Attendance")} 
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 hover:text-blue-300 transition-all duration-200 transform hover:scale-105"
              >
                Attendance
              </Link> */}
              <button
                onClick={onLogout}
                className="ml-4 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile Menu Button & Logout - Right Side (End) */}
          {isMobile && (
            <div className="flex items-center space-x-3">
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Logout
              </button>
              <button
                onClick={toggleMobileMenu}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          {/* Mobile Menu */}
          <div className="absolute top-16 left-0 right-0 mx-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl z-50 border border-slate-600 backdrop-blur-sm">
            <div className="p-6">
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                  </Link>
                </li>

                {/* Employees Menu */}
                <li>
                  <button 
                    className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-slate-700 transition-all duration-200 transform hover:scale-105" 
                    onClick={() => toggleSubMenu("Employees")}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      Employees
                    </div>
                    <svg 
                      className={`w-5 h-5 transition-transform duration-200 ${activeMenu === "Employees" ? "rotate-180" : ""}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeMenu === "Employees" && (
                    <ul className="ml-8 mt-2 space-y-1 bg-slate-800 rounded-lg p-3 border border-slate-600">
                      <li>
                        <Link 
                          to="/dashboard/employees/add" 
                          className="block p-2 rounded-md hover:bg-slate-700 transition-all duration-150 text-sm" 
                          onClick={() => handleSubOptionClick("Employees")}
                        >
                          Add Employee
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/dashboard/employees/view" 
                          className="block p-2 rounded-md hover:bg-slate-700 transition-all duration-150 text-sm" 
                          onClick={() => handleSubOptionClick("Employees")}
                        >
                          View Employees
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Documents Menu */}
                <li>
                  <button 
                    className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-slate-700 transition-all duration-200 transform hover:scale-105" 
                    onClick={() => toggleSubMenu("Documents")}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Documents
                    </div>
                    <svg 
                      className={`w-5 h-5 transition-transform duration-200 ${activeMenu === "Documents" ? "rotate-180" : ""}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeMenu === "Documents" && (
                    <ul className="ml-8 mt-2 space-y-1 bg-slate-800 rounded-lg p-3 border border-slate-600">
                      <li>
                        <Link 
                          to="/dashboard/documents/add" 
                          className="block p-2 rounded-md hover:bg-slate-700 transition-all duration-150 text-sm" 
                          onClick={() => handleSubOptionClick("Documents")}
                        >
                          Add Document
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/dashboard/documents/view" 
                          className="block p-2 rounded-md hover:bg-slate-700 transition-all duration-150 text-sm" 
                          onClick={() => handleSubOptionClick("Documents")}
                        >
                          View Documents
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Issued Documents Menu */}
                <li>
                  <button 
                    className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-slate-700 transition-all duration-200 transform hover:scale-105" 
                    onClick={() => toggleSubMenu("Issued Documents")}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      Issued Documents
                    </div>
                    <svg 
                      className={`w-5 h-5 transition-transform duration-200 ${activeMenu === "Issued Documents" ? "rotate-180" : ""}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeMenu === "Issued Documents" && (
                    <ul className="ml-8 mt-2 space-y-1 bg-slate-800 rounded-lg p-3 border border-slate-600">
                      <li>
                        <Link 
                          to="/dashboard/issued-documents/add" 
                          className="block p-2 rounded-md hover:bg-slate-700 transition-all duration-150 text-sm" 
                          onClick={() => handleSubOptionClick("Issued Documents")}
                        >
                          Add Issued Document
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/dashboard/issued-documents/view" 
                          className="block p-2 rounded-md hover:bg-slate-700 transition-all duration-150 text-sm" 
                          onClick={() => handleSubOptionClick("Issued Documents")}
                        >
                          View Issued Documents
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Mails Menu */}
                <li>
                  <button 
                    className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-slate-700 transition-all duration-200 transform hover:scale-105" 
                    onClick={() => toggleSubMenu("Mails")}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Mails
                    </div>
                    <svg 
                      className={`w-5 h-5 transition-transform duration-200 ${activeMenu === "Mails" ? "rotate-180" : ""}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeMenu === "Mails" && (
                    <ul className="ml-8 mt-2 space-y-1 bg-slate-800 rounded-lg p-3 border border-slate-600">
                      <li>
                        <Link 
                          to="/dashboard/mails" 
                          className="block p-2 rounded-md hover:bg-slate-700 transition-all duration-150 text-sm" 
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Mail
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/dashboard/mails/records" 
                          className="block p-2 rounded-md hover:bg-slate-700 transition-all duration-150 text-sm" 
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Mail Records
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Vendor */}
                <li>
                  <Link 
                    to="/dashboard/Vendor" 
                    className="flex items-center w-full p-3 rounded-lg hover:bg-slate-700 transition-all duration-200 transform hover:scale-105" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Bill
                  </Link>
                </li>

                {/* Attendance Menu */}
                {/* <li>
                  <button 
                    className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-slate-700 transition-all duration-200 transform hover:scale-105" 
                    onClick={() => toggleSubMenu("Attendance")}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Attendance
                    </div>
                    <svg 
                      className={`w-5 h-5 transition-transform duration-200 ${activeMenu === "Attendance" ? "rotate-180" : ""}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeMenu === "Attendance" && (
                    <ul className="ml-8 mt-2 space-y-1 bg-slate-800 rounded-lg p-3 border border-slate-600">
                      <li>
                        <Link 
                          to="/dashboard/attendance/mark" 
                          className="block p-2 rounded-md hover:bg-slate-700 transition-all duration-150 text-sm" 
                          onClick={() => handleSubOptionClick("Attendance")}
                        >
                          Mark Attendance
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/dashboard/attendance/request" 
                          className="block p-2 rounded-md hover:bg-slate-700 transition-all duration-150 text-sm" 
                          onClick={() => handleSubOptionClick("Attendance")}
                        >
                          Attendance Request
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/dashboard/attendance/leave-request" 
                          className="block p-2 rounded-md hover:bg-slate-700 transition-all duration-150 text-sm" 
                          onClick={() => handleSubOptionClick("Attendance")}
                        >
                          Leave Request
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/dashboard/attendance/overtime-request" 
                          className="block p-2 rounded-md hover:bg-slate-700 transition-all duration-150 text-sm" 
                          onClick={() => handleSubOptionClick("Attendance")}
                        >
                          Overtime Request
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/dashboard/attendance/poh-request" 
                          className="block p-2 rounded-md hover:bg-slate-700 transition-all duration-150 text-sm" 
                          onClick={() => handleSubOptionClick("Attendance")}
                        >
                          POH Request
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/dashboard/attendance/new" 
                          className="block p-2 rounded-md hover:bg-slate-700 transition-all duration-150 text-sm" 
                          onClick={() => handleSubOptionClick("Attendance")}
                        >
                          Attendance New
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/dashboard/attendance/setleave" 
                          className="block p-2 rounded-md hover:bg-slate-700 transition-all duration-150 text-sm" 
                          onClick={() => handleSubOptionClick("Attendance")}
                        >
                          Set Leave
                        </Link>
                      </li>
                    </ul>
                  )}
                </li> */}

                {/* Logout */}
                <li className="pt-4 border-t border-slate-600">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="flex items-center w-full p-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;