import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Order } from '../components/Order';
import { Product } from "../components/Product";


export function OrderDetails({ user }) {
  let { id } = useParams();
  const [order, setOrder] = useState({});

  const getOrder = async () => {
    try {
      const response = await fetch(`http://localhost:3000/orders/${id}`, {
        credentials: 'include',
      });
      const jsonData = await response.json();
      console.log(jsonData);
      setOrder(jsonData);
    } catch (err) {
      console.error(err.message);
      window.location = "/login";
    }
  };

  const getProduct = async () => {
    try {
      const response = await fetch(`http://localhost:3000/products/${id}`, {
        credentials: 'include',
      });
      const jsonData = await response.json();
      console.log(jsonData);
      setOrder(jsonData);
    } catch (err) {
      console.error(err.message);
      window.location = "/login";
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  return (
    order.Items && (
      <div>
        <h1>Order Details:</h1>
        <p>Order ID: {order.Details.order_id}</p>
        <p>Date: {new Date(order.Details.date).toLocaleDateString("en-UK")}</p>
        <p>Total: {order.Details.total}$</p>
        <br />
        <h3>Products:</h3>
        <div>
          {order.Items ? order.Items.map((product, i) => <div key={i}><Product details={product} id={i} getOrder={getProduct} variable={false} />
            <br /><br /></div>) : ''}
        </div>
      </div >)
  );
}


// "Details": {
//   "order_id": 0,
//   "date": "2023-02-14T15:42:09.405Z",
//   "username": "string",
//   "total": 0
// },