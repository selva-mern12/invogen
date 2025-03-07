import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Popup from "reactjs-popup";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const InvoicePreview = (props) => {
  const { modalIsOpen, setModalIsOpen, invoiceDetails, close } = props;
  const {
    clientName,
    clientCompany,
    clientPhNo,
    invoiceDate,
    itemDetails ,
    totalAmount,
    totalAmountWithTax,
  } = invoiceDetails;
  const parseItemDetails = close ? JSON.parse(itemDetails) : itemDetails;

  const [userData, setUserData] = useState({
    name: "",
    companyName: "",
    companyAddress: "",
    mobileNumber: "",
  });
  const userId = Cookies.get("user_id");
  const jwtToken = Cookies.get("jwt_token");

  useEffect(() => {
    const getUserDetails = async () => {
      const userResponse = await fetch(
        `https://invo-gen-server.onrender.com/invoice/user?userId=${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json",Authorization: `Bearer ${jwtToken}` }
        }
      );
      const userData = await userResponse.json();
      if (userResponse.ok) {
        const updatedData = {
          name: userData.name,
          companyName: userData.company_name,
          companyAddress: userData.company_address,
          mobileNumber: userData.mobile_number,
        };
        setUserData(updatedData);
      } else {
        console.log(userData.error);
      }
    };
    getUserDetails();
  }, [userId,jwtToken]);

  const safeFormatCurrency = (amount) => {
    const parsedAmount = parseFloat(amount);
    return isNaN(parsedAmount) ? "Rs.0.00" : `Rs.${parsedAmount.toFixed(2)}`;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Add Invoice Title
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text("INVOICE", 105, 15, { align: "center" });
  
    // Add Bill From (User Details) on the left side
    doc.setFontSize(12);
    doc.text("Bill From:", 20, 30);
    doc.text(`Name: ${userData.name}`, 20, 40);
    doc.text(`Company: ${userData.companyName}`, 20, 50);
    doc.text(`Address: ${userData.companyAddress}`, 20, 60);
    doc.text(`Mobile: ${userData.mobileNumber}`, 20, 70);
  
    // Add Bill To (Client Details) on the right side
    doc.text("Bill To:", 110, 30);
    doc.text(`Name: ${clientName}`, 110, 40);
    doc.text(`Company: ${clientCompany}`, 110, 50);
    doc.text(`Mobile: ${clientPhNo}`, 110, 60);
    doc.text(`Date: ${invoiceDate}`, 110, 70);
  
    // Prepare table data
    const tableData = parseItemDetails.map((item) => [
      item.orderId,
      item.itemName,
      item.quantity,
      safeFormatCurrency(item.regularPrice),
      safeFormatCurrency(item.dealPrice),
      `${item.tax} %`,
      safeFormatCurrency(item.total),
    ]);
  
    // Add table
    autoTable(doc, {
      startY: 80,
      head: [["Order ID", "Item Name", "Quantity", "Regular Price", "Deal Price", "Tax", "Total"]],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2, textColor: [0, 0, 0] }, 
      headStyles: { fillColor: [0, 0, 0, 0.9], textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' },
        4: { cellWidth: 'auto' },
        5: { cellWidth: 'auto' },
        6: { cellWidth: 'auto' },
      },
    });
  
    // Add Grand Totals
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Grand Total: ${safeFormatCurrency(totalAmount)}`, 20, finalY);
    doc.text(`Grand Total (With Tax): ${safeFormatCurrency(totalAmountWithTax)}`, 20, finalY + 10);
  
    // Save PDF
    doc.save("invoice.pdf");
  };
  
  const shareInvoice = async () => {
    const doc = new jsPDF();
  
    // Add Invoice Title
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text("INVOICE", 105, 15, { align: "center" });
  
    // Add Bill From (User Details) on the left side
    doc.setFontSize(12);
    doc.text("Bill From:", 20, 30);
    doc.text(`Name: ${userData.name}`, 20, 40);
    doc.text(`Company: ${userData.companyName}`, 20, 50);
    doc.text(`Address: ${userData.companyAddress}`, 20, 60);
    doc.text(`Mobile: ${userData.mobileNumber}`, 20, 70);
  
    // Add Bill To (Client Details) on the right side
    doc.text("Bill To:", 110, 30);
    doc.text(`Name: ${clientName}`, 110, 40);
    doc.text(`Company: ${clientCompany}`, 110, 50);
    doc.text(`Mobile: ${clientPhNo}`, 110, 60);
    doc.text(`Date: ${invoiceDate}`, 110, 70);
  
    // Prepare table data
    const tableData = parseItemDetails.map((item) => [
      item.orderId,
      item.itemName,
      item.quantity,
      safeFormatCurrency(item.regularPrice),
      safeFormatCurrency(item.dealPrice),
      `${item.tax} %`,
      safeFormatCurrency(item.total),
    ]);
  
    // Add table
    autoTable(doc, {
      startY: 80,
      head: [["Order ID", "Item Name", "Quantity", "Regular Price", "Deal Price", "Tax", "Total"]],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2, textColor: [0, 0, 0] }, // Consistent with preview
      headStyles: { fillColor: [0, 0, 0, 0.9], textColor: [255, 255, 255], fontStyle: "bold" }, // Dark background with white text
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' },
        4: { cellWidth: 'auto' },
        5: { cellWidth: 'auto' },
        6: { cellWidth: 'auto' },
      },
    });
  
    // Add Grand Totals
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Grand Total: ${safeFormatCurrency(totalAmount)}`, 20, finalY);
    doc.text(`Grand Total (With Tax): ${safeFormatCurrency(totalAmountWithTax)}`, 20, finalY + 10);
  
    // Convert PDF to Blob
    const pdfBlob = doc.output("blob");
    const file = new File([pdfBlob], "invoice.pdf", { type: "application/pdf" });
  
    // Share PDF
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: "Invoice",
          text: `Invoice for ${clientName}`,
          files: [file],
        });
        console.log("Successful share");
      } catch (error) {
        console.log("Error sharing", error);
      }
    } else {
      alert("Sharing PDF is not supported on this device/browser.");
    }
  };

  return (
    <Popup modal open={modalIsOpen}>
      <div className="invoice-preview-bg">
        <div className="invoice-preview">
          <h2 style={{ textAlign: "center" }}>INVOICE</h2>
          <div className="preview-content">
            {/* Bill From (User Details) */}
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div>
                <h3>Bill From:</h3>
                <p><strong>Name:</strong> {userData.name}</p>
                <p><strong>Company:</strong> {userData.companyName}</p>
                <p><strong>Address:</strong> {userData.companyAddress}</p>
                <p><strong>Mobile:</strong> {userData.mobileNumber}</p>
              </div>
              {/* Bill To (Client Details) */}
              <div>
                <h3>Bill To:</h3>
                <p><strong>Name:</strong> {clientName}</p>
                <p><strong>Company:</strong> {clientCompany}</p>
                <p><strong>Mobile:</strong> {clientPhNo}</p>
                <p><strong>Date:</strong> {invoiceDate}</p>
              </div>
            </div>
            {/* Item Details Table */}
            <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#00000090", color: "#fff",height: "50px"}}>
                <tr>
                  <th>Order ID</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Regular Price</th>
                  <th>Deal Price</th>
                  <th>Tax</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(parseItemDetails) && parseItemDetails?.map((item, index) => (
                  <tr key={index}  style={{height: "40px"}}>
                    <td>{item.orderId}</td>
                    <td>{item.itemName}</td>
                    <td>{item.quantity}</td>
                    <td>{safeFormatCurrency(item.regularPrice)}</td>
                    <td>{safeFormatCurrency(item.dealPrice)}</td>
                    <td>{`${item.tax} %`}</td>
                    <td>{safeFormatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Grand Totals */}
            <p className="total"><strong>Grand Total:</strong> ₹{totalAmount.toFixed(2)}</p>
            <p className="total"><strong>Grand Total (With Tax):</strong> ₹{totalAmountWithTax.toFixed(2)}</p>
          </div>
          {/* Action Buttons */}
          <div className="preview-actions">
            <button onClick={generatePDF}>Download PDF</button>
            <button onClick={shareInvoice}>Share Invoice</button>
            
            {close ? 
            <button onClick={() => setModalIsOpen(false)}>Close</button> : 
            <button onClick={() => window.location.href = '/'}>New Invoice</button>
            }
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default InvoicePreview;