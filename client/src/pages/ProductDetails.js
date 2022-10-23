import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from 'react-bootstrap';
import { Counter } from '../components/Counter';

const DataImg = ({ data }) => <img src={`data:image;base64,${data}`} />; // move to utils

export function ProductDetails() {
  let { id } = useParams();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(0);

  const getProduct = async () => {
    try {
      const response = await fetch(`http://localhost:3000/products/${id}`, { credentials: 'include' });
      const jsonData = await response.json();
      console.log(jsonData);
      setProduct(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const addProduct = async () => { // move into utils with id argument
    try {
      const response = await fetch(`http://localhost:3000/cart/new-item/${id}`, { credentials: 'include', method: 'POST' });
      const jsonData = await response.json();
      console.log(jsonData.message);
      setQuantity(quantity+1);
    } catch (err) {
      console.error(err.message);
    }
  };

  const removeProduct = async () => {
    try {
      const response = await fetch(`http://localhost:3000/cart/remove-item/${id}`, { credentials: 'include', method: 'DELETE' });
      const jsonData = await response.json();
      console.log(jsonData.message);
      setQuantity(quantity-1);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getCart = async () => {
    try {
      const response = await fetch(`http://localhost:3000/cart/`, { credentials: 'include' });
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
  }, []);

  return (
    <div>
      <h1>Product Details</h1>
      <br />
      <h2>{product.name}</h2>
      {product.img?<DataImg data={product.img} />:''}
      <p>{product.description}</p>
      <p>Price: {product.price}$</p>
      <p>Category: {product.category}</p>
      {quantity?<Counter count={quantity} increase={addProduct} decrease={removeProduct} />:<Button variant="success" onClick={() => { addProduct() }}>Add product to cart</Button>}
    </div>
  );
}