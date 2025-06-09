import React, { useState, useEffect } from "react";
import { pdf } from '@react-pdf/renderer';
import GSTInvoice from './GSTInvoice'; 
import axiosInstance from "./util/axiosInstance";

const initialBillState = {
  vendor: null,
  vendorName: "",
  customer: null,
  customerName: "",
  billDate: new Date().toISOString().split('T')[0], // aaj ke din ke liye
  customerAddress: "",
  customerState: "",
  customerGstin: "",
  vaddress: "",
  vendorState: "",
  GSTBillItems: [
    { 
      description: "", 
      hsnSac: "", 
      quantity: "", 
      rate: "", 
      sgstRate: "", 
      cgstRate: "", 
      igstRate: "" 
    }
  ],
  totalAmount: 0,
  totalQuantity: 0,
  paymentStatus: "Pending"
};

const App = () => {
  const [bills, setBills] = useState([]);
  const [bill, setBill] = useState(initialBillState);
  const [vendorLogo, setVendorLogo] = useState();
  const [vendorSuggestions, setVendorSuggestions] = useState([]);
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
      const billPp = 10;
      const [totalPages, setTotalPages] = useState(1);
      const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [paymentStatus, setpaymentStatus] = useState('');
    

  useEffect(() => {
    fetchBills();
  }, [currentPage]);

 const fetchBills = async () => {
  try {
    const response = await axiosInstance.get(`/GSTbills?page=${currentPage}&size=${billPp}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        "Content-Type": "application/json"
      }
    });

    const data = response.data;
    setBills(Array.isArray(data.content) ? data.content : []);
    setTotalPages(data.totalPages ?? 1);
  } catch (error) {
    console.error("Error fetching bills:", error);
    setBills([]);
    setTotalPages(1);
  }
};

  

  const fetchVendorSuggestions = async (query) => {
    if (query.trim() === "") {
      setVendorSuggestions([]);
      return;
    }

    try {
      const response = await axiosInstance.get(`/vendors/fetch`,{
        headers:{
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          "Content-Type": "application/json"

        }
      });
      const filtered = response.data
        .filter(vendor =>
          vendor.name.toLowerCase().includes(query.toLowerCase())
        )
        .map(vendor => ({
          id: vendor.id, 
          name: vendor.name
        }));
      setVendorSuggestions(filtered);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const searchbills = async () => {
    try {
      const res = await axiosInstance.get(`/GSTbills/search`, { params: {
        month,
        year,
        paymentStatus,
      },
        headers: {
           Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          "Content-Type": "application/json" 
        }
      });
      setBills(res.data);
    } catch (error) {
      console.error("Error searching bills:", error);
    }
  };

  const fetchCustomerSuggestions = async (query) => {
    if (query.trim() === "") {
      setCustomerSuggestions([]);
      return;
    }

    try {
      const response = await axiosInstance.get("/customers/fectch",{
        headers:{
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          "Content-Type": "application/json"
          
        }
      });
      const filtered = response.data
        .filter(customer =>
          customer.name.toLowerCase().includes(query.toLowerCase())
        )
        .map(customer => ({
          id: customer.id, 
          name: customer.name
        }));
      setCustomerSuggestions(filtered);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchVendorLogo = async (vendor) => {
    if (!vendor) {
      console.error("No vendor ID provided to fetch logo");
      return null;
    }
    
    try {
      const response = await axiosInstance.get(`/vendors/${vendor}/image`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          "Content-Type": "application/json"
        }
      });
      
      if (response.data.size === 0) {
        console.warn("Empty logo data received for vendor ID:", vendor);
        return null;
      }
  
      const logoUrl = URL.createObjectURL(response.data);
      setVendorLogo(logoUrl);  // Keep this for other parts of the app
      return logoUrl;  // Return the URL
    } catch (error) {
      console.error(`Error fetching vendor logo for ID ${vendor}:`, error);
      return null;
    }
  };

  const handleBillChange = (e) => {
    const { name, value } = e.target;
    setBill({ ...bill, [name]: value });

    if (name === "vendorName") {
      fetchVendorSuggestions(value);
    } else if (name === "customerName") {
      fetchCustomerSuggestions(value);
    }
  };

  const selectVendor = async (vendor) => {
    setBill({ 
      ...bill, 
      vendor: vendor.id, 
      vendorName: vendor.name
    });
    setVendorSuggestions([]);
    await fetchVendorLogo(vendor.id);
  };

  const selectCustomer = (customer) => {
    setBill({ 
      ...bill, 
      customer: customer.id, 
      customerName: customer.name 
    });
    setCustomerSuggestions([]);
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...bill.GSTBillItems];
    items[index][name] = value;
    setBill({ ...bill, GSTBillItems: items });
  };

  const addBillItem = () => {
    setBill({
      ...bill,
      GSTBillItems: [
        ...bill.GSTBillItems,
        { description: "", hsnSac: "", quantity: "", rate: "", sgstRate: "", cgstRate: "", igstRate: "" },
      ],
    });
  };

  const removeBillItem = (index) => {
    const items = [...bill.GSTBillItems];
    items.splice(index, 1);
    setBill({ ...bill, GSTBillItems: items });
  };

  const getCalculatedBill = () => {
    let totalAmount = 0;
    let totalQuantity = 0;
    const items = bill.GSTBillItems.map((item) => {
      const quantity = parseInt(item.quantity || "0");
      const rate = parseFloat(item.rate || "0");
      const sgstRate = parseFloat(item.sgstRate/100 || "0");
      const cgstRate = parseFloat(item.cgstRate/100 || "0");
      const igstRate = parseFloat(item.igstRate/100 || "0");

      const baseAmount = quantity * rate;
      const sgstAmount = baseAmount * (sgstRate);
      const cgstAmount = baseAmount * (cgstRate);
      const igstAmount = baseAmount * (igstRate);
      const itemTotal = baseAmount + sgstAmount + cgstAmount + igstAmount;

      totalQuantity += quantity;
      totalAmount += itemTotal;

      return { 
        ...item, 
        sgstAmount, 
        cgstAmount, 
        igstAmount, 
        totalAmount: itemTotal
      };
    });
    return { ...bill, GSTBillItems: items, totalAmount, totalQuantity };
  };

const saveBill = async () => {
  try {
    const calculatedBill = getCalculatedBill();
    
    // Create bill object with the correct structure
    const billToSave = {
      vendor: bill.vendor,
      vendorName: bill.vendorName,
      customer: bill.customer,
      customerName: bill.customerName,
      billDate: calculatedBill.billDate,
      paymentStatus: calculatedBill.paymentStatus,
      billType: "GST",
      paidDate: calculatedBill.paidDate,
      gstAmount: calculatedBill.gstAmount,
      totalAmount: calculatedBill.totalAmount,
      totalQuantity: calculatedBill.totalQuantity,
      gSTBillItems: calculatedBill.GSTBillItems?.map(item => ({
        description: item.description,
        hsnSac: item.hsnSac,
        quantity: item.quantity,
        rate: item.rate,
        sgstRate: item.sgstRate,
        cgstRate: item.cgstRate,
        igstRate: item.igstRate,
        sgstAmount: item.sgstAmount,
        cgstAmount: item.cgstAmount,
        igstAmount: item.igstAmount,
        totalAmount: item.totalAmount
      })) || []
    };

    await axiosInstance.post("/GSTbills/gst", billToSave,{
        headers:{
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          "Content-Type": "application/json"
          
        }
      });
    fetchBills();
    
    // Reset the bill form to the initial state after saving
    setBill({
      ...initialBillState,
      GSTBillItems: [{
        description: "",
        hsnSac: "",
        quantity: "",
        rate: "",
        sgstRate: "",
        cgstRate: "",
        igstRate: ""
      }]
    });
    
    alert("Bill saved successfully!");
  } catch (error) {
    console.error("Error saving bill:", error);
    alert("Failed to save bill. Please try again.");
  }
};
  const deleteBill = async (id) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      try {
        await axiosInstance.delete(`/GSTbills/${id}`,{
        headers:{
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          "Content-Type": "application/json"
          
        }
      });
        fetchBills();
        alert("Bill deleted successfully!");
      } catch (error) {
        console.error("Error deleting bill:", error);
        alert("Failed to delete bill. Please try again.");
      }
    }
  };



  // Function to Generate PDF
  const handleViewPDF = async (billId) => {
    try {
        // Fetch the complete bill data
        const billResponse = await axiosInstance.get(`/GSTbills/bill/${billId}`,{
        headers:{
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          "Content-Type": "application/json"
          
        }
      });
        const bill = billResponse.data;

        console.log("Received Bill Object:", bill);

        // Prepare vendor details
        const vendor = {
            name: bill.vendorName || "Vendor Name",
            gstin: bill.vendorGstNumber || "GSTIN",
            address: bill.vendorAddress || "Vendor Address",
            state: bill.vendorState || "State",
            contactNumber: bill.vendorContactNumber || "Contact Number",
            email: bill.vendorEmail || "Email",
            panNumber: bill.vendorPanNumber || "PAN",
            bankName: bill.vendorBankName || "Bank Name",
            accountNumber: bill.vendorAccountNumber || "Account Number",
            ifscCode: bill.vendorIfscCode || "IFSC",
        };

        // Prepare customer details
        const customer = {
            name: bill.customerName || "Customer Name",
            gstin: bill.customerGstNumber || "GSTIN",
            address: bill.customerAddress || "Customer Address",
            state: bill.customerState || "State",
            contactNumber: bill.customerContactNumber || "Contact Number",
            email: bill.customerEmail || "Email",
        };

        // Fetch vendor logo (assuming you have this function already)
        const logoUrl = await fetchVendorLogo(bill.vendorId);

        // Prepare invoice data
        const invoiceData = {
            invoiceNumber: bill.billNumber?.toString() || "N/A",
            invoiceDate: bill.billDate || new Date().toLocaleDateString(),
            company: {
                name: vendor.name,
                gstin: vendor.gstin,
                address: vendor.address,
                state: vendor.state,
                country: "India",
            },
            client: {
                name: customer.name,
                gstin: customer.gstin,
                address: customer.address,
                state: customer.state,
                country: "India",
            },
            items: bill.items.map((item) => {
                if (!item) return {}; // Avoid undefined items

                const quantity = parseFloat(item.quantity) || 0;
                const rate = parseFloat(item.rate) || 0;
                const amount = quantity * rate;

                return {
                    description: item.description || "Item Description",
                    hsnSac: item.hsnSac || "",
                    quantity,
                    rate,
                    sgst: parseFloat(item.sgstRate) || 0,
                    cgst: parseFloat(item.cgstRate) || 0,
                    igst: parseFloat(item.igstRate) || 0,
                    amount,
                };
            }),
            notes: bill.description || "Thank you for your business!",
            totalAmount: bill.totalAmount || 0,
        };

        // Generate PDF blob
        const pdfBlob = await pdf(<GSTInvoice invoice={invoiceData} vendorLogo={logoUrl} />).toBlob();

        // Create a URL for the blob
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Open PDF in a new window
        const pdfWindow = window.open(pdfUrl, '_blank');
        if (!pdfWindow) {
            alert("Popup blocked. Please allow popups for this site to view the PDF.");
        }

        // Clean up the object URL after a short delay
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 30000);

    } catch (error) {
        console.error("Error generating PDF:", error);

        if (error.response) {
            alert(`Error: ${error.response.status} - ${error.response.data.message || 'Failed to generate PDF'}`);
        } else if (error.request) {
            alert("No response received from server. Please check your network connection.");
        } else {
            alert("An unexpected error occurred while generating the PDF.");
        }
    }
};



  
  const handlePending = async (id) => {
    if (window.confirm("Are you sure you want to mark this bill as PAID?")) {
      try {
        // Fetch the current bill details
        const response = await axiosInstance.get(`/api/GSTbills/${id}`,{
        headers:{
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          "Content-Type": "application/json"
          
        }
      });
        const bill = response.data;
  
        // Update the bill status to PAID
        const updatedBill = { ...bill, paymentStatus: "PAID" };
  
        // Send the updated bill back to the server
        await axiosInstance.put(`/GSTbills/${id}`, updatedBill,{
        headers:{
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          "Content-Type": "application/json"
          
        }
      });
  
        alert("Bill marked as PAID successfully!");
        fetchBills();  // Refresh the list after the update
      } catch (error) {
        console.error("Error updating bill status:", error);
        alert("Failed to update bill status.");
      }
    }
  };
 
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6">Bill Management</h1>

      {/* Bill Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Date input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bill Date</label>
            <input
              type="date"
              name="billDate"
              value={bill.billDate}
              onChange={handleBillChange}
              className="border p-2 w-full rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 relative mb-4">
          {/* Vendor Input with Suggestions */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
            <input
              type="text"
              name="vendorName"
              placeholder="Vendor Name"
              value={bill.vendorName}
              onChange={handleBillChange}
              className="border p-2 w-full rounded"
            />
            {vendorSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border rounded shadow-lg w-full">
                {vendorSuggestions.map((vendor) => (
                  <li
                    key={vendor.id}
                    onClick={() => selectVendor(vendor)}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {`ID: ${vendor.id} - ${vendor.name}`}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Customer Input with Suggestions */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <input
              type="text"
              name="customerName"
              placeholder="Customer Name"
              value={bill.customerName}
              onChange={handleBillChange}
              className="border p-2 w-full rounded"
            />
            {customerSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border rounded shadow-lg w-full">
                {customerSuggestions.map((customer) => (
                  <li
                    key={customer.id}
                    onClick={() => selectCustomer(customer)}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {`ID: ${customer.id} - ${customer.name}`}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-2">Bill Items</h3>
          <div className="grid grid-cols-8 gap-2 mb-2 font-medium text-sm">
            <div>Description</div>
            <div>HSN/SAC</div>
            <div>Qty</div>
            <div>Rate</div>
            <div>SGST %</div>
            <div>CGST %</div>
            <div>IGST %</div>
            <div></div>
          </div>

          {bill.GSTBillItems.map((item, index) => (
            <div key={index} className="grid grid-cols-8 gap-2 mb-2">
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={item.description}
                onChange={(e) => handleItemChange(index, e)}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="hsnSac"
                placeholder="HSN/SAC"
                value={item.hsnSac}
                onChange={(e) => handleItemChange(index, e)}
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="quantity"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="rate"
                placeholder="Rate"
                value={item.rate}
                onChange={(e) => handleItemChange(index, e)}
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="sgstRate"
                placeholder="SGST %"
                value={item.sgstRate}
                onChange={(e) => handleItemChange(index, e)}
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="cgstRate"
                placeholder="CGST %"
                value={item.cgstRate}
                onChange={(e) => handleItemChange(index, e)}
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="igstRate"
                placeholder="IGST %"
                value={item.igstRate}
                onChange={(e) => handleItemChange(index, e)}
                className="border p-2 rounded"
              />
              <button
                onClick={() => removeBillItem(index)}
                className="bg-red-400 text-white px-3 py-2 rounded-full"
                disabled={bill.GSTBillItems.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex space-x-2 mt-4">
          <button onClick={addBillItem} className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Item
          </button>
          <button onClick={saveBill} className="bg-green-500 text-white px-4 py-2 rounded">
            Save Bill
          </button>
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        
  {/* Month filter */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
    <select
      value={month}
      onChange={(e) => setMonth(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="">All</option>
      {[...Array(12)].map((_, index) => (
        <option key={index + 1} value={index + 1}>
          {new Date(0, index).toLocaleString('default', { month: 'long' })}
        </option>
      ))}
    </select>
  </div>

  {/* Year filter */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
    <input
      type="number"
      value={year}
      onChange={(e) => setYear(e.target.value)}
      placeholder="e.g. 2025"
      className="border p-2 rounded"
    />
  </div>

  {/* Payment Status filter */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
    <select
      value={paymentStatus}
      onChange={(e) => setpaymentStatus(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="">All</option>
      <option value="PAID">PAID</option>
      <option value="PENDING">PENDING</option>
    </select>
  </div>

  {/* Search Button */}
  <div className="flex items-end">
    <button
      onClick={searchbills}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Search
    </button>
  </div>
</div>


      {/* Bill List Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Bills List</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Bill ID</th>
                <th className="p-2 border">Vendor</th>
                <th className="p-2 border">Customer</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-3 text-center text-gray-500">No bills found</td>
                </tr>
              ) : (
                bills.map((b) => (
                  <tr key={b.billNumber} className="hover:bg-gray-50">
                    <td className="p-2 border">{b.billNumber}</td>
                    <td className="p-2 border">{b.vendorName}</td>
                    <td className="p-2 border">{b.customerName}</td>
                    <td className={`p-2 border ${b.paymentStatus === "PAID" ? "text-green-600 font-medium" : "text-red-500"}`}>
                      {b.paymentStatus}
                    </td>
                    <td className="p-2 border">{b.billDate}</td>
                    <td className="p-2 border text-right">₹{(b.totalAmount || 0).toFixed(2)}</td>
                    <td className="p-2 border">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleViewPDF(b.billNumber)} 
                          className="bg-blue-500 text-white px-4 py-1  rounded-full"
                          title="View PDF"
                        >
                          View
                        </button>
                        {b.paymentStatus !== "PAID" && (
                          <button 
                            onClick={() => handlePending(b.billNumber)} 
                            className="bg-green-500 text-white px-4 py-1 rounded-full"
                            title="Mark as Paid"
                          >
                            Paid
                          </button>
                        )}
                        <button 
                          onClick={() => deleteBill(b.billNumber)} 
                          className="bg-red-400 text-white px-2 py-1 rounded-full"
                          title="Delete Bill"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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

export default App;