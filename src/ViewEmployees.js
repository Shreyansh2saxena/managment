import React, { useState, useEffect } from "react";
import axios from "axios";
import { Delete, ModeEdit } from "@mui/icons-material";

const ViewEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [filterFields, setFilterFields] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [page,setPage] = useState(0);
  const [totPage , settotpage] = useState(1);
  const [size] = useState(10);


  useEffect(() => {
    fetchEmployees();
  }, [page]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/employees?page=${page}&size=${size}`
      );
  
      const { content, totalPages } = response.data; // Correct key from API
      setEmployees(content || []);
      settotpage(totalPages || 1); // Fix the total page count
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  
  
 
  
  const filteredEmployees = searchId
    ? employees.filter((emp) => emp.employeeId.toString().includes(searchId))
    : employees;

    const handleDelete = async (id) => {
      if (window.confirm("Are you sure you want to delete this employee?")) {
        try {
          await axios.delete(`http://localhost:8081/api/employees/${id}`);
          alert("Employee deleted successfully!");
          setEmployees(employees.filter((emp) => emp.employeeId !== id)); // Remove deleted employee
        } catch (error) {
          console.error("Error deleting employee:", error);
        }
      }
    };
  const openEditDialog = (employee) => {
    setEditEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8081/api/employees/${editEmployee.employeeId}`,
        editEmployee,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("Employee updated successfully!");
      setIsEditModalOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
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

        {/* Search and Filter */}
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
                    <button
                      onClick={() => openEditDialog(employee)}
                      className="p-1 text-blue-500 hover:text-blue-700"
                    >
                      <ModeEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Employee Modal */}
        {isEditModalOpen && editEmployee && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-bold mb-4">Edit Employee</h3>
              <form onSubmit={handleEditSubmit}>
                <label className="block mb-2">
                  Name:
                  <input
                    type="text"
                    name="employeeName"
                    value={editEmployee.employeeName}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </label>
                <label className="block mb-4">
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={editEmployee.email}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </label>
                <label className="block mb-4">
                  Phone
                  <input
                    type="phone"
                    name="phone"
                    value={editEmployee.phone}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </label>
                <label className="block mb-4">
                  Email:
                  <input
                    type="address"
                    name="address"
                    value={editEmployee.address}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </label>
                <label className="block mb-4">
                  Role:
                  <select
                    name="role"
                    value={editEmployee.role}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Employee">Employee</option>
                    <option value="Admin">Admin</option>
                  </select>
                </label>

                <div className="flex justify-end space-x-2">
                  <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
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

export default ViewEmployee;
