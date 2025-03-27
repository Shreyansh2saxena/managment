import React, { useState, useEffect } from "react";

const CustomerForm = () => {
  const [customer, setCustomer] = useState({
    name: "",
    gstNumber: "",
    address: "",
    state: "",
    contactNumber: "",
    email: ""
  });

  const [customers, setCustomers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchId, setSearchId] = useState("");
   const [currentPage, setCurrentPage] = useState(0);
    const cusPerPage = 10;
    const [totalPages, setTotalPages] = useState(1);
  

  useEffect(() => {
    fetchCustomers();
  }, [currentPage]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/customers?page=${currentPage}&size=${cusPerPage}`);
      
  
      const data = await response.json();
      setCustomers(Array.isArray(data.content) ? data.content : []); // Extract customers from content array
      setTotalPages(data.totalPages ?? 1);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
      setTotalPages(1);
    }
  };
  
  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId
        ? `http://localhost:8081/api/customers/${editId}`
        : "http://localhost:8081/api/customers";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });

      if (response.ok) {
        alert(editId ? "Customer updated successfully!" : "Customer added successfully!");
        setCustomer({ name: "", gstNumber: "", address: "", state: "", contactNumber: "", email: "" });
        setEditId(null);
        fetchCustomers();
      } else {
        alert("Failed to save customer");
      }
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8081/api/customers/${id}`, { method: "DELETE" });
      alert("Customer deleted successfully");
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const handleEdit = (customer) => {
    setCustomer(customer);
    setEditId(customer.id);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/customers/${searchId}`);
      if (response.ok) {
        const data = await response.json();
        setCustomers([data]);
      } else {
        alert("Customer not found");
      }
    } catch (error) {
      console.error("Error searching customer:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">{editId ? "Edit Customer" : "Add Customer"}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input type="text" name="name" value={customer.name} onChange={handleChange} className="border p-2" placeholder="Customer Name" required />
        <input type="text" name="gstNumber" value={customer.gstNumber} onChange={handleChange} className="border p-2" placeholder="GST Number" required />
        <input type="text" name="address" value={customer.address} onChange={handleChange} className="border p-2" placeholder="Address" required />
        <input type="text" name="state" value={customer.state} onChange={handleChange} className="border p-2" placeholder="State" required />
        <input type="text" name="contactNumber" value={customer.contactNumber} onChange={handleChange} className="border p-2" placeholder="Contact Number" required />
        <input type="email" name="email" value={customer.email} onChange={handleChange} className="border p-2" placeholder="Email" required />
        <button type="submit" className="col-span-2 bg-blue-500 text-white p-2 rounded">
          {editId ? "Update Customer" : "Save Customer"}
        </button>
      </form>

      <h2 className="text-xl font-bold mt-6">Customer List</h2>
      <input type="text" value={searchId} onChange={(e) => setSearchId(e.target.value)} placeholder="Search by ID" className="border p-2 w-full my-2" />
      <button onClick={handleSearch} className="bg-gray-500 text-white p-2 rounded mb-4">Search</button>

      {/* Customer Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">GST Number</th>
              <th className="border p-2">State</th>
              <th className="border p-2">Contact</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border">
                <td className="border p-2">{c.id}</td>
                <td className="border p-2">{c.name}</td>
                <td className="border p-2">{c.gstNumber}</td>
                <td className="border p-2">{c.state}</td>
                <td className="border p-2">{c.contactNumber}</td>
                <td className="border p-2">
                  <button onClick={() => handleEdit(c)} className="bg-yellow-500 text-white p-1 rounded mx-2">Edit</button>
                  <button onClick={() => handleDelete(c.id)} className="bg-red-500 text-white p-1 rounded mx-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center my-4">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
    disabled={currentPage === 0}
    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
  >
    Previous
  </button>

  <span className="text-lg">Page {currentPage + 1} of {totalPages}</span>

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

export default CustomerForm;
