import { Link } from "react-router-dom";
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { Counter } from './Counter';

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

export function Order({ Details, id }) {
  return (
    <>
    {/* 
      <Card style={{ backgroundColor: `${numToColor(id)}61`, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 0, border: 'none' }}>
     */}
      <Card style={{ backgroundColor: `${numToColor(id)}61`}}>
        <Card.Body>
          <Card.Title>Order ID: {Details.order_id}</Card.Title>
          <br />
          <Card.Text>Date: {new Date(Details.date).toLocaleDateString("en-UK")}</Card.Text>
          <Card.Text>Total: {Details.total}$</Card.Text>
          <br />
          <Link to={`/orderDetails/${Details.order_id}`} className='btn'>Details</Link>
        </Card.Body>
      </Card>
    </>
  );
}



// "Details": {
//   "order_id": 0,
//   "date": "2023-02-14T15:42:09.405Z",
//   "username": "string",
//   "total": 0
// },