import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Order } from '../components/Order';
import { Product } from "../components/Product";


export function OrderDetails({ user }) {
  let { id } = useParams();
  const [order, setOrder] = useState({});

  const getOrder = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL+`/orders/${id}`, {
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
      const response = await fetch(process.env.REACT_APP_SERVER_URL+`/products/${id}`, {
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
    // if(!user.username){
    //   console.log('gotcha!');
    //   window.location = "/login";
    // }
    getOrder();
  }, []);

  return (
    order.Items && (
      <div style={{paddingTop: 60, color: 'rgb(243, 189, 117)', textShadow: '0px 2px 2px rgb(0 0 0 / 80%)'}}>
        <h1>Order Details:</h1>
        <p>Order ID: {order.Details.order_id}</p>
        <p>Date: {new Date(order.Details.date).toLocaleDateString("en-UK")}</p>
        <p>Total: {order.Details.total}$</p>
        <br />
        <h3>Products:</h3>
        <div>
          {order.Items ? order.Items.map((product, i) => <div key={i} style={{ margin: '150px auto', maxWidth: (window.innerWidth > 480 ? '20%' : '80%'), minHeight: 200, maxHeight: 300, marginBottom: 50 }} ><Product details={product} id={i} getOrder={getProduct} variable={false} /></div>) : ''}
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