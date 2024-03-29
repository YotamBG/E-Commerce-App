import './App.css';
import { } from 'react-bootstrap';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { NavBar } from './components/NavBar';
import { Cart } from './pages/Cart';
import { ProductList } from './pages/ProductList';
import { Profile } from './pages/Profile';
import { OrdersList } from './pages/OrdersList';
import { OrderDetails } from './pages/OrderDetails';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { ProductUpload } from './pages/ProductUpload';
import { ProductDetails } from './pages/ProductDetails';
import { useEffect, useState } from "react";
//require('dotenv').config({path: '../../server/.env'});


function App() {
  const [user, setUser] = useState({});  

  const getUser = async () => { //check for user in the frontend instead of sending requestto backend?
    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL+"/users/profile", { credentials: 'include' });
      const jsonData = await response.json();
      console.log(jsonData);
      if (response.status == 200) {
        setUser(jsonData.user);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => { //use this user instead of fetching it in each page?
    getUser();
  }, []);

  return (
    <div className="App" style={{ backgroundSize: 'cover', backgroundRepeat: 'no-repeat', overflow: 'hidden' }}>
      <BrowserRouter>
        <NavBar user={user} />        
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="cart" element={<Cart user={user} />} />
          <Route path="productList" element={<ProductList />} />
          <Route path="profile" element={<Profile user={user}/>} />
          <Route path="ordersList" element={<OrdersList user={user}/>} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="productUpload" element={<ProductUpload />} />
          <Route path="productDetails/:id" element={<ProductDetails user={user} />} />
          <Route path="orderDetails/:id" element={<OrderDetails user={user} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
