import React, { useState, useEffect } from "react";
import axios from "axios";

const AddIssuedDoc = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    typeOfDoc: "",
    issuedBy: "",
    file: null,
  });

  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const [employeeList, setEmployeeList] = useState([]); // Store all employees
  const [filteredEmployees, setFilteredEmployees] = useState([]); // Filtered suggestions

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/employees/getall");
        setEmployeeList(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If editing employeeName, filter suggestions
    if (name === "employeeName") {
      const filtered = value
        ? employeeList.filter((emp) =>
            emp.employeeName.toLowerCase().includes(value.toLowerCase())
          )
        : [];
      setFilteredEmployees(filtered);
    }
  };

  // Handle selection of an employee from suggestions
  const handleSelectEmployee = (employee) => {
    setFormData((prev) => ({
      ...prev,
      employeeName: employee.employeeName,
      employeeId: employee.employeeId,
    }));
    setFilteredEmployees([]); // Hide suggestions after selection
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, file }));
    setFileName(file ? file.name : "");
  };

  // Handle form submission with employee ID validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Validate if employee ID exists
      const response = await axios.get(
        `http://localhost:8081/api/employees/${formData.employeeId}`
      );

      if (!response.data) {
        setMessage("Employee ID not found!");
        setLoading(false);
        return;
      }

      const formDataObj = new FormData();
      formDataObj.append("employeeId", formData.employeeId);
      formDataObj.append("employeeName", formData.employeeName);
      formDataObj.append("typeOfDoc", formData.typeOfDoc);
      formDataObj.append("issuedBy", formData.issuedBy);
      formDataObj.append("file", formData.file);

      await axios.post("http://localhost:8081/api/issued-docs", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Document added successfully!");
      setFormData({
        employeeId: "",
        employeeName: "",
        typeOfDoc: "",
        issuedBy: "",
        file: null,
      });
      setFileName("");
    } catch (error) {
      setMessage("Error uploading document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
        Add Issued Document
      </h2>
      
      {message && (
        <p
          className={`text-center font-medium mb-4 ${
            message.includes("Error") || message.includes("not found")
              ? "text-red-500"
              : "text-green-500"
          }`}
        >
          {message}
        </p>
      )}

      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        
        {/* Employee Name with Suggestions */}
        <div className="relative">
          <input
            type="text"
            name="employeeName"
            placeholder="Employee Name"
            value={formData.employeeName}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-md w-full"
          />
          
          {/* Display Employee Name Suggestions */}
          {filteredEmployees.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full shadow-md max-h-40 overflow-y-auto">
              {filteredEmployees.map((emp) => (
                <li
                  key={emp.employeeId}
                  className="p-2 cursor-pointer hover:bg-gray-200 flex justify-between"
                  onClick={() => handleSelectEmployee(emp)}
                >
                  <span>{emp.employeeName}</span>
                  <span className="text-gray-500">({emp.employeeId})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Employee ID (Auto-filled) */}
        <input
          type="number"
          name="employeeId"
          placeholder="Employee ID"
          value={formData.employeeId}
          readOnly // Read-only since it auto-fills
          className="p-3 border border-gray-300 rounded-md w-full bg-gray-100"
        />

        {/* Document Type */}
        <input
          type="text"
          name="typeOfDoc"
          placeholder="Type of Document"
          value={formData.typeOfDoc}
          onChange={handleChange}
          required
          className="p-3 border border-gray-300 rounded-md w-full"
        />

        {/* Issued By */}
        <input
          type="text"
          name="issuedBy"
          placeholder="Issued By"
          value={formData.issuedBy}
          onChange={handleChange}
          required
          className="p-3 border border-gray-300 rounded-md w-full"
        />

        {/* File Upload */}
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          required
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="block text-center bg-gray-200 text-gray-700 py-2 rounded-md cursor-pointer hover:bg-gray-300"
        >
          {fileName ? `Selected: ${fileName}` : "Upload Document (PDF)"}
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 w-full flex justify-center items-center"
        >
          {loading ? (
            <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddIssuedDoc;
