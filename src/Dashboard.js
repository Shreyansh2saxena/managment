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
import MailPage from "./mails"; 
import Vendor from "./Vendor";
import Customer from "./Customer";
import Bill from "./Bill";
import AttendanceRequestForm from "./attendence/AttendanceRequestForm";
import MarkAttendance from "./attendence/MarkAttendance"; 
import LeaveRequest from "./attendence/LeaveRequestDashboard"; 
import OvertimeRequest from "./attendence/OvertimeRequestDashboard"; 
import POHRequest from "./attendence/POHRequestDashboard";
import Attendecenew from "./attendence/Attendancenew";

const Dashboard = () => {
  const [sidebarItems, setSidebarItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
      Vendor: [
        { name: "Vendor", path: "/vendors" },
        { name: "Customer", path: "/customer" },
        { name: "Bill", path: "/bill"},
      ],
      Attendance: [
        
        { name: "Mark Attendence", path: "/attendance/new" },
        { name: "Attendance Request", path: "/attendance/request" },
        { name: "Leave Request", path: "/attendance/leave-request" },
        { name: "Overtime Request", path: "/attendance/overtime-request" },
        { name: "POH Request", path: "/attendance/poh-request" },
        
      ]
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
              {/* Home Route */}
              <Route path="/" element={<Home />} />
              
              {/* Employee Routes */}
              <Route path="/employees/add" element={<AddEmployee />} />
              <Route path="/employees/view" element={<ViewEmployees />} />
              
              {/* Document Routes */}
              <Route path="/documents/add" element={<AddDocument />} />
              <Route path="/documents/view" element={<ViewDocuments />} />
              
              {/* Issued Document Routes */}
              <Route path="/issued-documents/add" element={<AddIssuedDocument />} />
              <Route path="/issued-documents/view" element={<ViewIssuedDocuments />} />
              
              {/* Mail Route */}
              <Route path="/mails" element={<MailPage />} /> 
              
              {/* Vendor Routes */}
              <Route path="/vendors" element={<Vendor />} /> 
              <Route path="/customer" element={<Customer />} /> 
              <Route path="/bill" element={<Bill />} /> 
              
              {/* Attendance Routes */}
              <Route path="/attendance/new" element={<Attendecenew />} />
              <Route path="/attendance/request" element={<AttendanceRequestForm />} />
              <Route path="/attendance/leave-request" element={<LeaveRequest />} />
              <Route path="/attendance/overtime-request" element={<OvertimeRequest />} />
              <Route path="/attendance/poh-request" element={<POHRequest />} />
              
              
             
              
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default Dashboard;