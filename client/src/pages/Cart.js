import { useEffect, useState } from "react";
import { Product } from '../components/Product';
import { Button, ButtonGroup } from 'react-bootstrap';
import { Link } from "react-router-dom";

export function Cart({ user }) {
  const [cart, setCart] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getCart = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL+`/cart/`, {
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
    // if (!user.username) {
    //   console.log('gotcha!');
    //   window.location = "/login";
    // }
    getCart();
  }, []);

  const submitCheckout = () => {
    console.log('submitCheckout');
    setIsLoading(true);
    fetch(process.env.REACT_APP_SERVER_URL+"/cart/create-checkout-session", {
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
      <div style={{ paddingTop: 60, color: 'rgb(243, 189, 117)', textShadow: '0px 2px 2px rgb(0 0 0 / 80%)' }}>
        <h1>Cart</h1>
        <p>Total: {cart.Total}$</p>
        <div>
          {cart.Items ? cart.Items.map((product, i) => <div key={i} style={{ margin: '150px auto', maxWidth: (window.innerWidth > 480 ? '20%' : '80%'), minHeight: 200, maxHeight: 300, marginBottom: 50 }}><Product details={product} id={i} getCart={getCart} variable={true} /></div>) : ''}
        </div>
        <Button onClick={submitCheckout} disabled={isLoading} variant="primary" type="submit">Checkout</Button>
      </div >)
  );
}