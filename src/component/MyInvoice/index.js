import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import Cookies from 'js-cookie';
import InvoicePreview from '../InvoicePreview';
import './index.css';

const pageStatus = {
    initial: 'INITIAL',
    loading: 'LOADING',
    success: 'SUCCESS',
    empty: 'EMPTY',
    failure: 'FAILURE',
};

const MyInvoice = () => {
    const navigate = useNavigate();
    const [invoiceStatus, setInvoiceStatus] = useState(pageStatus.initial);
    const [invoiceList, setInvoiceList] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const jwtToken = Cookies.get('jwt_token');
    const userId = Cookies.get('user_id');

    useEffect(() => {
        const fetchInvoices = async () => {
            setInvoiceStatus(pageStatus.loading);
            try {
                const response = await fetch(`https://invo-gen-server.onrender.com/invoice/get?userId=${userId}`, {
                    method: 'GET', 
                    headers: { 
                        'Content-Type': 'application/json', 
                        Authorization: `Bearer ${jwtToken}` 
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data) && data.length > 0) {
                        const updatedData = data.map((invoice) => ({
                            clientCompany: invoice.client_company,
                            clientName: invoice.client_name,
                            clientPhNo: invoice.client_ph_no,
                            invoiceDate: invoice.invoice_date,
                            invoiceID: invoice.invoice_id,
                            itemDetails: invoice.item_details,
                            totalAmount: invoice.total_amount,
                            totalAmountWithTax: invoice.total_amount_with_tax,
                        }));

                        setInvoiceList(updatedData);
                        setInvoiceStatus(pageStatus.success);
                    } else {
                        setInvoiceList([]);
                        setInvoiceStatus(pageStatus.empty);
                    }
                } else {
                    setInvoiceList([]);
                    setInvoiceStatus(pageStatus.failure);
                }
            } catch (error) {
                console.error(error);
                setInvoiceList([]);
                setInvoiceStatus(pageStatus.failure);
            }
        };

        fetchInvoices();
    }, [jwtToken, userId]);

    const deleteInvoice = async (invoiceID) => {
        try {
            const response = await fetch(`https://invo-gen-server.onrender.com/invoice/delete?invoiceId=${invoiceID}`, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json', 
                    Authorization: `Bearer ${jwtToken}` 
                },
            });

            if (response.ok) {
                setInvoiceList((prevInvoices) => 
                    prevInvoices.filter((invoice) => invoice.invoiceID !== invoiceID)
                );
            } else {
                console.error("Failed to delete invoice:", response.statusText);
            }
        } catch (error) {
            alert("An error occurred while deleting the invoice.");
            console.error("Error deleting invoice:", error);
        }
    };

    const handleViewDetails = (invoice) => {
        setSelectedInvoice(invoice);
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
        setSelectedInvoice(null);
    };

    const renderInvoices = () => {
        switch (invoiceStatus) {
            case pageStatus.loading:
                return null;
            case pageStatus.empty:
                return (
                    <div className="empty-invoice-container">
                        <h2 className="invoice-heading">My Invoices</h2>
                        <p className="invoice-para">No Invoices Available</p>
                        <button className="back-button" onClick={() => navigate('/')}>Create Invoice</button>
                    </div>
                );
            case pageStatus.success:
                return (
                    <div className="invoice-main-container">
                        <h2 className="invoice-heading">My Invoices</h2>
                        <table className="invoice-table">
                            <thead>
                                <tr>
                                    <th>Client Name</th>
                                    <th>Company</th>
                                    <th>Phone</th>
                                    <th>Invoice Date</th>
                                    <th>Item Details</th>
                                    <th>Total</th>
                                    <th>Total w/ Tax</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceList.map((invoice) => (
                                    <tr key={invoice.invoiceID}>
                                        <td>{invoice.clientName}</td>
                                        <td>{invoice.clientCompany}</td>
                                        <td>{invoice.clientPhNo}</td>
                                        <td>{invoice.invoiceDate}</td>
                                        <td>
                                            <button className="details-button" onClick={() => handleViewDetails(invoice)}>View Details</button>
                                        </td>
                                        <td>{invoice.totalAmount}</td>
                                        <td>{invoice.totalAmountWithTax}</td>
                                        <td className="invoice-actions">
                                            <button className="delete-button" onClick={() => deleteInvoice(invoice.invoiceID)}><MdDelete /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="back-button" onClick={() => navigate('/')}>Create Invoice</button>
                    </div>
                );
            case pageStatus.failure:
                return null;
            default:
                return null;
        }
    };

    if(!jwtToken) {
        return <Navigate to='/authentication' />;
    }

    return (
        <div className="invoice-container">
            {renderInvoices()}
            {selectedInvoice && (
                <InvoicePreview
                    modalIsOpen={modalIsOpen}
                    setModalIsOpen={setModalIsOpen}
                    invoiceDetails={selectedInvoice}
                    close={handleCloseModal}
                />
            )}
        </div>
    );
};

export default MyInvoice;