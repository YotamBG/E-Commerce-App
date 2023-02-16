import { useEffect, useState } from "react";
import { Product } from '../components/Product';
import { Button, ButtonGroup } from 'react-bootstrap';
import { Link } from "react-router-dom";

export function Cart() {
  const [cart, setCart] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getCart = async () => {
    try {
      const response = await fetch(`http://localhost:3000/cart/`, {
        credentials: 'include',
      });
      const jsonData = await response.json();
      console.log(jsonData);
      setCart(jsonData);
    } catch (err) {
      console.error(err.message);
      window.location = "/login";
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const submitCheckout = () => {
    console.log('submitCheckout');
    setIsLoading(true);
    fetch("http://localhost:3000/cart/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: cart.Items }),
      credentials: 'include'
    })
      .then(res => {
        if (res.ok) return res.json()
        return res.json().then(json => Promise.reject(json))
      })
      .then(({ url }) => {
        window.location = url
      })
      .catch(e => {
        console.error(e.error)
      })
  };

  return (
    cart.Items && (
      <div>
        <h1>Cart</h1>
        <p>Total: {cart.Total}$</p>
        <div>
          {cart.Items ? cart.Items.map((product, i) => <div key={i}><Product details={product} id={i} getCart={getCart} variable={true} />
            <br /><br /></div>) : ''}
        </div>
        <Button onClick={submitCheckout} disabled={isLoading} variant="primary" type="submit">Checkout</Button>
      </div >)
  );
}