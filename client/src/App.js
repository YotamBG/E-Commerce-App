import './App.css';
import { } from 'react-bootstrap';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { NavBar } from './components/NavBar';
import { Cart } from './pages/Cart';
import { Products } from './pages/Products';
import { Profile } from './pages/Profile';
import { Orders } from './pages/Orders';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { ProductUpload } from './pages/ProductUpload';
import { ProductDetails } from './pages/ProductDetails';
import { useEffect, useState } from "react";


function App() {
  const [user, setUser] = useState({});

  const getUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/profile", { credentials: 'include' });
      const jsonData = await response.json();
      console.log(jsonData);
      if (response.status == 200) {
        setUser(jsonData.user);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar user={user} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="cart" element={<Cart />} />
          <Route path="products" element={<Products />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="productUpload" element={<ProductUpload />} />
          <Route path="productDetails/:id" element={<ProductDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
