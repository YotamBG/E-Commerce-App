import { Link } from "react-router-dom";
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { Counter } from './Counter';


export function Product({ details, getCart, variable, id }) {

  const addProduct = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL+`/cart/new-item/${details.product_id}`, { credentials: 'include', method: 'POST' });
      const jsonData = await response.json();
      getCart();
      console.log(jsonData.message);

    } catch (err) {
      console.error(err.message);
    }
  };

  const removeProduct = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL+`/cart/remove-item/${details.product_id}`, { credentials: 'include', method: 'DELETE' });
      const jsonData = await response.json();
      getCart();
      console.log(jsonData.message);
    } catch (err) {
      console.error(err.message);
    }
  };

  const numToColor = (num) => { //move to utils
    if (num % 5 == 0) {
      return '#fdbd4f';
    }
    if (num % 5 == 1) {
      return '#fee3b9';
    }
    if (num % 5 == 2) {
      return '#028b93';
    }
    if (num % 5 == 3) {
      return '#524038';
    }
    if (num % 5 == 4) {
      return '#f9f7ea';
    }
  };

  return (
    <Link to={`/productDetails/${details.product_id}`} style={{ color: 'white', textDecoration: 'none', height: '100%', width: '100%' }}>
      <Card style={{ backgroundColor: `${numToColor(id)}61`, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 0, border: 'none' }}>
        {/* {details.img ? <Card.Img variant="top" src={`data:image;base64,${details.img}`} style={{ maxWidth: '200px', margin: 'auto' }} /> : ''} */}
        {/* https://codepen.io/sosuke/pen/Pjoqqp */}
        {details.img ? <Card.Img variant="top" src={details.img} style={{ maxHeight: '100%', maxWidth: '80%', filter: 'drop-shadow(rgba(0, 0, 0, 0.5) 20px 20px 20px) grayscale(100%) invert(0%) sepia(47%) saturate(383%) hue-rotate(331deg)' }} /> : ''}
        {
          details.quantity ?
            <Card.Body>
              {variable ?
                <Counter increase={addProduct} decrease={removeProduct} count={details.quantity} /> //shouldn't be part of the link
                :
                `Quantity: ${details.quantity}`}
            </Card.Body>
            : ''
        }
      </Card>
    </Link>
  );
}




/*
<Card.Title>{details.name}</Card.Title>
<Card.Text>
{details.price}$
</Card.Text>

<Link to={`/productDetails/${details.product_id}`} className='btn btn-primary'>Details</Link>
*/