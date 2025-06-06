import React, { useState, useEffect, useRef } from "react";
import { Delete, ModeEdit } from "@mui/icons-material";
import axiosInstance from "./util/axiosInstance";

const ViewEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filterFields, setFilterFields] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [totPage, settotpage] = useState(1);
  const [size] = useState(10);
  const suggestionRef = useRef(null);

  useEffect(() => {
    fetchEmployees();
  }, [page]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get(
        `/employees?page=${page}&size=${size}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem('token')}`

        }
      }
      );

      const { content, totalPages } = response.data;
      setEmployees(content || []);
      settotpage(totalPages || 1);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Filter employees by name instead of ID
  const filteredEmployees = searchName
    ? employees.filter((emp) =>
      emp.employeeName.toLowerCase().includes(searchName.toLowerCase()))
    : employees;

  // Filter suggestions based on input
  const suggestions = searchName
    ? employees.filter((emp) =>
      emp.employeeName.toLowerCase().includes(searchName.toLowerCase()))
    : [];

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axiosInstance.delete(`/employees/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            "Content-Type": "application/json"

          }
        });
        alert("Employee deleted successfully!");

        // Refetch the current page to reflect the changes immediately
        fetchEmployees();


        if (filteredEmployees.length === 1 && page > 0) {
          setPage(page - 1);
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert("Failed to delete employee. Please try again.");
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
      await axiosInstance.put(
        `/employees/${editEmployee.id}`,
        editEmployee,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            "Content-Type": "application/json"

          }
        });
      alert("Employee updated successfully!");
      setIsEditModalOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee. Please try again.");
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

  const handleSuggestionClick = (employee) => {
    setSearchName(employee.employeeName);
    setShowSuggestions(false);
  };

  const handleDownload = () => {
    const csvRows = [];
    const headers = ["ID", "Name", ...filterFields];
    csvRows.push(headers.join(","));

    filteredEmployees.forEach((employee) => {
      const row = [
        employee.id,
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
          <div className="w-full md:w-1/2 relative">
            <input
              type="text"
              placeholder="Search by Employee Name"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionRef}
                className="absolute z-10 bg-white w-full mt-1 border rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                {suggestions.map((emp) => (
                  <div
                    key={emp.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer border-b"
                    onClick={() => handleSuggestionClick(emp)}
                  >
                    <span className="font-medium">{emp.employeeName}</span>
                    <span className="text-gray-500 ml-2">ID: {emp.id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

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
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-t">
                    <td className="p-3">{employee.id}</td>
                    <td className="p-3">{employee.employeeName}</td>
                    {filterFields.includes("address") && <td className="p-3">{employee.address}</td>}
                    {filterFields.includes("phone") && <td className="p-3">{employee.phone}</td>}
                    {filterFields.includes("email") && <td className="p-3">{employee.email}</td>}
                    {filterFields.includes("role") && <td className="p-3">{employee.role}</td>}
                    <td className="p-3 flex justify-center space-x-2">
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                        aria-label="Delete employee"
                      >
                        <Delete />
                      </button>
                      <button
                        onClick={() => openEditDialog(employee)}
                        className="p-1 text-blue-500 hover:text-blue-700"
                        aria-label="Edit employee"
                      >
                        <ModeEdit />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={filterFields.length + 3} className="p-4 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Employee Modal */}
        {isEditModalOpen && editEmployee && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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
                    required
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
                    required
                  />
                </label>
                <label className="block mb-4">
                  Phone:
                  <input
                    type="tel"
                    name="phone"
                    value={editEmployee.phone}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </label>
                <label className="block mb-4">
                  Address:
                  <input
                    type="text"
                    name="address"
                    value={editEmployee.address}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </label>
                <label className="block mb-4">
                  Role:
                  <select
                    name="role"
                    value={editEmployee.role}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    <option value="Employee">Employee</option>
                    <option value="Admin">Admin</option>
                  </select>
                </label>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Pagination */}
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