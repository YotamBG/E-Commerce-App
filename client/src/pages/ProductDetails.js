import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from 'react-bootstrap';

const DataImg = ({ data }) => <img src={`data:image;base64,${data}`} />; // move to utils

export function ProductDetails() {
  let { id } = useParams();
  const [product, setProduct] = useState({});

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


  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div>
      <h1>Product Details</h1>
      <br />
      <h2>{product.name}</h2>
      <DataImg data={product.img} />
      <p>Price: {product.price}$</p>
      <p>Category: {product.category}</p>
    </div>
  );
}