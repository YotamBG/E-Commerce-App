import { useEffect, useState } from "react";
import { Product } from '../components/Product';
import { Button, ButtonGroup } from 'react-bootstrap';

export function Cart() {
  const [cart, setCart] = useState({});

  const getCart = async () => {
    try {
      const response = await fetch(`http://localhost:3000/cart/`, { credentials: 'include' });
      const jsonData = await response.json();
      console.log(jsonData);
      setCart(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <div>
      <h1>Cart</h1>
      <p>Total: {cart.Total}$</p>
      <div>
        {cart.Items ? cart.Items.map((product, i) => <div key={i}><Product details={product} id={i} getCart={getCart} />
          <br /><br /></div>) : ''}
      </div>
    </div >
  );
}