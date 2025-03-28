import React, { useState, useEffect } from "react";
import axios from "axios";

const GetDocumentsByEmployee = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("employeeName");
  const [allDocuments, setAllDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [message, setMessage] = useState("");
  const [employees, setEmployees] = useState([]);
  const [matchedEmployees, setMatchedEmployees] = useState([]);
  const [matchedDocs, setMatchedDocs] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [page,setPage] = useState(0);
    const [totPage , settotpage] = useState(1);
    const [size] = useState(10);

  
    useEffect(() => {
      const fetchAllData = async () => {
        try {
          const [docResponse, empResponse] = await Promise.all([
            axios.get(`http://localhost:8081/api/documents?page=${page}&size=${size}`),
            axios.get(`http://localhost:8081/api/employees?page=${page}&size=${size}`),
          ]);
          
          
          setAllDocuments(docResponse.data.content || []);
          setFilteredDocuments(docResponse.data.content || []);
          setEmployees(empResponse.data.content || []);
          settotpage(docResponse.data.totalPages || 1);
        } catch (error) {
          console.error("Error fetching data:", error);
          setMessage("Failed to load data.");
        }
      };
      fetchAllData();
    }, [page]);
  
    
  useEffect(() => {
    if (!searchTerm) {
      setMatchedEmployees([]);
      setMatchedDocs([]);
      return;
    }

    if (searchType === "employeeName") {
      const suggestions = employees.filter((emp) =>
        emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setMatchedEmployees(suggestions);
      setMatchedDocs([]); // Reset document type suggestions
    } else if (searchType === "docType") {
      const suggestions = [...new Set(allDocuments.map((doc) => doc.typeOfDoc))]
        .filter((type) => type.toLowerCase().includes(searchTerm.toLowerCase()));
      setMatchedDocs(suggestions);
      setMatchedEmployees([]); // Reset employee name suggestions
    }
  }, [searchTerm, searchType, employees, allDocuments]);

  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredDocuments(allDocuments);
      setMessage("Please enter a search term.");
      return;
    }

    if (searchType === "employeeName") {
      const matched = employees.find(
        (emp) => emp.employeeName.toLowerCase() === searchTerm.toLowerCase()
      );
      if (matched) {
        handleEmployeeSelection(matched);
      } else {
        setFilteredDocuments([]);
        setMessage("No employee found with this name.");
      }
    } else if (searchType === "docType") {
      const filtered = allDocuments.filter((doc) =>
        doc.typeOfDoc.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDocuments(filtered);
      setMessage(filtered.length ? "" : "No matching documents found.");
    }
  };

  const handleEmployeeSelection = (employee) => {
    setSelectedEmployee(employee);
    setSearchTerm(`${employee.employeeName} (ID: ${employee.employeeId})`);
    setMatchedEmployees([]); // Hide suggestions
    setMatchedDocs([]); // Hide document suggestions

    const filtered = allDocuments.filter((doc) => doc.employeeId === employee.employeeId);
    setFilteredDocuments(filtered);
    setMessage(filtered.length ? "" : "No documents found for this employee.");
  };

  const handleDocSelection = (docType) => {
    setSearchTerm(docType);
    setMatchedDocs([]); // Hide suggestions
    setMatchedEmployees([]); // Hide employee suggestions

    handleSearch();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Search Documents</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6 relative">
        <select
          value={searchType}
          onChange={(e) => {
            setSearchType(e.target.value);
            setSearchTerm("");
            setSelectedEmployee(null);
            setMatchedEmployees([]);
            setMatchedDocs([]);
            setFilteredDocuments(allDocuments);
          }}
          className="p-3 border border-gray-300 rounded-md"
        >
          <option value="employeeName">Search by Employee Name</option>
          <option value="docType">Search by Document Type</option>
        </select>

        <div className="relative w-full">
          <input
            type="text"
            placeholder={`Enter ${searchType === "employeeName" ? "Employee Name" : "Document Type"}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 border border-gray-300 rounded-md w-full"
          />

          {/* Employee Suggestions (with ID) */}
          {matchedEmployees.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 w-full mt-1 rounded-md shadow-lg z-10">
              {matchedEmployees.map((emp) => (
                <li
                  key={emp.employeeId}
                  onClick={() => handleEmployeeSelection(emp)}
                  className="p-2 cursor-pointer hover:bg-gray-100 flex justify-between"
                >
                  <span>{emp.employeeName}</span>
                  <span className="text-gray-500 text-sm">ID: {emp.employeeId}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Document Type Suggestions */}
          {matchedDocs.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 w-full mt-1 rounded-md shadow-lg z-10">
              {matchedDocs.map((docType, index) => (
                <li
                  key={index}
                  onClick={() => handleDocSelection(docType)}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                >
                  {docType}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Search
        </button>
      </div>

      {message && <p className="text-red-500 text-center">{message}</p>}

      {filteredDocuments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 text-left">Document ID</th>
                <th className="border p-3 text-left">Employee ID</th>
                <th className="border p-3 text-left">Employee Name</th>
                <th className="border p-3 text-left">Role</th>
                <th className="border p-3 text-left">File Name</th>
                <th className="border p-3 text-left">Type</th>
                <th className="border p-3 text-left">Created Date</th>
              </tr>
            </thead>
            <tbody>
  {filteredDocuments.map((doc) => {
    // Find the corresponding employee data
    const employee = employees.find(emp => emp.employeeId === doc.employeeId);

    return (
      <tr key={doc.id} className="hover:bg-gray-50">
        <td className="border p-3">{doc.id}</td>
        <td className="border p-3">{doc.employeeId}</td>
        <td className="border p-3">{employee ? employee.employeeName : "N/A"}</td>
        <td className="border p-3">{employee ? employee.role : "N/A"}</td>
        <td className="border p-3">{doc.fileName}</td>
        <td className="border p-3">{doc.typeOfDoc || "N/A"}</td>
        <td className="border p-3">{doc.createdDate}</td>
      </tr>
    );
  })}
</tbody>

          </table>
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
  );
};

export default GetDocumentsByEmployee;
