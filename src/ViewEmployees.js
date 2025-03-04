import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Delete } from "@mui/icons-material";

const ViewEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [searchId, setSearchId] = useState("");
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

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Employee List
        </h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by Employee ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Employee Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Address</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.employeeId} className="border-t">
                  <td className="p-3">{employee.employeeId}</td>
                  <td className="p-3">{employee.employeeName}</td>
                  <td className="p-3">{employee.address}</td>
                  <td className="p-3">{employee.phone}</td>
                  <td className="p-3">{employee.email}</td>
                  <td className="p-3">{employee.role}</td>
                  <td className="p-3 flex justify-center space-x-2">
                    <button
                      onClick={() => handleEditClick(employee)}
                      className="p-1 text-blue-500 hover:text-blue-700"
                    >
                      <Edit />
                    </button>
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

        {/* Edit Employee Modal */}
        {editEmployee && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Edit Employee</h3>
              <input
                type="text"
                name="employeeName"
                value={editEmployee.employeeName}
                onChange={handleEditChange}
                className="w-full p-2 border rounded-lg mb-2"
                placeholder="Name"
              />
              <input
                type="text"
                name="address"
                value={editEmployee.address}
                onChange={handleEditChange}
                className="w-full p-2 border rounded-lg mb-2"
                placeholder="Address"
              />
              <input
                type="tel"
                name="phone"
                value={editEmployee.phone}
                onChange={handleEditChange}
                className="w-full p-2 border rounded-lg mb-2"
                placeholder="Phone"
              />
              <input
                type="email"
                name="email"
                value={editEmployee.email}
                onChange={handleEditChange}
                className="w-full p-2 border rounded-lg mb-2"
                placeholder="Email"
              />
              <select
                name="role"
                value={editEmployee.role}
                onChange={handleEditChange}
                className="w-full p-2 border rounded-lg mb-4"
              >
                <option value="Admin">Admin</option>
                <option value="Employee">Employee</option>
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setEditEmployee(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateEmployee}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewEmployee;
