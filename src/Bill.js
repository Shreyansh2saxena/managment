import React, { useState, useEffect } from "react";
import axios from "axios";
import { pdf } from '@react-pdf/renderer';
import GSTInvoice from './GSTInvoice'; 


const initialBillState = {
  vendorName: "",
  customerName: "",
  billDate: "",
  customerAddress: "",
  customerState:"",
  customerGstin:"",
  vaddress:"",
  vendorState:"",
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
  billStatus : "Pending"
};

const App = () => {
  const [bills, setBills] = useState([]);
  const [bill, setBill] = useState(initialBillState);
  const [vendorLogo, setVendorLogo] = useState();
  const [vendorSuggestions, setVendorSuggestions] = useState([]);
  const [customerSuggestions, setCustomerSuggestions] = useState([])


  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    const response = await axios.get("http://localhost:8080/api/bills");
    setBills(response.data);
  };
 // ✅ Fetch vendor suggestions with ID and Name
 const fetchVendorSuggestions = async (query) => {
    if (query.trim() === "") {
      setVendorSuggestions([]);
      return;
    }

    try {
      const response = await axios.get("http://localhost:8080/api/vendors");
      const filtered = response.data
        .filter((vendor) =>
          vendor.name.toLowerCase().includes(query.toLowerCase())
        )
        .map((vendor) => ({
          id: vendor.id, 
          name: vendor.name
        }));
      setVendorSuggestions(filtered);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  // ✅ Fetch customer suggestions with ID and Name
  const fetchCustomerSuggestions = async (query) => {
    if (query.trim() === "") {
      setCustomerSuggestions([]);
      return;
    }

    try {
      const response = await axios.get("http://localhost:8080/api/customers");
      const filtered = response.data
        .filter((customer) =>
          customer.name.toLowerCase().includes(query.toLowerCase())
        )
        .map((customer) => ({
          id: customer.id, 
          name: customer.name
        }));
      setCustomerSuggestions(filtered);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchVendorLogo = async (vendorId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/vendors/${vendorId}/image`, {
        responseType: "blob"
      });
  
      const logoUrl = URL.createObjectURL(response.data);
      setVendorLogo(logoUrl);  // Keep this for other parts of the app
      return logoUrl;  // Return the URL
    } catch (error) {
      console.error("Error fetching vendor logo:", error);
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

  // ✅ Select Vendor and save ID + Name
  const selectVendor = (vendor) => {
    setBill({ 
      ...bill, 
      vendorId: vendor.id, 
      vendorName: vendor.name
    });
    setVendorSuggestions([]);
    fetchVendorLogo(vendor.id);
  };

  // ✅ Select Customer and save ID + Name
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
      const sgstRate = parseFloat(item.sgstRate/100  || "0");
      const cgstRate = parseFloat(item.cgstRate/100   || "0");
      const igstRate = parseFloat(item.igstRate/100  || "0");

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
    const calculatedBill = getCalculatedBill();
    await axios.post("http://localhost:8080/api/bills", calculatedBill);
    fetchBills();
    // Reset the bill form to the initial state after saving
    setBill(initialBillState);
  };

  const deleteBill = async (id) => {
    await axios.delete(`http://localhost:8080/api/bills/${id}`);
    fetchBills();
  };

  

  // ✅ Function to Generate PDF
  const handleViewPDF = async (bill) => {
    try {
      // Fetch vendor details
      const vendorResponse = await axios.get(`http://localhost:8080/api/vendors?name=${bill.vendorName}`);
      const vendor = vendorResponse.data[0] || {};

      // Fetch customer details
      const customerResponse = await axios.get(`http://localhost:8080/api/customers?name=${bill.customerName}`);
      const customer = customerResponse.data[0] || {};

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
  
  const handlePending = async (id)=> {
    if (window.confirm("Are you sure you want to mark this bill as PAID?")) {
        try {
          // Fetch the current bill details
          const response = await axios.get(`http://localhost:8080/api/bills/${id}`);
          const bill = response.data;
    
          // Update the bill status to PAID
          const updatedBill = { ...bill,paymentStatus: "PAID" };
    
          // Send the updated bill back to the server
          await axios.put(`http://localhost:8080/api/bills/${id}`, updatedBill);
    
          alert("Bill marked as PAID successfully!");
          fetchBills();  // Refresh the list after the update
        } catch (error) {
          console.error("Error updating bill status:", error);
          alert("Failed to update bill status.");
        }
      }
  }
 
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6">Bill Management</h1>

      {/* Bill Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="grid grid-cols-2 gap-4 relative">
          {/* ✅ Vendor Input with Suggestions */}
          <div className="relative">
            <input
              type="text"
              name="vendorName"
              placeholder="Vendor Name"
              value={bill.vendorName}
              onChange={handleBillChange}
              className="border p-2 w-full"
            />
            {vendorSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border rounded shadow-lg w-full">
                {vendorSuggestions.map((vendor) => (
                  <li
                    key={vendor.id}
                    onClick={() => selectVendor(vendor)}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {`ID:${vendor.id} - ${vendor.name}`}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ✅ Customer Input with Suggestions */}
          <div className="relative">
            <input
              type="text"
              name="customerName"
              placeholder="Customer Name"
              value={bill.customerName}
              onChange={handleBillChange}
              className="border p-2 w-full"
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

        {bill.billItems.map((item, index) => (
          <div key={index} className="grid grid-cols-8 gap-2 my-4">
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleItemChange(index, e)}
              className="border p-2"
            />
            <input
              type="text"
              name="hsnSac"
              placeholder="HSN/SAC"
              value={item.hsnSac}
              onChange={(e) => handleItemChange(index, e)}
              className="border p-2"
            />
            <input
              type="number"
              name="quantity"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, e)}
              className="border p-2"
            />
            <input
              type="number"
              name="rate"
              placeholder="Rate"
              value={item.rate}
              onChange={(e) => handleItemChange(index, e)}
              className="border p-2"
            />
            <input
              type="number"
              name="sgstRate"
              placeholder="SGST %"
              value={item.sgstRate}
              onChange={(e) => handleItemChange(index, e)}
              className="border p-2"
            />
            <input
              type="number"
              name="cgstRate"
              placeholder="CGST %"
              value={item.cgstRate}
              onChange={(e) => handleItemChange(index, e)}
              className="border p-2"
            />
            <input
              type="number"
              name="igstRate"
              placeholder="IGST %"
              value={item.igstRate}
              onChange={(e) => handleItemChange(index, e)}
              className="border p-2"
            />
            <button
              onClick={() => removeBillItem(index)}
              className="bg-red-400 text-white px-3 py-2 rounded-full"
            >
              Delete
            </button>
          </div>
        ))}
        <button onClick={addBillItem} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Item
        </button>
        <button onClick={saveBill} className="bg-green-500 text-white px-4 py-2 ml-2 rounded">
          Save Bill
        </button>
      </div>

      {/* Bill List Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-200 ">
              <th>Bill ID</th>
              <th>Vendor</th>
              <th>Customer</th>
              <th>Status</th>
              <th>No. of Items</th>
              <th>Grand Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(bills || []).map((b) => (
              <tr key={b.billNumber}>
                <td>{b.billNumber}</td>
                <td>{b.vendorName}</td>
                <td>{b.customerName}</td>
                <td className={b.paymentStatus === "PAID" ? "text-green-500" : "text-red-400"}>
                  {b.paymentStatus}
                </td>
                <td>{(b.billItems && b.billItems.length) || 0}</td>
                <td>₹{(b.totalAmount || 0).toFixed(2)}</td>
                <td>
                 
                  <button onClick={() => deleteBill(b.billNumber)} className="bg-red-400 text-white px-3 py-1 ml-2 rounded-full">
                    Delete
                  </button>
                  <button onClick={() => handleViewPDF(b)} className="bg-blue-500 text-white px-4 py-1 ml-2 rounded-full">
                    View
                  </button>
                  <button onClick={() => handlePending(b.billNumber)} className="bg-blue-500 text-white px-4 py-1 ml-2 rounded-full">
                    Piad
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
