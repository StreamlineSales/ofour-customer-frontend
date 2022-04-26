import { useEffect, useState } from 'react';
import './App.css';
import { CartItemDTO } from './utils/models';
import { CartContext } from './contexts/CartContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import { Toaster } from 'react-hot-toast';
import * as smoothscroll from 'smoothscroll-polyfill';

function App() {

  const [cartItems, setCartItems] = useState<any[]>([]);
  
  useEffect(() => {
    smoothscroll.polyfill();
  }, []);

  return (
    <Router>
      <CartContext.Provider value={{ cartItems, setCartItems }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <Toaster/>
      </CartContext.Provider>
    </Router>
  );
}

export default App;
