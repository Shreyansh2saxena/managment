import React, { useState, useEffect } from "react";
import axios from "axios";

const AttendancePage = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAttendanceRecords();
  }, [selectedMonth]);

  // Fetch attendance records based on selected month
  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8081/attendance/all?month=${selectedMonth}`);
      setAttendanceRecords(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching attendance records", error);
      setError("Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  };

  // Fetch employee name whenever employeeId changes
  useEffect(() => {
    if (employeeId.trim()) {
      fetchEmployeeName(employeeId);
    } else {
      setEmployeeName("");
    }
  }, [employeeId]);

  const fetchEmployeeName = async (id) => {
    if (!id || id.trim() === "") return;
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8081/api/employees/${id}`);
      if (response.data && response.data.name) {
        setEmployeeName(response.data.name);
        setError("");
      } else {
        setEmployeeName("");
        setError("Employee not found");
      }
    } catch (error) {
      console.error("Error fetching employee name", error);
      setEmployeeName("");
      setError("Employee not found");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!employeeId || !employeeName) {
      setError("Please enter a valid Employee ID");
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`http://localhost:8081/attendance/checkin/${employeeId}`);
      setError("");
      // Refresh attendance records after successful check-in
      await fetchAttendanceRecords();
    } catch (error) {
      console.error("Check-in failed", error);
      setError("Check-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!employeeId || !employeeName) {
      setError("Please enter a valid Employee ID");
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`http://localhost:8081/attendance/checkout/${employeeId}`);
      setError("");
      // Refresh attendance records after successful check-out
      await fetchAttendanceRecords();
    } catch (error) {
      console.error("Check-out failed", error);
      setError("Check-out failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeIdChange = (e) => {
    setEmployeeId(e.target.value);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gray-100 min-h-screen">
      <div className="bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Employee Attendance</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <div className="w-full md:w-1/3">
            <label className="block text-gray-700 font-semibold mb-2">Employee ID</label>
            <input
              type="text"
              placeholder="Enter Employee ID"
              value={employeeId}
              onChange={handleEmployeeIdChange}
              className="border p-3 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-300"
            />
          </div>
          
          <div className="w-full md:w-1/3">
            <label className="block text-gray-700 font-semibold mb-2">Employee Name</label>
            <input
              type="text"
              placeholder="Employee Name"
              value={employeeName}
              readOnly
              className="border p-3 rounded-lg w-full bg-gray-100 shadow-sm"
            />
          </div>
          
          <div className="w-full md:w-1/3 flex gap-2 mt-6">
            <button
              onClick={handleCheckIn}
              disabled={loading || !employeeName}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold w-full px-2 py-3 rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Check In"}
            </button>
            
            <button
              onClick={handleCheckOut}
              disabled={loading || !employeeName}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold w-full px-2 py-3 rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Check Out"}
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Select Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border p-3 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-300"
          >
            <option value="">All Months</option>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : attendanceRecords.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300 shadow-md">
              <thead>
                <tr className="bg-gray-200 text-gray-700 text-lg">
                  <th className="border p-4">ID</th>
                  <th className="border p-4">Name</th>
                  <th className="border p-4">Check-in Time</th>
                  <th className="border p-4">Check-out Time</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record) => (
                  <tr key={record.id} className="text-center border hover:bg-gray-100 transition">
                    <td className="border p-4">{record.employeeId}</td>
                    <td className="border p-4">{record.employeeName}</td>
                    <td className="border p-4">{record.checkInTime || "-"}</td>
                    <td className="border p-4">{record.checkOutTime || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-4 text-gray-500">No attendance records found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;