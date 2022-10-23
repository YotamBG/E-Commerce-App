import { Link } from "react-router-dom";
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import { useEffect, useState } from "react";


export function Counter({ count, increase, decrease }) {
  return (
    <ButtonGroup aria-label="Basic example">
      <Button variant="secondary" style={{ height: '40px' }} onClick={() => { decrease() }}>-</Button>
      <div className='bg-secondary' style={{ height: '40px', lineHeight: '40px', color: 'white' }}>{count}</div>
      <Button variant="secondary" style={{ height: '40px' }} onClick={() => { increase() }}>+</Button>
    </ButtonGroup>
  );
}