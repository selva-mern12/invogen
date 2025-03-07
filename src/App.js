import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './component/Register';
import InvoiceGenerator from './component/InvoiceGenerator'
import MyInvoice from './component/MyInvoice';
import './App.css';

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path='/authentication' element={<Register />} />
            <Route path='/' element={<InvoiceGenerator />} />        
            <Route path='/myinvoice' element={<MyInvoice />} />              
            {/* <Route path="/not-found" element={<NotFound />} /> */}
            <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
    </BrowserRouter>
)


export default App;
