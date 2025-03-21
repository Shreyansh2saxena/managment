import React, { useState, useEffect } from "react";

const VendorForm = () => {
  const [vendor, setVendor] = useState({
    name: "",
    gstNumber: "",
    address: "",
    state: "",
    contactNumber: "",
    email: "",
    panNumber: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });

  const [vendors, setVendors] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [editId, setEditId] = useState(null);
  const [image, setImage] = useState(null);       // Image file
  const [preview, setPreview] = useState("");     // Image preview

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/vendors");
      if (response.ok) {
        const data = await response.json();
        setVendors(data);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendor({ ...vendor, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      alert("Please upload a valid image file (PNG, JPG, JPEG)");
      setImage(null);
      setPreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(vendor).forEach((key) => {
      formData.append(key, vendor[key]);
    });

    if (image) {
      formData.append("image", image);
    }

    try {
      const method = editId ? "PUT" : "POST";
      const url = editId
        ? `http://localhost:8080/api/vendors/${editId}`
        : "http://localhost:8080/api/vendors";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        alert(editId ? "Vendor updated successfully!" : "Vendor added successfully!");
        setVendor({
          name: "",
          gstNumber: "",
          address: "",
          state: "",
          contactNumber: "",
          email: "",
          panNumber: "",
          bankName: "",
          accountNumber: "",
          ifscCode: "",
        });
        setImage(null);
        setPreview("");
        setEditId(null);
        fetchVendors();
      } else {
        alert("Failed to save vendor");
      }
    } catch (error) {
      console.error("Error saving vendor:", error);
      alert("Error saving vendor");
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/vendors/${id}`, { method: "DELETE" });
      alert("Vendor deleted successfully");
      fetchVendors();
    } catch (error) {
      console.error("Error deleting vendor:", error);
      alert("Error deleting vendor");
    }
  };

  const handleEdit = (vendor) => {
    setVendor(vendor);
    setEditId(vendor.id);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/vendors/${searchId}`);
      if (response.ok) {
        const data = await response.json();
        setVendors([data]);
      } else {
        alert("Vendor not found");
      }
    } catch (error) {
      console.error("Error searching vendor:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">{editId ? "Edit Vendor" : "Add Vendor"}</h2>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4" encType="multipart/form-data">
        <input type="text" name="name" value={vendor.name} onChange={handleChange} className="border p-2" placeholder="Vendor Name" required />
        <input type="text" name="gstNumber" value={vendor.gstNumber} onChange={handleChange} className="border p-2" placeholder="GST Number" required />
        <input type="text" name="address" value={vendor.address} onChange={handleChange} className="border p-2" placeholder="Address" required />
        <input type="text" name="state" value={vendor.state} onChange={handleChange} className="border p-2" placeholder="State" required />
        <input type="text" name="contactNumber" value={vendor.contactNumber} onChange={handleChange} className="border p-2" placeholder="Contact Number" required />
        <input type="email" name="email" value={vendor.email} onChange={handleChange} className="border p-2" placeholder="Email" required />
        <input type="text" name="panNumber" value={vendor.panNumber} onChange={handleChange} className="border p-2" placeholder="PAN Number" />
        <input type="text" name="bankName" value={vendor.bankName} onChange={handleChange} className="border p-2" placeholder="Bank Name" />
        <input type="text" name="accountNumber" value={vendor.accountNumber} onChange={handleChange} className="border p-2" placeholder="Account Number" />
        <input type="text" name="ifscCode" value={vendor.ifscCode} onChange={handleChange} className="border p-2" placeholder="IFSC Code" />

        {/* Image Upload */}
        <input type="file" name="image" onChange={handleImageChange} accept="image/*" className="border p-2" />

        {preview && (
          <div className="col-span-2">
            <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded mt-2" />
          </div>
        )}

        <button type="submit" className="col-span-2 bg-blue-500 text-white p-2 rounded">
          {editId ? "Update Vendor" : "Save Vendor"}
        </button>
      </form>

      {/* Vendor List */}
      <h2 className="text-xl font-bold mt-6">Vendor List</h2>
      <input
        type="text"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        placeholder="Search by ID"
        className="border p-2 w-full my-2"
      />
      <button onClick={handleSearch} className="bg-gray-500 text-white p-2 rounded mb-4">Search</button>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Logo</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.id} className="border">
                <td className="border p-2">{v.id}</td>
                <td className="border p-2">{v.name}</td>
                <td className="border p-2">
                  <img src={`http://localhost:8080/api/vendors/${v.id}/image`} alt={v.name} className="w-16 h-16 object-cover" />
                </td>
                <td className="border p-2">
                  <button onClick={() => handleEdit(v)} className="bg-yellow-500 text-white p-1 rounded mx-2">Edit</button>
                  <button onClick={() => handleDelete(v.id)} className="bg-red-500 text-white p-1 rounded mx-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorForm;
