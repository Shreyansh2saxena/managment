import React, { useState, useEffect } from "react";
import { Visibility, Delete } from "@mui/icons-material";
import axios from "axios";

const ViewIssuedDocs = () => {
  const [docs, setDocs] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmployeeName, setSearchEmployeeName] = useState("");
  const [searchDocType, setSearchDocType] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Fetch documents
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8081/api/issued-docs/getall?page=${page}&size=${pageSize}`)
      .then((response) => {
        setDocs(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
        
        // Create a unique list of employees from the fetched documents
        const uniqueEmployees = Array.from(
          new Set(response.data.content.map(doc => JSON.stringify({
            id: doc.employeeId,
            name: doc.employeeName
          })))
        ).map(str => JSON.parse(str));
        
        setAllEmployees(uniqueEmployees);
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
        setLoading(false);
      });
  }, [page]);

  // Delete Document
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await axios.delete(`http://localhost:8081/api/issued-docs/${id}`);
        setDocs((prevDocs) => prevDocs.filter((doc) => doc.id !== id));
        alert("Document deleted successfully!");
      } catch (error) {
        console.error("Error deleting document:", error);
        alert("Failed to delete document.");
      }
    }
  };

  // View Document using Blob
  const handleView = async (doc) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/issued-docs/view/${doc.id}`,
        { responseType: "blob" }
      );
      const fileBlob = new Blob([response.data], { type: "application/pdf" });
      const fileURL = window.URL.createObjectURL(fileBlob);
      window.open(fileURL, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(fileURL), 10000);
    } catch (error) {
      console.error("Error viewing document:", error);
      alert("Failed to view document.");
    }
  };

  // Handle employee name search and suggestions
  const handleEmployeeSearch = (e) => {
    const query = e.target.value;
    setSearchEmployeeName(query);
    
    if (query.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    const filteredSuggestions = allEmployees.filter(
      employee => employee.name.toLowerCase().includes(query.toLowerCase()) ||
                 employee.id.toString().includes(query)
    );
    
    setSuggestions(filteredSuggestions);
    setShowSuggestions(true);
  };

  // Select suggestion
  const selectSuggestion = (employee) => {
    setSearchEmployeeName(employee.name);
    setShowSuggestions(false);
  };

  // Filtered Documents
  const filteredDocs = docs.filter(
    (doc) =>
      (searchEmployeeName
        ? doc.employeeName.toLowerCase().includes(searchEmployeeName.toLowerCase()) ||
          doc.employeeId.toString().includes(searchEmployeeName)
        : true) &&
      (searchDocType
        ? doc.typeOfDoc.toLowerCase().includes(searchDocType.toLowerCase())
        : true)
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Issued Documents
        </h2>

        {/* Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Employee Name or ID"
              value={searchEmployeeName}
              onChange={handleEmployeeSearch}
              onFocus={() => searchEmployeeName && setSuggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-lg shadow-lg">
                {suggestions.map((employee, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => selectSuggestion(employee)}
                  >
                    <span className="font-medium">{employee.name}</span>
                    <span className="text-gray-500 ml-2">(ID: {employee.id})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder="Search by Document Type"
            value={searchDocType}
            onChange={(e) => setSearchDocType(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <div className="h-10 w-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3">Employee ID</th>
                  <th className="p-3">Employee Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Document Type</th>
                  <th className="p-3">Issued By</th>
                  <th className="p-3">Issued Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.length > 0 ? (
                  filteredDocs.map((doc) => (
                    <tr key={doc.id} className="border-t">
                      <td className="p-3">{doc.employeeId}</td>
                      <td className="p-3">{doc.employeeName}</td>
                      <td className="p-3">{doc.role}</td>
                      <td className="p-3">{doc.typeOfDoc}</td>
                      <td className="p-3">{doc.issuedBy}</td>
                      <td className="p-3">{doc.dateOfIssue}</td>
                      <td className="p-3 flex justify-center space-x-2">
                        <button
                          onClick={() => handleView(doc)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg flex items-center space-x-1 hover:bg-blue-600"
                        >
                          <Visibility fontSize="small" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg flex items-center space-x-1 hover:bg-red-600"
                        >
                          <Delete fontSize="small" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-between my-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="self-center text-lg">Page {page + 1} of {totalPages}</span>
          <button
            onClick={() => setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))}
            disabled={page + 1 >= totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewIssuedDocs;