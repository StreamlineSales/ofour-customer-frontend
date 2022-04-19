import { useEffect, useState } from 'react';
import './App.css';
import { CartItemDTO } from './utils/models';
import { CartContext } from './contexts/CartContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Order from './pages/Order';
import { Toaster } from 'react-hot-toast';
import * as smoothscroll from 'smoothscroll-polyfill';
import StripeOrder from './pages/StripeOrder';

function App() {

  const [cartItems, setCartItems] = useState<CartItemDTO[]>([]);
  
  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  return (
    <Router>
      <CartContext.Provider value={{ cartItems, setCartItems }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Cart />} />
          <Route path="/order" element={<Order />} />
          <Route path="/stripeorder" element={<StripeOrder />} />
        </Routes>
        <Toaster/>
      </CartContext.Provider>
    </Router>
  );
}

export default App;
