import { Link } from "react-router-dom";
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { Counter } from './Counter';


export function Product({ details, getCart, variable }) {

  const addProduct = async () => {
    try {
      const response = await fetch(`http://localhost:3000/cart/new-item/${details.product_id}`, { credentials: 'include', method: 'POST' });
      const jsonData = await response.json();
      getCart();
      console.log(jsonData.message);

    } catch (err) {
      console.error(err.message);
    }
  };

  const removeProduct = async () => {
    try {
      const response = await fetch(`http://localhost:3000/cart/remove-item/${details.product_id}`, { credentials: 'include', method: 'DELETE' });
      const jsonData = await response.json();
      getCart();
      console.log(jsonData.message);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <Card >
        {/* {details.img ? <Card.Img variant="top" src={`data:image;base64,${details.img}`} style={{ maxWidth: '200px', margin: 'auto' }} /> : ''} */}
        {details.img ? <Card.Img variant="top" src={details.img} style={{ maxWidth: '200px', margin: 'auto' }} /> : ''}
        <Card.Body>
          <Card.Title>{details.name}</Card.Title>
          <Card.Text>
            {details.price}$
          </Card.Text>
          {details.quantity ?
            (variable ?
              <Counter increase={addProduct} decrease={removeProduct} count={details.quantity} />
              :
              `Quantity: ${details.quantity}`)
            : ''}
          <br />
          <br />
          <Link to={`/productDetails/${details.product_id}`} className='btn btn-primary'>Details</Link>
        </Card.Body>
      </Card>
    </>
  );
}