import React, { useState, useEffect } from "react";

const MarkAttendance = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [effectiveHours, setEffectiveHours] = useState("0h 0m 0s");

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const employeeId = user.id || "unknown";
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchAttendanceData();
    fetchAttendanceLogs();
  }, [selectedMonth]);

  useEffect(() => {
    if (punchInTime && !punchOutTime) {
      const interval = setInterval(() => {
        setEffectiveHours(calculateEffectiveHours(punchInTime, new Date()));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [punchInTime, punchOutTime]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const date = new Date().toISOString().split("T")[0];
      const response = await fetch(`http://localhost:8080/attendance/details/${employeeId}/${date}`);
      if (!response.ok) throw new Error("Failed to fetch attendance data");

      const data = await response.json();
      if (data?.checkInTime) {
        setPunchInTime(new Date(`${data.date}T${data.checkInTime}`));
        if (data.checkOutTime) {
          setPunchOutTime(new Date(`${data.date}T${data.checkOutTime}`));
        }
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceLogs = async () => {
    try {
      const response = await fetch(`http://localhost:8080/attendance/logs/${employeeId}/${currentYear}/${selectedMonth}`);
      if (!response.ok) throw new Error("Failed to fetch attendance logs");

      const logs = await response.json();
      const formattedLogs = logs.map(log => ({
        ...log,
        checkInTime: log.checkInTime ? new Date(`${log.date}T${log.checkInTime}`) : null,
        checkOutTime: log.checkOutTime ? new Date(`${log.date}T${log.checkOutTime}`) : null,
      }));
      setAttendanceLogs(formattedLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const handlePunch = async () => {
    try {
      const isPunchingOut = punchInTime && !punchOutTime;
      const url = isPunchingOut
        ? `http://localhost:8080/attendance/checkout/${employeeId}`
        : `http://localhost:8080/attendance/checkin/${employeeId}`;

      if (!punchInTime) setPunchInTime(new Date());
      else if (!punchOutTime) setPunchOutTime(new Date());

      const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" } });
      if (!response.ok) throw new Error("Failed to mark attendance");

      alert(`✅ ${isPunchingOut ? "Punched Out" : "Punched In"}`);
      fetchAttendanceData();
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const calculateEffectiveHours = (inTime, outTime) => {
    if (!inTime) return "0h 0m 0s";
    const diff = Math.max((outTime - inTime) / 1000, 0);
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = Math.floor(diff % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading attendance data...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-4">Mark Attendance</h2>
      <p className="text-gray-600 text-center">Date: {currentTime.toLocaleDateString()}</p>
      <p className="text-gray-600 text-center">Time: {currentTime.toLocaleTimeString()}</p>
  
      {punchInTime && (
        <p className="text-blue-600 font-semibold text-center mt-2">
          Effective Hours: {effectiveHours}
        </p>
      )}
  
      <div className="flex justify-center mt-4">
        <button
          className={`px-4 py-2 font-semibold text-white rounded-lg ${
            punchInTime ? "bg-red-500" : "bg-green-500"
          } ${punchInTime && punchOutTime ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handlePunch}
          disabled={punchInTime && punchOutTime}
        >
          {punchInTime ? (punchOutTime ? "Attendance Completed" : "Punch Out") : "Punch In"}
        </button>
      </div>
  
      <div className="mt-6">
        <label className="block font-semibold text-gray-700">Select Month:</label>
        <select
          className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
      </div>
  
      <h3 className="text-lg font-semibold mt-6">Attendance Logs</h3>
      <div className="mt-3">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border">Employee ID</th>
              <th className="p-3 border">Employee Name</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Punch In</th>
              <th className="p-3 border">Punch Out</th>
              <th className="p-3 border">Hours Worked</th>
            </tr>
          </thead>
          <tbody>
            {attendanceLogs.length > 0 ? (
              attendanceLogs.map((log, index) => (
                <tr key={index} className="odd:bg-gray-100">
                  <td className="p-3 border">{log.employeeId}</td>
                  <td className="p-3 border">{log.employeeName || "N/A"}</td>
                  <td className="p-3 border">{log.date}</td>
                  <td className="p-3 border">
                    {log.checkInTime ? log.checkInTime.toLocaleTimeString() : "-"}
                  </td>
                  <td className="p-3 border">
                    {log.checkOutTime ? log.checkOutTime.toLocaleTimeString() : "-"}
                  </td>
                  <td className="p-3 border">
                    {calculateEffectiveHours(log.checkInTime, log.checkOutTime)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-3 border text-center text-gray-500">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  
  );
};

export default MarkAttendance;
