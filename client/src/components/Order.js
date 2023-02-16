import { Link } from "react-router-dom";
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { Counter } from './Counter';


export function Order({ Details }) {
  return (
    <>
      <Card >
        <Card.Body>
          <Card.Title>Order ID: {Details.order_id}</Card.Title>
          <br />
          <Card.Text>Date: {new Date(Details.date).toLocaleDateString("en-UK")}</Card.Text>
          <Card.Text>Total: {Details.total}$</Card.Text>
          <br />
          <Link to={`/orderDetails/${Details.order_id}`} className='btn btn-primary'>Details</Link>
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