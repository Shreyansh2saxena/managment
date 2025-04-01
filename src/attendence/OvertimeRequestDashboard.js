import React, { useState, useEffect } from "react";

const OvertimeRequestDashboard = () => {
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [overtimeRequests, setOvertimeRequests] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [employeeIdInput, setEmployeeIdInput] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [reason, setReason] = useState("");
  const [page, setPage] = useState(0);
  const [totPage, settotpage] = useState(1);
  const [size] = useState(10);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (employeeIdInput) {
      fetchOvertimeRequests();
    }
  }, [employeeIdInput, page]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch("http://localhost:8080/user/me", {
        credentials: "include", // Ensure cookies or authentication headers are sent
      });
      if (!response.ok) throw new Error("Failed to fetch user details");

      const user = await response.json();
      setEmployeeIdInput(user.id || "");
      setEmployeeName(user.name || "");
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchOvertimeRequests = async () => {
    try {
      const response = await fetch(`http://localhost:8080/overtime/employee/${employeeIdInput}?page=${page}&size=${size}`);
      if (!response.ok) throw new Error("Failed to fetch overtime requests");
      
      const { content, totalPages } = await response.json();
      setOvertimeRequests(content.map((overtime) => ({
        ...overtime,
        date: new Date(overtime.date).toLocaleDateString(),
      })));
      settotpage(totalPages);
    } catch (error) {
      console.error("Error fetching overtime requests:", error);
    }
  };

  const handleRequestOvertime = async () => {
    if (!employeeIdInput.trim() || !employeeName.trim() || !overtimeHours || overtimeHours <= 0) {
      alert("❌ Please fill in all required fields correctly.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/overtime/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: employeeIdInput,
          employeeName,
          date: selectedDate,
          hours: overtimeHours,
          reason,
          status: "Pending",
        }),
      });

      if (!response.ok) throw new Error("Failed to request overtime");

      alert("✅ Overtime request submitted successfully!");
      fetchOvertimeRequests();
      resetForm();
    } catch (error) {
      alert(" Error submitting overtime request: " + error.message);
    }
  };

  const resetForm = () => {
    setOvertimeHours(0);
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setReason("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8 text-center mt-4">
        <h2 className="text-3xl font-bold text-gray-800">Overtime Request</h2>

        <div className="mt-4">
          <label className="block text-gray-600 font-medium text-left">Employee ID</label>
          <input
            type="text"
            value={employeeIdInput}
            onChange={(e) => setEmployeeIdInput(e.target.value)}
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Enter Employee ID"
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-600 font-medium text-left">Employee Name</label>
          <input
            type="text"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Enter Employee Name"
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-600 font-medium text-left">Overtime Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-600 font-medium text-left">Overtime Hours</label>
          <input
            type="number"
            value={overtimeHours}
            onChange={(e) => setOvertimeHours(Number(e.target.value))}
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            min="1"
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-600 font-medium text-left">Reason for Overtime</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            rows="3"
            placeholder="Please provide a reason for overtime request"
          ></textarea>
        </div>

        <button
          onClick={handleRequestOvertime}
          className="w-full bg-blue-500 text-white font-semibold py-3 mt-6 rounded-lg hover:bg-blue-600 transition"
        >
          Submit Request
        </button>
      </div>

      {/* Overtime Requests Table */}
      <div className="w-full max-w-4xl mt-10 bg-white shadow-xl rounded-2xl p-6 mb-4">
        <h3 className="text-2xl font-semibold text-gray-800 text-center ">Your Overtime Requests</h3>
        <div className="overflow-x-auto mt-4 ">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Employee ID</th>
                <th className="py-3 px-6 text-left">Employee Name</th>
                <th className="py-3 px-6 text-left">Hours</th>
                <th className="py-3 px-6 text-left">Reason</th>
                <th className="py-3 px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-medium">
              {overtimeRequests.length > 0 ? (
                overtimeRequests.map((overtime, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-300 hover:bg-gray-100 transition"
                  >
                    <td className="py-4 px-6">{overtime.date}</td>
                    <td className="py-4 px-6">{overtime.employeeId}</td>
                    <td className="py-4 px-6">{overtime.employeeName || "N/A"}</td>
                    <td className="py-4 px-6">{overtime.hours}</td>
                    <td className="py-4 px-6">{overtime.reason || "Not specified"}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          overtime.status === "Approved"
                            ? "bg-green-100 text-green-600"
                            : overtime.status === "Pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {overtime.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 px-6 text-center text-gray-500">
                    No overtime requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center my-4">
  <button
    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
    disabled={page === 0}
    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
  >
    Previous
  </button>

  <span className="text-lg">Page {page + 1} of {totPage}</span>

  <button
    onClick={() => setPage((prev) => (prev + 1 < totPage ? prev + 1 : prev))}
    disabled={page + 1 >= totPage}
    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
  >
    Next
  </button>
</div>
      </div>
     
    </div>
  );
};

export default OvertimeRequestDashboard;