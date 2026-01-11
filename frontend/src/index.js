import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ProductProvider } from './components/admin/ProductManagement/ProductContext';
import { CartProvider } from "./components/customers/CartContext";
import { OrderProvider } from './components/admin/OrderManagement/OrderContext';  
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ProductProvider>
        <OrderProvider>     
            <CartProvider>
        <App />
        
        </CartProvider>
      </OrderProvider>
 
      </ProductProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
