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
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [docResponse, empResponse] = await Promise.all([
          axios.get("http://localhost:8080/api/documents"),
          axios.get("http://localhost:8080/api/employees")
        ]);

        setAllDocuments(docResponse.data);
        setEmployees(empResponse.data);
        setFilteredDocuments(docResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Failed to load data.");
      }
    };

    fetchAllData();
  }, []);

  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredDocuments(allDocuments);
      setMessage("Please enter a search term.");
      return;
    }

    if (searchType === "employeeName") {
      const matched = employees.filter(emp =>
        emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (matched.length === 0) {
        setFilteredDocuments([]);
        setMessage("No employee found with this name.");
        setMatchedEmployees([]);
        return;
      }

      setMatchedEmployees(matched);

      if (matched.length === 1) {
        handleEmployeeSelection(matched[0]);
      } else {
        setSelectedEmployee(null);
      }
    } else if (searchType === "docType") {
      const filtered = allDocuments.filter(doc =>
        doc.typeOfDoc.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setMatchedEmployees([]);
      setSelectedEmployee(null);
      setFilteredDocuments(filtered);
      setMessage(filtered.length ? "" : "No matching documents found.");
    }
  };
  const handleView = async (docId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/documents/view/${docId}`,
        { responseType: "blob" }
      );

      const fileURL = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );

      window.open(fileURL, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(fileURL), 10000);
    } catch (error) {
      console.error("Error viewing document:", error);
      alert("Failed to open the document.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/documents/${id}`);
      setAllDocuments(allDocuments.filter((doc) => doc.id !== id))
      setFilteredDocuments(filteredDocuments.filter((doc) => doc.id !== id));
      alert("Document deleted successfully.");
    } catch (error) {
      alert("Failed to delete document.");
    }
  };
  const handleDownload = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/documents/download/${id}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `document_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert(" Failed to download document.");
    }
  };

  const handleEmployeeSelection = (employee) => {
    setSelectedEmployee(employee);
    const filtered = allDocuments.filter(doc => doc.employeeId === employee.employeeId);
    setFilteredDocuments(filtered);
    setMessage(filtered.length ? "" : "No documents found for this employee.");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Search Documents</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={searchType}
          onChange={(e) => {
            setSearchType(e.target.value);
            setSearchTerm("");
            setSelectedEmployee(null);
            setMatchedEmployees([]);
            setFilteredDocuments(allDocuments);
          }}
          className="p-3 border border-gray-300 rounded-md"
        >
          <option value="employeeName">Search by Employee Name</option>
          <option value="docType">Search by Document Type</option>
        </select>

        <input
          type="text"
          placeholder={`Enter ${searchType === "employeeName" ? "Employee Name" : "Document Type"}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border border-gray-300 rounded-md w-full"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Search
        </button>
      </div>

      {matchedEmployees.length > 1 && (
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Select Employee ID:</label>
          <select
            onChange={(e) => {
              const emp = employees.find(emp => emp.employeeId === parseInt(e.target.value));
              handleEmployeeSelection(emp);
            }}
            className="p-3 border border-gray-300 rounded-md w-full"
          >
            <option value="">-- Select Employee ID --</option>
            {matchedEmployees.map(emp => (
              <option key={emp.employeeId} value={emp.employeeId}>
                {emp.employeeId} - {emp.employeeName}
              </option>
            ))}
          </select>
        </div>
      )}

      {filteredDocuments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 text-left">Document ID</th>
                <th className="border p-3 text-left">Employee ID</th>
                <th className="border p-3 text-left">File Name</th>
                <th className="border p-3 text-left">Type</th>
                <th className="border p-3 text-left">Size (KB)</th>
                <th className="border p-3 text-left">Content Type</th>
                <th className="border p-3 text-left">Created Date</th>
                <th className="border p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="border p-3">{doc.id}</td>
                  <td className="border p-3">{doc.employeeId}</td>
                  <td className="border p-3">{doc.fileName}</td>
                  <td className="border p-3">{doc.typeOfDoc}</td>
                  <td className="border p-3">{(doc.fileSize / 1024).toFixed(2)}</td>
                  <td className="border p-3">{doc.contentType}</td>
                  <td className="border p-3">{doc.createdDate}</td>
                  <td className="border p-3 flex gap-2">
                    <button onClick={() => handleView(doc.id)} className="bg-green-500 text-white py-2 px-4 rounded-md text-sm">View</button>
                    <button onClick={() => handleDelete(doc.id)} className="bg-red-500 text-white py-2 px-4 rounded-md text-sm">Delete</button>
                    <button onClick={() => handleDownload(doc.id)} className="bg-blue-500 text-white py-2 px-4 rounded-md text-sm">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GetDocumentsByEmployee;
