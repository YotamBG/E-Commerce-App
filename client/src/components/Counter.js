import { Link } from "react-router-dom";
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import { useEffect, useState } from "react";


export function Counter({ count, increase, decrease }) {
  return (
    <Link style={{textDecoration: 'none'}}>
      <ButtonGroup aria-label="Basic example">
        <Button style={{ height: '40px' }} onClick={() => { decrease() }}>-</Button>
        <div style={{ height: '40px', lineHeight: '40px', color: 'rgb(243, 189, 117)', backgroundColor: '#362020' }}>{count}</div>
        <Button style={{ height: '40px' }} onClick={() => { increase() }}>+</Button>
      </ButtonGroup>
    </Link>
  );
}