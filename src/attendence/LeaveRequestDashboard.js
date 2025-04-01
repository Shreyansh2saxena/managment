import React, { useState, useEffect } from "react";
import axios from "axios";

const LeaveRequestDashboard = () => {
  const [leaveType, setLeaveType] = useState("");
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDayType, setHalfDayType] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [reason, setReason] = useState("");
  const [employeeIdInput, setEmployeeIdInput] = useState("");
  const [employeeName, setEmployeeName] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const storedEmployeeId = user.id || "";
  const storedEmployeeName = user.name || "";

  useEffect(() => {
    setEmployeeIdInput(storedEmployeeId);
    setEmployeeName(storedEmployeeName);
  }, [storedEmployeeId, storedEmployeeName]);

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/leaves/get/${employeeIdInput || storedEmployeeId}`);
      console.log("API Response:", response.data);

      const formattedData = response.data.totalLeaves.map((leave) => ({
        ...leave,
        leaveDate: new Date(leave.leaveDate).toLocaleDateString(),
      }));

      setLeaveRequests(formattedData);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };

  useEffect(() => {
    if (employeeIdInput) {
      fetchLeaveRequests();
    }
  }, [employeeIdInput]);

  const handleRequestLeave = async () => {
    if (!employeeIdInput) {
      alert("❌ Please enter an Employee ID.");
      return;
    }

    if (!leaveType) {
      alert("❌ Please select a leave type.");
      return;
    }

    if (!reason.trim()) {
      alert("❌ Please provide a reason for your leave.");
      return;
    }

    const leaveData = {
      employeeId: employeeIdInput,
      employeeName: employeeName,
      leaveType,
      leaveStatus: "Pending",
      isHalfDay,
      halfDayType: isHalfDay ? halfDayType : null,
      leaveDate: selectedDate,
      reason: reason
    };

    try {
      await axios.post("http://localhost:8080/leaves/apply", leaveData);
      alert("✅ Leave request submitted successfully!");
      fetchLeaveRequests();
      resetForm();
    } catch (error) {
      alert("❌ Error submitting leave request: " + error.message);
    }
  };

  const resetForm = () => {
    setLeaveType("");
    setIsHalfDay(false);
    setHalfDayType("");
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setReason("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Leave Request</h2>

        <div className="mb-4">
          <label className="block text-left text-gray-700 mb-1">Employee ID</label>
          <input
            type="text"
            value={employeeIdInput}
            onChange={(e) => setEmployeeIdInput(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter Employee ID"
          />
        </div>

        <div className="mb-4">
          <label className="block text-left text-gray-700 mb-1">Employee Name</label>
          <input
            type="text"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter Employee Name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-left text-gray-700 mb-1">Leave Type</label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select Leave Type</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Paid Leave">Paid Leave</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-left text-gray-700 mb-1">Leave Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isHalfDay}
            onChange={() => setIsHalfDay(!isHalfDay)}
            className="mr-2"
            id="halfDayCheckbox"
          />
          <label htmlFor="halfDayCheckbox">Apply for Half Day</label>
        </div>

        {isHalfDay && (
          <div className="mb-4">
            <label className="block text-left text-gray-700 mb-1">Half Day Type</label>
            <select
              value={halfDayType}
              onChange={(e) => setHalfDayType(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select Half Day Type</option>
              <option value="First Half">First Half</option>
              <option value="Second Half">Second Half</option>
            </select>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-left text-gray-700 mb-1">Reason for Leave</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border rounded-lg"
            rows="3"
            placeholder="Please provide a reason for your leave request"
          ></textarea>
        </div>

        <button
          onClick={handleRequestLeave}
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Submit Request
        </button>
      </div>

      <h3 className="text-xl font-semibold mt-6">Your Leave Requests</h3>
      <div className="bg-white shadow-lg rounded-lg p-4 mt-2 max-w-5xl w-full overflow-x-auto">
        {leaveRequests.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Employee ID</th>
                <th className="p-2 border">Employee Name</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Leave Type</th>
                <th className="p-2 border">Duration</th>
                <th className="p-2 border">Reason</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((leave, index) => (
                <tr key={index} className="border">
                  <td className="p-2 border">{leave.employeeId}</td>
                  <td className="p-2 border">{leave.employeeName || "N/A"}</td>
                  <td className="p-2 border">{leave.leaveDate}</td>
                  <td className="p-2 border">{leave.leaveType}</td>
                  <td className="p-2 border">{leave.isHalfDay ? leave.halfDayType : "Full Day"}</td>
                  <td className="p-2 border">{leave.reason || "Not specified"}</td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                      ${leave.leaveStatus === "Approved" ? "bg-green-100 text-green-800" : 
                        leave.leaveStatus === "Rejected" ? "bg-red-100 text-red-800" : 
                        "bg-yellow-100 text-yellow-800"}`}>
                      {leave.leaveStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 text-center">No leave requests found.</p>
        )}
      </div>
    </div>
  );
};

export default LeaveRequestDashboard;