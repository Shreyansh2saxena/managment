import React, { useState } from "react";
import axios from "axios";

const GetDocumentsByEmployee = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    if (!employeeId) {
      setMessage("Please enter an Employee ID.");
      setDocuments([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/documents/employee/${employeeId}`
      );
      setDocuments(response.data);
      setMessage(response.data.length ? "" : "No documents found for this Employee ID.");
    } catch (error) {
      setDocuments([]);
      setMessage("No documents found for this Employee ID.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        Search Documents by Employee ID
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="number"
          placeholder="Enter Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="p-3 border border-gray-300 rounded-md w-full md:w-2/3"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md w-full md:w-1/3 transition"
        >
          Search
        </button>
      </div>

      {message && <p className="text-center text-red-600 font-medium">{message}</p>}

      {documents.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 text-left">Document ID</th>
                <th className="border p-3 text-left">File Name</th>
                <th className="border p-3 text-left">Type</th>
                <th className="border p-3 text-left">Size (KB)</th>
                <th className="border p-3 text-left">Created Date</th>
                <th className="border p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="border p-3">{doc.id}</td>
                  <td className="border p-3">{doc.fileName}</td>
                  <td className="border p-3">{doc.typeOfDoc}</td>
                  <td className="border p-3">{(doc.fileSize / 1024).toFixed(2)}</td>
                  <td className="border p-3">{doc.createdDate}</td>
                  <td className="border p-3 flex gap-2">
                    <a
                      href={`http://localhost:8080/api/documents/download/${doc.id}`}
                      target="_blank"
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm"
                    >
                      Download
                    </a>
                    <a
                      href={`http://localhost:8080/api/documents/view/${doc.id}`}
                      target="_blank"
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md text-sm"
                    >
                      View
                    </a>
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
