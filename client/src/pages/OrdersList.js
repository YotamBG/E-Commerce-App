import { useEffect, useState } from "react";
import { Order } from '../components/Order';

export function OrdersList() {
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const response = await fetch(`http://localhost:3000/orders/`, { credentials: 'include' });
      const jsonData = await response.json();
      console.log(jsonData);
      setOrders(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div>
      <h1>Orders</h1>
      <br />
      <div>
        {orders.map((order, i) => <><Order Details={order} id={i} key={i} /><br /><br /></>)}
      </div>
    </div >
  );
}

{/* return (
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
  ); */}