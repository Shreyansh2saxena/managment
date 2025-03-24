import React, { useState } from "react";
import { Document, Page, PDFViewer } from "@react-pdf/renderer";
import GSTInvoice from "./GSTInvoice";
import axios from "axios";

const InvoicePreview = ({ bill }) => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [vendorLogo, setVendorLogo] = useState(null);

  const fetchInvoiceData = async () => {
    try {
      const vendor = bill.vendorName
        ? (await axios.get(`http://localhost:8080/api/vendors?name=${bill.vendorName}`)).data
        : {};

      const customer = bill.customerName
        ? (await axios.get(`http://localhost:8080/api/customers?name=${bill.customerName}`)).data
        : {};

      // const logoUrl = await fetchVendorLogo(vendor.id);
      // setVendorLogo(logoUrl);

      const invoice = {
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
        items: bill.billItems.map((item) => {
          const quantity = parseFloat(item.quantity) || 0;
          const rate = parseFloat(item.rate) || 0;
          const amount = quantity * rate;

          return {
            description: item.description,
            hsnSac: item.hsnSac,
            quantity,
            rate,
            sgst: (parseFloat(item.sgstRate) || 0) * amount / 100,
            cgst: (parseFloat(item.cgstRate) || 0) * amount / 100,
            igst: (parseFloat(item.igstRate) || 0) * amount / 100,
            amount,
          };
        }),
        notes: "Thank you for your business!",
      };

      setInvoiceData(invoice);
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    }
  };

  React.useEffect(() => {
    fetchInvoiceData();
  }, [bill]);

  return (
    <div>
      <h2>Invoice Preview</h2>
      {invoiceData ? (
        <PDFViewer style={{ width: "100%", height: "500px" }}>
          <Document>
            <Page>
              <GSTInvoice invoice={invoiceData} vendorLogo={vendorLogo} />
            </Page>
          </Document>
        </PDFViewer>
      ) : (
        <p>Loading invoice...</p>
      )}
    </div>
  );
};

export default InvoicePreview;
