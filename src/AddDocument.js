import React, { useState, useEffect } from "react";
import axiosInstance from './util/axiosInstance';

const AddDocumentForm = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [typeOfDoc, setTypeOfDoc] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const [employeeList, setEmployeeList] = useState([]); // Store fetched employees
  const [filteredEmployees, setFilteredEmployees] = useState([]); // Suggestions

  
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axiosInstance.get("/employees/getall",{
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      "Content-Type": "application/json"
    }
  }
);
        const validEmployees = response.data.filter(
          emp => emp.employeeName && emp.id
        );
        
        setEmployeeList(validEmployees);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setMessage("Could not load employee list");
      }
    };
    fetchEmployees();
  }, []);
;

  
  const handleEmployeeNameChange = (e) => {
    const input = e.target.value;
    setEmployeeName(input);

    // Filter employees based on input
    if (input.length > 0) {
      const filtered = employeeList.filter((emp) =>
        emp.employeeName.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees([]);
    }
  };

  // Handle selecting an employee from suggestions
  const handleSelectEmployee = (employee) => {
    setEmployeeName(employee.employeeName);
    setEmployeeId(employee.id);
    setFilteredEmployees([]); // Hide suggestions after selection
  };

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("employeeName", employeeName);
    formData.append("employeeId", employeeId);
    formData.append("typeOfDoc", typeOfDoc);
    formData.append("file", file);

  try {
    await axiosInstance.post(
      "/documents/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          "Content-Type": "multipart/form-data"
        }
      }
);
      setMessage("Document uploaded successfully.");
      setEmployeeName("");
      setEmployeeId("");
      setTypeOfDoc("");
      setFile(null);
    } catch (error) {
      setMessage("Enter a valid Employee ID.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
      <h2 className="text-xl font-semibold mb-4 text-center text-blue-600">Upload Document</h2>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        
        {/* Employee Name Input with Live Suggestions */}
        <div className="relative">
          <input
            type="text"
            placeholder="Employee Name"
            value={employeeName}
            onChange={handleEmployeeNameChange}
            className="p-2 border border-gray-300 rounded-md w-full"
          />
          
          {/* Display Suggestions */}
          {filteredEmployees.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full shadow-md">
              {filteredEmployees.map((emp) => (
                <li
                  key={emp.id}
                  className="p-2 cursor-pointer hover:bg-gray-200 flex justify-between"
                  onClick={() => handleSelectEmployee(emp)}
                >
                  <span>{emp.employeeName}</span>
                  <span className="text-gray-500">({emp.id})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Employee ID (Auto-filled) */}
        <input
          type="number"
          placeholder="Employee ID"
          value={employeeId}
          readOnly // Make it read-only since it auto-fills
          className="p-2 border border-gray-300 rounded-md w-full bg-gray-100"
        />

        {/* Document Type Input */}
        <input
          type="text"
          placeholder="Document Type"
          value={typeOfDoc}
          onChange={(e) => setTypeOfDoc(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-md w-full"
        />

        {/* File Upload */}
        <input type="file" onChange={handleFileChange} required className="p-2 w-full" />
        {file && <p className="text-sm text-gray-500">{file.name}</p>}

        {/* Upload Button */}
        <button
          type="submit"
          className="py-2 px-4 rounded-md w-full bg-blue-500 hover:bg-blue-600 text-white transition"
        >
          Upload
        </button>
      </form>

      {message && <p className="text-blue-600 mt-4 text-center">{message}</p>}
    </div>
  );
};

export default AddDocumentForm;
