import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";
import Home from "./Home";
import AddEmployee from "./AddEmployee";
import ViewEmployees from "./ViewEmployees";
import AddDocument from "./AddDocument";
import ViewDocuments from "./ViewDocuments";
import AddIssuedDocument from "./AddIssuedDocument";
import ViewIssuedDocuments from "./ViewIssuedDocuments";

const Dashboard = () => {
  const [sidebarItems, setSidebarItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsSidebarOpen(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = (section) => {
    const sidebarData = {
      Employees: [
        { name: "Add Employee", path: "/employees/add" },
        { name: "View Employees", path: "/employees/view" },
      ],
      Documents: [
        { name: "Add Document", path: "/documents/add" },
        { name: "View Documents", path: "/documents/view" },
      ],
      "Issued Documents": [
        { name: "Add Issued Document", path: "/issued-documents/add" },
        { name: "View Issued Documents", path: "/issued-documents/view" },
      ],
    };
    setSidebarItems(sidebarData[section] || []);
  };

  return (
    <Router>
      <div className="h-screen flex flex-col">
        <Navbar
          onNavClick={handleNavClick}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isMobile={isMobile}
          sidebarItems={sidebarItems}
        />
        <div className="flex flex-1">
          {!isMobile && isSidebarOpen && <Sidebar sidebarItems={sidebarItems} />}
          <div className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/employees/add" element={<AddEmployee />} />
              <Route path="/employees/view" element={<ViewEmployees />} />
              <Route path="/documents/add" element={<AddDocument />} />
              <Route path="/documents/view" element={<ViewDocuments />} />
              <Route path="/issued-documents/add" element={<AddIssuedDocument />} />
              <Route path="/issued-documents/view" element={<ViewIssuedDocuments />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default Dashboard;
