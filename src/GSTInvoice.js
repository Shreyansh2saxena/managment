import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Create styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 80,
    objectFit: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'right',
  },
  invoiceNumber: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  section: {
    marginBottom: 15,
  },
  addressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  addressColumn: {
    width: '48%',
  },
  detailsColumn: {
    width: '48%',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  value: {
    marginBottom: 3,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  placeOfSupply: {
    marginBottom: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 10,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableHeader: {
    backgroundColor: '#000',
    color: '#fff',
    padding: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
    textAlign: 'center',
  },
  hsnRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    backgroundColor: '#f9f9f9',
  },
  hsnCell: {
    padding: 3,
    fontSize: 10,
    color: '#666',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  totalLabel: {
    width: 100,
    textAlign: 'right',
    paddingRight: 10,
  },
  totalValue: {
    width: 80,
    textAlign: 'right',
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 5,
    marginTop: 5,
  },
  grandTotalLabel: {
    width: 100,
    textAlign: 'right',
    paddingRight: 10,
    fontWeight: 'bold',
  },
  grandTotalValue: {
    width: 80,
    textAlign: 'right',
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#000',
    padding: 3,
  },
  notes: {
    marginTop: 20,
  },
  notesTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  signature: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  signatureBox: {
    borderTopWidth: 1,
    borderTopColor: '#000',
    width: 150,
    textAlign: 'center',
    paddingTop: 5,
  }
});

// GST Invoice Component
const GSTInvoice = ({ invoice, vendorLogo }) => {
  // Default empty invoice if none provided
  const defaultInvoice = {
    invoiceNumber: 'INV-XX',
    invoiceDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    
    company: {
      name: 'Your Company',
      contactName: 'Your Name',
      gstin: 'Company\'s GSTIN',
      address: 'Company\'s Address',
      city: 'City',
      state: 'State',
      country: 'India'
    },
    client: {
      name: 'Your Client\'s Company',
      gstin: 'Client\'s GSTIN',
      address: 'Client\'s Address',
      city: 'City',
      state: 'State',
      country: 'India'
    },

    items: [
      {
        description: 'Brochure Design',
        hsnSac: '',
        quantity: 2,
        rate: 0.00,
        sgst: 0.00,
        cgst: 0.00,
        igst: 0.00,
        amount: 0.00
      }
    ],
    notes: 'It was great doing business with you.'
  };


  const data = invoice || defaultInvoice;

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = data.items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const sgst = data.items.reduce((sum, item) => sum + (item.sgst / 100 || 0), 0);
    const cgst = data.items.reduce((sum, item) => sum + (item.cgst / 100 || 0), 0);
    const igst = data.items.reduce((sum, item) => sum + (item.igst / 100 || 0), 0);
    const total = subtotal + sgst + cgst + igst;

    return { subtotal, sgst, cgst, igst, total };
  };

  const totals = calculateTotals();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section with Logo and Title */}
        <View style={styles.headerRow}>
          <View>
            {vendorLogo && <Image src={vendorLogo} style={styles.logo} />}
          </View>
          <View>
            <Text style={styles.title}>TAX INVOICE</Text>
            <Text style={styles.invoiceNumber}>#{data.invoiceNumber}</Text>
          </View>
        </View>

        {/* Seller and Buyer Information */}
        <View style={styles.addressSection}>
        <View style={styles.addressColumn}>
          
          <Text style={styles.value}>{invoice.company.name}</Text>
          <Text style={styles.value}>GSTIN: {invoice.company.gstin}</Text>
          <Text style={styles.value}>{invoice.company.address}</Text>
          <Text style={styles.value}>{invoice.company.state}</Text>
          
        </View>

          {/* Invoice Details */}
          <View style={styles.detailsColumn}>
            <View style={styles.detailRow}>
              <Text style={[styles.label, { width: 100 }]}>Invoice#</Text>
              <Text>{data.invoiceNumber}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.label, { width: 100 }]}>Invoice Date</Text>
              <Text>{data.invoiceDate}</Text>
            </View>
            
          </View>
        </View>

        {/* Client Information */}
        <View style={styles.section}>
          <Text style={styles.label}>Bill To:</Text>
          <Text style={styles.value}>{data.client.name}</Text>
          <Text style={styles.value}>GSTIN: {data.client.gstin}</Text>
          <Text style={styles.value}>{data.client.address}</Text>
         
          <Text style={styles.value}>{data.client.state}</Text>
         
        </View>




        {/* Invoice Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, { flex: 3 }]}>Item Description</Text>
            <Text style={[styles.tableHeader, { flex: 1 }]}>Qty</Text>
            <Text style={[styles.tableHeader, { flex: 1 }]}>Rate</Text>
            <Text style={[styles.tableHeader, { flex: 1 }]}>SGST</Text>
            <Text style={[styles.tableHeader, { flex: 1 }]}>CGST</Text>
            <Text style={[styles.tableHeader, { flex: 1 }]}>Igst</Text>
            <Text style={[styles.tableHeader, { flex: 1 }]}>Amount</Text>
          </View>

          {/* Table Items */}
          {data.items.map((item, index) => (
            <React.Fragment key={index}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 3, textAlign: 'left' }]}>
                  {item.description}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.rate}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.sgst }(%)</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.cgst}(%)</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.igst}(%)</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.amount}</Text>
              </View>
              <View style={styles.hsnRow}>
                <Text style={[styles.hsnCell, { flex: 3, textAlign: 'left' }]}>
                  HSN/SAC: {item.hsnSac || "-"}
                </Text>
                <Text style={[styles.hsnCell, { flex: 6 }]}></Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Totals Section */}
        <View style={styles.totalsSection}>
          <Text style={styles.totalLabel}>Sub Total</Text>
          <Text style={styles.totalValue}>{totals.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalsSection}>
          <Text style={styles.totalLabel}>SGST</Text>
          <Text style={styles.totalValue}>{totals.sgst.toFixed(2)}</Text>
        </View>
        <View style={styles.totalsSection}>
          <Text style={styles.totalLabel}>CGST</Text>
          <Text style={styles.totalValue}>{totals.cgst.toFixed(2)}</Text>
        </View>
        <View style={styles.totalsSection}>
          <Text style={styles.totalLabel}>igst</Text>
          <Text style={styles.totalValue}>{totals.igst.toFixed(2)}</Text>
        </View>
        <View style={styles.grandTotal}>
          <Text style={styles.grandTotalLabel}>TOTAL</Text>
          <Text style={styles.grandTotalValue}>{totals.total.toFixed(2)}</Text>
        </View>

        {/* Notes */}
        <View style={styles.notes}>
          <Text style={styles.notesTitle}>Notes</Text>
          <Text>{data.notes}</Text>
        </View>

        {/* Signature */}
        <View style={styles.signature}>
          <View style={styles.signatureBox}>
            <Text>Authorized Signature</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default GSTInvoice;