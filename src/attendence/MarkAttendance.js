import React, { useState, useEffect } from "react";

const MarkAttendance = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [isPunchedOut, setIsPunchedOut] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("0h 0m 0s");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}") || {};
  const employeeId = user?.id || "unknown";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchAttendanceStatus = async () => {
      try {
        if (employeeId === "unknown") throw new Error("Invalid employee ID");
        const date = new Date().toISOString().split("T")[0];
        const response = await fetch(`http://localhost:8080/attendance/details/${employeeId}/${date}`);
        if (!response.ok) throw new Error("Failed to fetch attendance data");
        const data = await response.json();
        if (data?.checkInTime) {
          setIsPunchedIn(true);
          setPunchInTime(new Date(data.checkInTime));
          if (data.checkOutTime) setIsPunchedOut(true);
        }
      } catch (error) {
        console.error("Error fetching attendance status:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendanceStatus();
  }, [employeeId]);

  useEffect(() => {
    if (punchInTime && !isPunchedOut) {
      const interval = setInterval(() => {
        const now = new Date();
        const diffMs = now - punchInTime;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        setElapsedTime(`${hours}h ${minutes}m ${seconds}s`);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [punchInTime, isPunchedOut]);

  const handlePunchIn = async () => {
    try {
      if (employeeId === "unknown") throw new Error("Invalid employee ID");
      const response = await fetch(`http://localhost:8080/attendance/checkin/${employeeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to punch in");
      alert("✅ Punched In Successfully");
      setIsPunchedIn(true);
      setPunchInTime(new Date());
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const handlePunchOut = async () => {
    if (!isPunchedIn) return alert("⚠️ You must punch in first!");
    try {
      const response = await fetch(`http://localhost:8080/attendance/checkout/${employeeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to punch out");
      alert("✅ Punched Out Successfully");
      setIsPunchedOut(true);
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  if (loading) return <p className="text-center text-gray-500 text-xl">Loading attendance data...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl p-12 bg-white shadow-xl rounded-2xl text-center">
        <h2 className="text-4xl font-bold text-gray-800">Mark Attendance</h2>
        <p className="text-gray-600 mt-3 text-xl">{currentTime.toLocaleDateString()} | {currentTime.toLocaleTimeString()}</p>
        <p className="text-gray-700 mt-6 text-xl font-medium">Effective Hours: {elapsedTime}</p>
        <div className="flex justify-center gap-8 mt-10">
          <button
            onClick={handlePunchIn}
            disabled={isPunchedIn}
            className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 ${
              isPunchedIn ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            Punch In
          </button>
          <button
            onClick={handlePunchOut}
            disabled={!isPunchedIn || isPunchedOut}
            className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 ${
              !isPunchedIn || isPunchedOut ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            Punch Out
          </button>
        </div>
        {isPunchedIn && !isPunchedOut && <p className="text-green-600 mt-8 text-xl">✅ You have punched in.</p>}
        {isPunchedOut && <p className="text-red-600 mt-8 text-xl">✅ You have punched out for today.</p>}
      </div>
    </div>
  );
};

export default MarkAttendance;
