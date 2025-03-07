import React, { useState } from "react";
import axios from "axios";

const AddDocumentForm = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [typeOfDoc, setTypeOfDoc] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // Handle File Selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle Form Submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("employeeId", employeeId);
    formData.append("typeOfDoc", typeOfDoc);
    formData.append("file", file);

    try {
      await axios.post(
        "http://localhost:8080/api/documents/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage("Document uploaded successfully.");
      setEmployeeId("");
      setTypeOfDoc("");
      setFile(null);
    } catch (error) {
      setMessage("Enter a valid Employee Id.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
      <h2 className="text-xl font-semibold mb-4 text-center text-blue-600">Upload Document</h2>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full"
        />

        <input
          type="text"
          placeholder="Document Type"
          value={typeOfDoc}
          onChange={(e) => setTypeOfDoc(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-md w-full"
        />

        <input type="file" onChange={handleFileChange} required className="p-2 w-full" />
        {file && <p className="text-sm text-gray-500">{file.name}</p>}

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
