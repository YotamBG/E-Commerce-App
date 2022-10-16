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


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="cart" element={<Cart/>} />
          <Route path="products" element={<Products/>} />
          <Route path="profile" element={<Profile/>} />
          <Route path="orders" element={<Orders/>} />
          <Route path="register" element={<Register/>} />
          <Route path="login" element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
