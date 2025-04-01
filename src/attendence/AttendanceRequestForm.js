import React, { useState, useEffect } from "react";

const AttendanceRequestForm = () => {
  const [employee, setEmployee] = useState({ id: "", name: "", email: "" });
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setEmployee({
      id: storedUser.id || "",
      name: storedUser.name || "",
      email: storedUser.email || "",
    });
  }, []);

  const formatTimeToISO = (time) => {
    return `${time}:00.000000`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || !time) {
      alert(" Please select a date and time!");
      return;
    }

    const formattedTime = formatTimeToISO(time);

    const requestData = new URLSearchParams();
    requestData.append("employeeId", employee.id);
    requestData.append("date", date);
    requestData.append("requestedTime", formattedTime);

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/attendance-requests/create", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: requestData.toString(),
      });

      const textResponse = await response.text();
      console.log("Raw Response:", textResponse);

      let responseData;
      try {
        responseData = JSON.parse(textResponse);
      } catch (error) {
        responseData = { message: textResponse };
      }

      if (response.ok) {
        alert(` ${responseData.message || "Request submitted successfully!"}`);
        setDate("");
        setTime("");
      } else {
        alert(` Error: ${responseData.error || "Invalid request"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(" An error occurred while submitting your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Request Attendance Change</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={employee.id}
            onChange={(e) => setEmployee({...employee, id: e.target.value})}
            className="w-full p-2 border rounded-lg"
            placeholder="Employee ID"
          />
          <input
            type="text"
            value={employee.name}
            onChange={(e) => setEmployee({...employee, name: e.target.value})}
            className="w-full p-2 border rounded-lg"
            placeholder="Name"
          />
          <input
            type="email"
            value={employee.email}
            onChange={(e) => setEmployee({...employee, email: e.target.value})}
            className="w-full p-2 border rounded-lg"
            placeholder="Email"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Send Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AttendanceRequestForm;