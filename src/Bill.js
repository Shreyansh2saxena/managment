import React, { useState, useEffect } from "react";
import axios from "axios";
import { pdf } from '@react-pdf/renderer';
import GSTInvoice from './GSTInvoice'; 

const initialBillState = {
  vendorId: "",
  vendorName: "",
  customerId: "",
  customerName: "",
  billDate: new Date().toISOString().split('T')[0], // Default to today
  customerAddress: "",
  customerState: "",
  customerGstin: "",
  vaddress: "",
  vendorState: "",
  billItems: [
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
  paymentStatus: "Pending" // Changed from billStatus to match what's used elsewhere
};

const App = () => {
  const [bills, setBills] = useState([]);
  const [bill, setBill] = useState(initialBillState);
  const [vendorLogo, setVendorLogo] = useState();
  const [vendorSuggestions, setVendorSuggestions] = useState([]);
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  
  // Cache for vendor and customer data to reduce API calls
  const [vendorsCache, setVendorsCache] = useState({});
  const [customersCache, setCustomersCache] = useState({});

  useEffect(() => {
    fetchBills();
    // Pre-fetch all vendors and customers to cache
    fetchAndCacheAllVendors();
    fetchAndCacheAllCustomers();
  }, []);

  const fetchAndCacheAllVendors = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/vendors");
      const vendors = response.data;
      const cache = {};
      
      vendors.forEach(vendor => {
        cache[vendor.id] = vendor;
      });
      
      setVendorsCache(cache);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const fetchAndCacheAllCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/customers");
      const customers = response.data;
      const cache = {};
      
      customers.forEach(customer => {
        cache[customer.id] = customer;
      });
      
      setCustomersCache(cache);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchBills = async () => {
    const response = await axios.get("http://localhost:8080/api/bills");
    setBills(response.data);
  };

  const fetchVendorSuggestions = async (query) => {
    if (query.trim() === "") {
      setVendorSuggestions([]);
      return;
    }

    try {
      // Use cached data if available
      if (Object.keys(vendorsCache).length > 0) {
        const filtered = Object.values(vendorsCache)
          .filter(vendor => 
            vendor.name.toLowerCase().includes(query.toLowerCase())
          )
          .map(vendor => ({
            id: vendor.id, 
            name: vendor.name
          }));
        setVendorSuggestions(filtered);
      } else {
        // Fallback to API if cache is empty
        const response = await axios.get("http://localhost:8080/api/vendors");
        const filtered = response.data
          .filter(vendor =>
            vendor.name.toLowerCase().includes(query.toLowerCase())
          )
          .map(vendor => ({
            id: vendor.id, 
            name: vendor.name
          }));
        setVendorSuggestions(filtered);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const fetchCustomerSuggestions = async (query) => {
    if (query.trim() === "") {
      setCustomerSuggestions([]);
      return;
    }

    try {
      // Use cached data if available
      if (Object.keys(customersCache).length > 0) {
        const filtered = Object.values(customersCache)
          .filter(customer => 
            customer.name.toLowerCase().includes(query.toLowerCase())
          )
          .map(customer => ({
            id: customer.id, 
            name: customer.name
          }));
        setCustomerSuggestions(filtered);
      } else {
        // Fallback to API if cache is empty
        const response = await axios.get("http://localhost:8080/api/customers");
        const filtered = response.data
          .filter(customer =>
            customer.name.toLowerCase().includes(query.toLowerCase())
          )
          .map(customer => ({
            id: customer.id, 
            name: customer.name
          }));
        setCustomerSuggestions(filtered);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchVendorLogo = async (vendorId) => {
    if (!vendorId) {
      console.error("No vendor ID provided to fetch logo");
      return null;
    }
    
    try {
      const response = await axios.get(`http://localhost:8080/api/vendors/${vendorId}/image`, {
        responseType: "blob"
      });
      
      if (response.data.size === 0) {
        console.warn("Empty logo data received for vendor ID:", vendorId);
        return null;
      }
  
      const logoUrl = URL.createObjectURL(response.data);
      setVendorLogo(logoUrl);  // Keep this for other parts of the app
      return logoUrl;  // Return the URL
    } catch (error) {
      console.error(`Error fetching vendor logo for ID ${vendorId}:`, error);
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
      vendorId: vendor.id, 
      vendorName: vendor.name
    });
    setVendorSuggestions([]);
    await fetchVendorLogo(vendor.id);
  };

  const selectCustomer = (customer) => {
    setBill({ 
      ...bill, 
      customerId: customer.id, 
      customerName: customer.name 
    });
    setCustomerSuggestions([]);
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...bill.billItems];
    items[index][name] = value;
    setBill({ ...bill, billItems: items });
  };

  const addBillItem = () => {
    setBill({
      ...bill,
      billItems: [
        ...bill.billItems,
        { description: "", hsnSac: "", quantity: "", rate: "", sgstRate: "", cgstRate: "", igstRate: "" },
      ],
    });
  };

  const removeBillItem = (index) => {
    const items = [...bill.billItems];
    items.splice(index, 1);
    setBill({ ...bill, billItems: items });
  };

  // Calculate amounts and return a new bill object with totals and updated items
  const getCalculatedBill = () => {
    let totalAmount = 0;
    let totalQuantity = 0;
    const items = bill.billItems.map((item) => {
      const quantity = parseInt(item.quantity || "0");
      const rate = parseFloat(item.rate || "0");
      const sgstRate = parseFloat(item.sgstRate/100 || "0");
      const cgstRate = parseFloat(item.cgstRate/100 || "0");
      const igstRate = parseFloat(item.igstRate/100 || "0");

      const baseAmount = quantity * rate;
      const sgstAmount = baseAmount * sgstRate;
      const cgstAmount = baseAmount * cgstRate;
      const igstAmount = baseAmount * igstRate;
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
    return { ...bill, billItems: items, totalAmount, totalQuantity };
  };

  const saveBill = async () => {
    try {
      const calculatedBill = getCalculatedBill();
      await axios.post("http://localhost:8080/api/bills", calculatedBill);
      fetchBills();
      // Reset the bill form to the initial state after saving
      setBill(initialBillState);
      alert("Bill saved successfully!");
    } catch (error) {
      console.error("Error saving bill:", error);
      alert("Failed to save bill. Please try again.");
    }
  };

  const deleteBill = async (id) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      try {
        await axios.delete(`http://localhost:8080/api/bills/${id}`);
        fetchBills();
        alert("Bill deleted successfully!");
      } catch (error) {
        console.error("Error deleting bill:", error);
        alert("Failed to delete bill. Please try again.");
      }
    }
  };



  // Function to Generate PDF
  const handleViewPDF = async (bill) => {
    try {
      // Fetch vendor details
      const vendorResponse = await axios.get(`http://localhost:8080/api/vendors?name=${bill.vendorName}`);
      const vendor = vendorResponse.data;


      // Fetch customer details
      const customerResponse = await axios.get(`http://localhost:8080/api/customers?name=${bill.customerName}`);
      const customer = customerResponse.data
      // Fetch the vendor logo
      const logoUrl = await fetchVendorLogo(vendor.id);

      // Prepare the invoice data
      const invoiceData = {
        invoiceNumber: bill.billNumber,
        invoiceDate: bill.billDate || new Date().toLocaleDateString(),
        company: {
          name: vendor.name || "Company Name",
          gstin: vendor.gstNumber || "GSTIN",
          address: vendor.address || "Vendor Address",
          state: vendor.state || "State",
          country: vendor.country || "Country",
        },
        client: {
          name: customer.name || "Customer Name",
          gstin: customer.gstNumber || "Customer GSTIN",
          address: customer.address || "Customer Address",
          city: customer.city || "City",
          state: customer.state || "State",
          country: customer.country || "Country",
        },
        items: bill.billItems.map((item) => ({
          description: item.description,
          hsnSac: item.hsnSac,
          quantity: item.quantity,
          rate: item.rate,
          sgst: (item.sgstRate / 100) * item.quantity * item.rate,
          cgst: (item.cgstRate / 100) * item.quantity * item.rate,
          igst: (item.igstRate / 100) * item.quantity * item.rate,
          amount: item.quantity * item.rate,
        })),
        notes: "Thank you for your business!",
      };

      // Generate and open the PDF
      const blob = await pdf(<GSTInvoice invoice={invoiceData} vendorLogo={logoUrl} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 100);
  
    }  catch (error) {
      console.error("Error generating PDF:", error);
    }
  };
  
  const handlePending = async (id) => {
    if (window.confirm("Are you sure you want to mark this bill as PAID?")) {
      try {
        // Fetch the current bill details
        const response = await axios.get(`http://localhost:8080/api/bills/${id}`);
        const bill = response.data;
  
        // Update the bill status to PAID
        const updatedBill = { ...bill, paymentStatus: "PAID" };
  
        // Send the updated bill back to the server
        await axios.put(`http://localhost:8080/api/bills/${id}`, updatedBill);
  
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

          {bill.billItems.map((item, index) => (
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
                disabled={bill.billItems.length === 1}
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
                <th className="p-2 border">Items</th>
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
                    <td className="p-2 border text-center">{(b.billItems && b.billItems.length) || 0}</td>
                    <td className="p-2 border text-right">₹{(b.totalAmount || 0).toFixed(2)}</td>
                    <td className="p-2 border">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleViewPDF(b)} 
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
    </div>
  );
};

export default App;