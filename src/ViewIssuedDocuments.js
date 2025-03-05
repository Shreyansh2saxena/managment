import React, { useState, useEffect } from "react";
import { Visibility, SaveAlt, Edit } from "@mui/icons-material";
import axios from "axios";

const ViewIssuedDocs = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ employeeId: "", typeOfDoc: "" });
  const [suggestions, setSuggestions] = useState([]);
  const [editDoc, setEditDoc] = useState(null);

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
        const response = await axios.get(`/api/employees/suggestions?query=${value}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleEditClick = (doc) => {
    setEditDoc({ ...doc });
  };

  const handleEditChange = (e) => {
    setEditDoc({ ...editDoc, [e.target.name]: e.target.value });
  };

  const handleUpdateDoc = async () => {
    try {
      await axios.put(`http://localhost:8080/api/documents
      // /${editDoc.id}`, editDoc);
      alert("Document updated successfully!");
      setEditDoc(null);
      setLoading(true);
      axios.get("/api/issued-docs").then((response) => {
        setDocs(response.data);
        setLoading(false);
      });
    } catch (error) {
      console.error("Error updating document:", error);
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
                    onClick={() => setSearch({ ...search, employeeId: suggestion.employeeId })}
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
                        onClick={() => handleEditClick(doc)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-lg flex items-center space-x-1 hover:bg-yellow-600"
                      >
                        <Edit fontSize="small" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editDoc && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-200">
            <h3 className="text-xl font-bold mb-2">Edit Document</h3>
            <input
              type="text"
              name="typeOfDoc"
              value={editDoc.typeOfDoc}
              onChange={handleEditChange}
              className="p-2 border rounded-lg w-full mb-2"
              placeholder="Document Type"
            />
            <button onClick={handleUpdateDoc} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2">Update</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewIssuedDocs;
