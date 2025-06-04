import React, { useState } from "react";
import axiosInstance from './util/axiosInstance';

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    employeeName: "",
    address: "",
    phone: "",
    email: "",
    ifsc : '',
    accountNo :"",
    bankName: "",
    bankingEmpName: "",

    role: "Employee",
  });

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/employees", employee);
      alert("Employee added successfully!");
      setEmployee({
        employeeName: "",
        address: "",
        phone: "",
        email: "",
        bankName: "",
        ifsc: "",
        accountNo: "",
        bankingEmpName: "",
        role: "Employee",
      });
    } catch (error) {
      console.error("Error adding employee", error);
      alert("Failed to add employee");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Add Employee
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Employee Name */}
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="employeeName"
              value={employee.employeeName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={employee.address}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={employee.phone}
              onChange={handleChange}
              required
              pattern="[0-9]*"
              maxLength="10"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={employee.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700">Bank Name</label>
            <input
              type="bankName"
              name="bankName"
              value={employee.bankName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700">IFSC code</label>
            <input
              type="ifsc"
              name="ifsc"
              value={employee.ifsc}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700">Employee's Banking Name</label>
            <input
              type="bankingEmpName"
              name="bankingEmpName"
              value={employee.bankingEmpName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700">Account Number</label>
            <input
              type="accountNo"
              name="accountNo"
              value={employee.accountNo}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Role Dropdown */}
          <div>
            <label className="block text-gray-700">Role</label>
            <select
              name="role"
              value={employee.role}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Admin">Admin</option>
              <option value="Employee">Employee</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Add Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
