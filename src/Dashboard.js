import { Routes, Route } from "react-router-dom";
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
import LeaveRequest from "./attendence/LeaveRequestDashboard";
import OvertimeRequest from "./attendence/OvertimeRequestDashboard";
import POHRequest from "./attendence/POHRequestDashboard";
import Attendecenew from "./attendence/Attendancenew";
import MonthSummaryForm from "./attendence/Monthsummary";
import Weekend from "./attendence/Weekendconf";
import Mailtable from "./Mailtable";
import Setleave from "./attendence/Setleave";


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
        { name: "Add Employee", path: "/dashboard/employees/add" },
        { name: "View Employees", path: "/dashboard/employees/view" },
      ],
      Documents: [
        { name: "Add Document", path: "/dashboard/documents/add" },
        { name: "View Documents", path: "/dashboard/documents/view" },
      ],
      "Issued Documents": [
        { name: "Add Issued Document", path: "/dashboard/issued-documents/add" },
        { name: "View Issued Documents", path: "/dashboard/issued-documents/view" },
      ],
      Vendor: [
        { name: "Vendor", path: "/dashboard/vendors" },
        { name: "Customer", path: "/dashboard/customer" },
        { name: "Bill", path: "/dashboard/bill" },
      ],
      // Attendance: [
      //   { name: "Mark Attendence", path: "/dashboard/attendance/new" },
      //   { name: "Attendance Request", path: "/dashboard/attendance/request" },
      //   { name: "Leave Request", path: "/dashboard/attendance/leave-request" },
      //   { name: "Overtime Request", path: "/dashboard/attendance/overtime-request" },
      //   { name: "POH Request", path: "/dashboard/attendance/poh-request" },
      //   { name: "Attendance Summary", path: "/dashboard/attendance/month" },
      //   { name: "Set Weekend", path: "/dashboard/attendance/weekend" },
      //   { name: "appoint leave", path: "/dashboard/attendance/setleave" },
      // ],
      Mails: [
        { name: "Mail", path: "/dashboard/mails" },
        { name: "Mail Records", path: "/dashboard/mails/records" },
      ],
    };
    setSidebarItems(sidebarData[section] || []);
  };

  // Logout function
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    window.location.href = '/signin';
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar
        onNavClick={handleNavClick}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobile={isMobile}
        sidebarItems={sidebarItems}
        onLogout={handleLogout}
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

            {/* Mail Routes */}
            <Route path="/mails" element={<MailPage />} />
            <Route path="/mails/records" element={<Mailtable />} />

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
            <Route path="/attendance/month" element={<MonthSummaryForm />} />
            <Route path="/attendance/weekend" element={<Weekend />} />
            <Route path="/attendance/setleave" element={<Setleave />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;