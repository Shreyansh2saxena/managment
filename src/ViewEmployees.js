import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Delete } from "@mui/icons-material";

const ViewEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [filterFields, setFilterFields] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const filteredEmployees = searchId
    ? employees.filter((emp) => emp.employeeId.toString().includes(searchId))
    : employees;

  const handleEditClick = (employee) => {
    setEditEmployee({ ...employee });
  };

  const handleEditChange = (e) => {
    setEditEmployee({ ...editEmployee, [e.target.name]: e.target.value });
  };

  const handleUpdateEmployee = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/employees/${editEmployee.employeeId}`,
        editEmployee
      );
      alert("Employee updated successfully!");
      setEditEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`http://localhost:8080/api/employees/${id}`);
        alert("Employee deleted successfully!");
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterFields(
      filterFields.includes(value)
        ? filterFields.filter((field) => field !== value)
        : [...filterFields, value]
    );
  };

  const handleDownload = () => {
    const csvRows = [];
    const headers = ["ID", "Name", ...filterFields];
    csvRows.push(headers.join(","));
    
    filteredEmployees.forEach((employee) => {
      const row = [
        employee.employeeId,
        employee.employeeName,
        ...filterFields.map((field) => employee[field] || "")
      ];
      csvRows.push(row.join(","));
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employees.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Employee List
        </h2>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-4">
          <input
            type="text"
            placeholder="Search by Employee ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full md:w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="w-full md:w-1/2 flex flex-wrap space-x-2">
            {["role", "email", "phone", "address"].map((field) => (
              <label key={field} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  value={field}
                  checked={filterFields.includes(field)}
                  onChange={handleFilterChange}
                  className="mr-1"
                />
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Download Data
        </button>

        {/* Employee Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                {filterFields.includes("address") && <th className="p-3">Address</th>}
                {filterFields.includes("phone") && <th className="p-3">Phone</th>}
                {filterFields.includes("email") && <th className="p-3">Email</th>}
                {filterFields.includes("role") && <th className="p-3">Role</th>}
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.employeeId} className="border-t">
                  <td className="p-3">{employee.employeeId}</td>
                  <td className="p-3">{employee.employeeName}</td>
                  {filterFields.includes("address") && <td className="p-3">{employee.address}</td>}
                  {filterFields.includes("phone") && <td className="p-3">{employee.phone}</td>}
                  {filterFields.includes("email") && <td className="p-3">{employee.email}</td>}
                  {filterFields.includes("role") && <td className="p-3">{employee.role}</td>}
                  <td className="p-3 flex justify-center space-x-2">
                    <button
                      onClick={() => handleDelete(employee.employeeId)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Delete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;
