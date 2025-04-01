import React, { useState, useEffect } from "react";

const POHRequestDashboard = () => {
  const [pohRequests, setPohRequests] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [employeeIdInput, setEmployeeIdInput] = useState("");
  const [employeeNameInput, setEmployeeNameInput] = useState("");
  const [employeeId, setEmployeeId] = useState(""); // Will hold the logged-in employeeId
  const [employeeName, setEmployeeName] = useState(""); // Will hold the logged-in employeeName

  // UseEffect will run only if employeeId is set (no array size change)
  useEffect(() => {
    if (employeeId) {
      fetchPOHRequests();
    }
  }, [employeeId]); // Dependency on employeeId

  const fetchPOHRequests = async () => {
    try {
      const response = await fetch(`http://localhost:8081/poh/employee/${employeeId}`);
      if (!response.ok) throw new Error("Failed to fetch POH requests");

      const data = await response.json();
      setPohRequests(data);
    } catch (error) {
      console.error("Error fetching POH requests:", error);
    }
  };

  const handleRequestPOH = async () => {
    try {
      // Submit POH request, employeeIdInput is used if the employeeId is not available
      const response = await fetch(
        `http://localhost:8081/poh/save?employeeId=${employeeIdInput || employeeId}&date=${selectedDate}`,
        { method: "POST" }
      );

      if (!response.ok) throw new Error("Failed to request POH");

      alert("✅ POH request submitted successfully!");
      fetchPOHRequests(); // Fetch the updated POH requests list
      setSelectedDate(new Date().toISOString().split("T")[0]);
      setEmployeeIdInput("");
      setEmployeeNameInput("");
    } catch (error) {
      alert("❌ Error submitting POH request: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* Request Form */}
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">POH Request</h2>

        <div className="mt-4 text-left">
          <label className="block text-gray-600 font-medium">Employee ID</label>
          <input
            type="text"
            value={employeeIdInput}
            onChange={(e) => setEmployeeIdInput(e.target.value)}
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Enter Employee ID"
          />
        </div>

        <div className="mt-4 text-left">
          <label className="block text-gray-600 font-medium">Employee Name</label>
          <input
            type="text"
            value={employeeNameInput}
            onChange={(e) => setEmployeeNameInput(e.target.value)}
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Enter Employee Name"
          />
        </div>

        <div className="mt-4 text-left">
          <label className="block text-gray-600 font-medium">Request Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          onClick={handleRequestPOH}
          className="w-full bg-blue-500 text-white font-semibold py-3 mt-6 rounded-lg hover:bg-blue-600 transition"
        >
          Submit Request
        </button>
      </div>

      {/* Requests Table */}
      <div className="w-full max-w-4xl mt-10 bg-white shadow-lg rounded-2xl p-6">
        <h3 className="text-2xl font-semibold text-gray-800 text-center">Your POH Requests</h3>
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Employee ID</th>
                <th className="py-3 px-6 text-left">Employee Name</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-medium">
              {pohRequests.length > 0 ? (
                pohRequests.map((poh, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-300 hover:bg-gray-100 transition"
                  >
                    <td className="py-4 px-6">{poh.employeeId}</td>
                    <td className="py-4 px-6">{poh.employeeName || "N/A"}</td>
                    <td className="py-4 px-6">{new Date(poh.date).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${poh.status === "Approved"
                            ? "bg-green-100 text-green-600"
                            : poh.status === "Pending"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-red-100 text-red-600"
                          }`}
                      >
                        {poh.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No POH requests found.
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

export default POHRequestDashboard;
