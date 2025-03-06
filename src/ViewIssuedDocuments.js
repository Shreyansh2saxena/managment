import React, { useState, useEffect } from "react";
import { Visibility, Delete } from "@mui/icons-material";
import axios from "axios";

const ViewIssuedDocs = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ employeeId: "", typeOfDoc: "" });
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/issued-docs")
      .then((response) => {
        setDocs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
        setLoading(false);
      });
  }, []);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearch({ ...search, employeeId: value });
    if (value) {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/employees/suggestions?query=${value}`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleDelete = async (docId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await axios.delete(`http://localhost:8080/api/issued-docs/${docId}`);
        setDocs(docs.filter((doc) => doc.id !== docId));
        alert("Document deleted successfully!");
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };




  const filteredDocs = docs.filter(
    (doc) =>
      doc.employeeId.toString().includes(search.employeeId) &&
      doc.typeOfDoc.toLowerCase().includes(search.typeOfDoc.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Issued Documents
        </h2>

        {/* Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Employee ID"
              value={search.employeeId}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border rounded-lg w-full shadow-lg">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    onClick={() =>
                      setSearch({ ...search, employeeId: suggestion.employeeId })
                    }
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {suggestion.employeeId} - {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input
            type="text"
            placeholder="Search by Document Type"
            value={search.typeOfDoc}
            onChange={(e) => setSearch({ ...search, typeOfDoc: e.target.value })}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

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
                  <th className="p-3">Document Type</th>
                  <th className="p-3">Issued By</th>
                  <th className="p-3">Issued Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="border-t">
                    <td className="p-3">{doc.employeeId}</td>
                    <td className="p-3">{doc.typeOfDoc}</td>
                    <td className="p-3">{doc.issuedBy}</td>
                    <td className="p-3">{doc.dateOfIssue}</td>
                    <td className="p-3 flex justify-center space-x-2">
                      <button
                        onClick={() => window.open(`http://localhost:8080/api/issued-docs/view/${doc.id}`, "_blank")}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewIssuedDocs;