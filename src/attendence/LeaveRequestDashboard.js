import React, { useState, useEffect } from "react";
import axios from "axios";

const LeaveRequestDashboard = () => {
  const [leaveType, setLeaveType] = useState("");
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDayType, setHalfDayType] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const employeeId = user.id || "unknown";

  console.log("Employee ID:", employeeId);

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/leaves/get/${employeeId}`);
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
    fetchLeaveRequests();
  }, []);

  const handleRequestLeave = async () => {
    if (!leaveType) {
      alert("❌ Please select a leave type.");
      return;
    }

    const leaveData = {
      employeeId,
      leaveType,
      leaveStatus: "Pending",
      isHalfDay,
      halfDayType: isHalfDay ? halfDayType : null,
      leaveDate: selectedDate,
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
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Leave Request</h2>

        <select
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
          className="w-full p-2 border rounded-lg mb-2"
        >
          <option value="">Select Leave Type</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Casual Leave">Casual Leave</option>
          <option value="Paid Leave">Paid Leave</option>
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-2 border rounded-lg mb-2"
        />

        <div className="flex items-center justify-center mb-2">
          <input
            type="checkbox"
            checked={isHalfDay}
            onChange={() => setIsHalfDay(!isHalfDay)}
            className="mr-2"
          />
          <label>Apply for Half Day</label>
        </div>

        {isHalfDay && (
          <select
            value={halfDayType}
            onChange={(e) => setHalfDayType(e.target.value)}
            className="w-full p-2 border rounded-lg mb-2"
          >
            <option value="">Select Half Day Type</option>
            <option value="First Half">First Half</option>
            <option value="Second Half">Second Half</option>
          </select>
        )}

        <button
          onClick={handleRequestLeave}
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Submit Request
        </button>
      </div>

      <h3 className="text-xl font-semibold mt-6">Your Leave Requests</h3>
      <div className="bg-white shadow-lg rounded-lg p-4 mt-2 max-w-lg w-full">
        {leaveRequests.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Duration</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((leave, index) => (
                <tr key={index} className="border">
                  <td className="p-2 border">{leave.leaveDate}</td>
                  <td className="p-2 border">{leave.leaveType}</td>
                  <td className="p-2 border">{leave.halfDay ? leave.halfDayType : "Full Day"}</td>
                  <td className="p-2 border">{leave.leaveStatus}</td>
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
