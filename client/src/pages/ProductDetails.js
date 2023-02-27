import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from 'react-bootstrap';
import { Counter } from '../components/Counter';

// const DataImg = ({ data }) => <img src={`data:image;base64,${data}`} />; // move to utils

export function ProductDetails({ user }) {
  let { id } = useParams();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(0);

  const getProduct = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL+`/products/${id}`, { credentials: 'include' });
      const jsonData = await response.json();
      console.log(jsonData);
      setProduct(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const addProduct = async () => { // move into utils with id argument
    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL+`/cart/new-item/${id}`, { credentials: 'include', method: 'POST' });
      const jsonData = await response.json();
      console.log(jsonData.message);
      setQuantity(quantity + 1);
    } catch (err) {
      console.error(err.message);
    }
  };

  const removeProduct = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL+`/cart/remove-item/${id}`, { credentials: 'include', method: 'DELETE' });
      const jsonData = await response.json();
      console.log(jsonData.message);
      setQuantity(quantity - 1);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getCart = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL+`/cart/`, { credentials: 'include' });
      const jsonData = await response.json();
      console.log(jsonData);
      setQuantity(jsonData.Items.find(item => item.product_id == id).quantity);
    } catch (err) {
      console.error(err.message);
    }
  };


  useEffect(() => {
    getCart();
    getProduct();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{paddingTop: 60, color: 'rgb(243, 189, 117)', textShadow: '0px 2px 2px rgb(0 0 0 / 80%)'}}>
      <h1>Product Details</h1>
      <br />
      <h2>{product.name}</h2>
      {/* {product.img?<DataImg data={product.img} />:''} */}
      {product.img ? <img src={product.img} style={{ width: '20%', filter: 'drop-shadow(rgba(0, 0, 0, 0.5) 20px 20px 20px) grayscale(100%) invert(0%) sepia(47%) saturate(383%) hue-rotate(331deg)' }} /> : ''}
      <p>{product.description}</p>
      <p>Price: {product.price}$</p>
      <p>Category: {product.category}</p>
      {user.user_id &&
        (quantity ? <Counter count={quantity} increase={addProduct} decrease={removeProduct} /> : <Button variant="success" onClick={() => { addProduct() }}>Add product to cart</Button>)
      }
    </div>
  );
}