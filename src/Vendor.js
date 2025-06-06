import React, { useState, useEffect } from "react";
import axiosInstance from "./util/axiosInstance";

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
  const [currentPage, setCurrentPage] = useState(0);
  const vendorsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchVendors();
  }, [currentPage]);

 

const fetchVendors = async () => {
  try {
    const response = await axiosInstance.get(`/vendors`, {
  params: {
    page: currentPage,
    size: vendorsPerPage
  },
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    "Content-Type": "application/json"
  }
});

    const data = response.data;

    setVendors(Array.isArray(data.content) ? data.content : []);
    setTotalPages(data.totalPages ?? 1);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    setVendors([]);
    setTotalPages(1);
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
    const url = editId
      ? `/vendors/${editId}`
      : "/vendors";

    if (editId) {
      await axiosInstance.put(url, formData, {
        headers:{
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          "Content-Type": "application/json"
          
        }
      });
      alert("Vendor updated successfully!");
    } else {
      await axiosInstance.post(url, formData,{
        headers:{
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          "Content-Type": "application/json"
          
        }
      });
      alert("Vendor added successfully!");
    }

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
  } catch (error) {
    console.error("Error saving vendor:", error);
    alert("Error saving vendor");
  }
};

const handleDelete = async (id) => {
  try {
    await axiosInstance.delete(`/vendors/${id}`,{
        headers:{
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          "Content-Type": "application/json"
          
        }
      });
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
    const response = await axiosInstance.get(`/vendors/${searchId}`,{
        headers:{
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          "Content-Type": "application/json"
          
        }
      });
    setVendors([response.data]);
  } catch (error) {
    console.error("Error searching vendor:", error);
    alert("Vendor not found");
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
      <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded mb-4">Search</button>

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
              <tr key={v.id} className="border ">
                <td className="border p-2">{v.id}</td>
                <td className="border p-2">{v.name}</td>
                <td className="border p-2">
                  <img src={`http://localhost:8081/api/vendors/${v.id}/image`} alt={v.name} className="w-16 h-16 object-cover" />
                </td>
                <td className=" mt-2 p-2 flex justify-center gap-4">
                  <button onClick={() => handleEdit(v)} className="bg-yellow-500 text-white px-3 rounded-full mx-2">Edit</button>
                  <button onClick={() => handleDelete(v.id)} className="bg-red-500 text-white px-2 rounded-full mx-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between my-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="self-center text-lg">Page {currentPage + 1} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))}
          disabled={currentPage + 1 >= totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VendorForm;
