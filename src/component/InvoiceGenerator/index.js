import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import InvoicePreview from '../InvoicePreview';
import { MdDelete, MdEdit } from 'react-icons/md';
import "./index.css";

const InvoiceGenerator = () => {
  const navigate = useNavigate();
  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientPhNo, setClientPhNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [orderId, setOrderId] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [dealPrice, setDealPrice] = useState("");
  const [tax, setTax] = useState("");
  const [items, setItems] = useState([]);
  const [errormsg, setErrorMsg] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const addItem = () => {
    if (orderId && quantity && regularPrice && dealPrice && tax) {
      const total = quantity * dealPrice;
      const taxAmount = (total * tax) / 100;
      const totalWithTax = total + taxAmount;

      if (editIndex !== null) {
        // Update existing item
        const updatedItems = [...items];
        updatedItems[editIndex] = { orderId, itemName, quantity, regularPrice, dealPrice, tax, total, totalWithTax };
        setItems(updatedItems);
        setEditIndex(null); // Reset edit mode
      } else {
        // Add new item
        setItems([...items, { orderId, itemName, quantity, regularPrice, dealPrice, tax, total, totalWithTax }]);
      }

      // Clear form fields
      setOrderId("");
      setItemName("");
      setQuantity("");
      setRegularPrice("");
      setDealPrice("");
      setTax("");
      setErrorMsg("");
    } else {
      setErrorMsg("Please add valid data");
    }
  };

  const editItem = (index) => {
    const item = items[index];
    setOrderId(item.orderId);
    setItemName(item.itemName);
    setQuantity(item.quantity);
    setRegularPrice(item.regularPrice);
    setDealPrice(item.dealPrice);
    setTax(item.tax);
    setEditIndex(index);
  };

  const deleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const grandTotal = items.reduce((acc, item) => acc + item.total, 0);
  const grandTotalWithTax = items.reduce((acc, item) => acc + item.totalWithTax, 0);

  const userId = Cookies.get('user_id');
  const jwtToken = Cookies.get('jwt_token');
  const invoiceDetails = {
    userId,
    clientName,
    clientCompany,
    clientPhNo,
    invoiceDate,
    itemDetails: items,
    totalAmount: grandTotal,
    totalAmountWithTax: grandTotalWithTax,
  };

  const generateInvoice = async () => {
    if(userId !== '' &&
      clientName !== '' &&
      clientCompany !== '' &&
      clientPhNo !== '' &&
      invoiceDate !== '' &&
      items !== '' &&
      grandTotal !== '' &&
      grandTotalWithTax !== '' ){
          const url = "https://invo-gen-server.onrender.com/invoice/add";
        const option = {
          method: "POST",
          headers: { "Content-Type": "application/json",Authorization: `Bearer ${jwtToken}` },
          body: JSON.stringify({ invoiceDetails }),
        };
        const addInvoiceResponse = await fetch(url, option);
        const addInvoiceData = await addInvoiceResponse.json();
        if (addInvoiceResponse.ok) {
          console.log(invoiceDetails);
          console.log(addInvoiceData.message);
          setModalIsOpen(true);
        } else {
          console.log(addInvoiceData.error);
        }
    }
    else{
      setErrorMsg("Add invoice Details")
    }
  };

  const safeFormatCurrency = (amount) => {
    const parsedAmount = parseFloat(amount);
    return isNaN(parsedAmount) ? "Rs.0.00" : `Rs.${parsedAmount.toFixed(2)}`;
  };

  if(!jwtToken) {
    return <Navigate to='/authentication' />;
  }

  return (
    <div className="invoice-gen-bg">
  <button type="button" className="myinvoice-button" onClick={() => navigate('/myinvoice')}>My Invoice</button>
  <div className="invoice-container">
    <h1>Invoice Generator</h1>
    <div className="input-group">
      <input
        type="text"
        placeholder="Store Name"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        className="input-field"
        id="clientName"
      />
      <label htmlFor="clientName" className="input-label">Store Name</label>
    </div>
    <div className="input-group">
      <input
        type="text"
        placeholder="Store Address"
        value={clientCompany}
        onChange={(e) => setClientCompany(e.target.value)}
        className="input-field"
        id="clientCompany"
      />
      <label htmlFor="clientCompany" className="input-label">Store Address</label>
    </div>
    <div className="input-group">
      <input
        type="number"
        placeholder="Mobile number"
        value={clientPhNo}
        onChange={(e) => setClientPhNo(e.target.value)}
        className="input-field"
        id="clientPhNo"
      />
      <label htmlFor="clientPhNo" className="input-label">Mobile Number</label>
    </div>
    <div className="input-group">
      <input
        type="date"
        value={invoiceDate}
        onChange={(e) => setInvoiceDate(e.target.value)}
        className="input-field"
        id="invoiceDate"
      />
      <label htmlFor="invoiceDate" className="input-label">Invoice Date</label>
    </div>
    <div className="grid">
      <div className="input-group">
        <input
          type="text"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="input-field"
          id="orderId"
        />
        <label htmlFor="orderId" className="input-label">Order ID</label>
      </div>
      <div className="input-group">
        <input
          type="text"
          placeholder="Item name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="input-field"
          id="itemName"
        />
        <label htmlFor="itemName" className="input-label">Item Name</label>
      </div>
      <div className="input-group">
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="input-field"
          id="quantity"
        />
        <label htmlFor="quantity" className="input-label">Quantity</label>
      </div>
      <div className="input-group">
        <input
          type="number"
          placeholder="Regular Price"
          value={regularPrice}
          onChange={(e) => setRegularPrice(e.target.value)}
          className="input-field"
          id="regularPrice"
        />
        <label htmlFor="regularPrice" className="input-label">Regular Price</label>
      </div>
      <div className="input-group">
        <input
          type="number"
          placeholder="Deal Price"
          value={dealPrice}
          onChange={(e) => setDealPrice(e.target.value)}
          className="input-field"
          id="dealPrice"
        />
        <label htmlFor="dealPrice" className="input-label">Deal Price</label>
      </div>
      <div className="input-group">
        <input
          type="number"
          placeholder="Tax (%)"
          value={tax}
          onChange={(e) => setTax(e.target.value)}
          className="input-field"
          id="tax"
        />
        <label htmlFor="tax" className="input-label">Tax (%)</label>
      </div>
    </div>
    <button onClick={addItem} className="add-button">
      {editIndex !== null ? "Update Item" : "Add Item"}
    </button>
    {errormsg && <p className="error_msg">{errormsg}</p>}
    <table className="invoice-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Item Name</th>
          <th>Quantity</th>
          <th>Regular Price</th>
          <th>Deal Price</th>
          <th>Tax</th>
          <th>Total</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            <td>{item.orderId}</td>
            <td>{item.itemName}</td>
            <td>{item.quantity}</td>
            <td>{safeFormatCurrency(item.regularPrice)}</td>
            <td>{safeFormatCurrency(item.dealPrice)}</td>
            <td>{`${item.tax} %`}</td>
            <td>{safeFormatCurrency(item.total)}</td>
            <td>
              <button onClick={() => editItem(index)} className="edit-button"><MdEdit /></button>
              <button onClick={() => deleteItem(index)} className="delete-button"><MdDelete /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="total">
      <h2>Grand Total: {safeFormatCurrency(grandTotal)}</h2>
      <h2>Grand Total (With Tax): {safeFormatCurrency(grandTotalWithTax)}</h2>
    </div>
    <InvoicePreview modalIsOpen={modalIsOpen} invoiceDetails={invoiceDetails} setModalIsOpen={setModalIsOpen} />
    <button className="add-button" onClick={generateInvoice}>Generate Invoice</button>
  </div>
  <button type="button" className="logout-button" onClick={() =>{
                     navigate('/myinvoice')
                     Cookies.remove('jwt_token','username','user_id')}}>
  Logout</button>
</div>
  );
};

export default InvoiceGenerator;