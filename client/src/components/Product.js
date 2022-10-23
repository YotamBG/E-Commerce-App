import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";


export function Product({ details }) {

  return (
    <>
      <Card >
        {details.img ? <Card.Img variant="top" src={`data:image;base64,${details.img}`} style={{maxWidth: '200px', margin: 'auto'}}/> : ''}
        <Card.Body>
          <Card.Title>{details.name}</Card.Title>
          <Card.Text>
            {details.price}$
            <br />
            {details.quantity?<p>{details.quantity} selected.</p>:''}
          </Card.Text>
          <Link to={`/productDetails/${details.product_id}`} className='btn btn-primary'>Details</Link>
        </Card.Body>
      </Card>
    </>
  );
}