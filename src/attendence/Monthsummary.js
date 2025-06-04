import { useState } from "react";
import axiosInstance from '../util/axiosInstance';

export default function MonthSummaryList() {
  const [formData, setFormData] = useState({ year: "", month: "" });
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchSummaries = async () => {
    setLoading(true);
    setError(null);
    const { year, month } = formData;

    if (!year || !month || month < 1 || month > 12 || year < 2000) {
      setError("Please enter a valid Year and Month (1-12). ");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get("http://localhost:8081/api/month/summary/all", {
        params: { year, month },
      });
      setSummaries(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch summaries. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="p-3 w-full max-w-5xl mx-auto shadow-md rounded-lg bg-white mt-16">
      <h2 className="text-3xl font-bold mb-9 text-center">Employees' Month Summary</h2>
      <div className=" flex justify-center space-x-4 mb-4">
        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="Year (e.g., 2024)"
          className="p-2 border rounded-full w-1/3"
        />
        <input
          type="number"
          name="month"
          value={formData.month}
          onChange={handleChange}
          placeholder="Month (1-12)"
          className="p-2 border rounded-full w-1/3"
        />
        <button
          onClick={fetchSummaries}
          disabled={loading}
          className="px-4 py-2 bg-blue-400 text-white rounded-full hover:bg-blue-800 transition duration-300"
        >
          {loading ? "Fetching..." : "Get Summary"}
        </button>
      </div>
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      {summaries.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Month</th>
                <th className="border p-2">Total Days</th>
                <th className="border p-2">Working Days</th>
                <th className="border p-2">Attendance</th>
                <th className="border p-2">Leaves</th>
                <th className="border p-2">Overtime</th>
                <th className="border p-2">Total Attendance</th>
              </tr>
            </thead>
            <tbody>
              {summaries.map((summary, index) => (
                <tr key={index} className="border">
                  <td className="border p-2">{summary.empName}</td>
                  <td className="border p-2">{summary.empEmail}</td>
                  <td className="border p-2">{summary.role}</td>
                  <td className="border p-2">{summary.monthName} {summary.year}</td>
                  <td className="border p-2">{summary.totalDaysInMonth}</td>
                  <td className="border p-2">{summary.totalWorkingDays}</td>
                  <td className="border p-2">{summary.attendance}</td>
                  <td className="border p-2">{summary.leaves}</td>
                  <td className="border p-2">{summary.overtimeHours}</td>
                  <td className="border p-2 font-bold">{summary.totalAttendance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
