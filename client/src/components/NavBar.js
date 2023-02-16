import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from "react-router-dom";
import React, { Fragment } from 'react';

export function NavBar({ user }) {
  return (
    <Navbar bg="light" expand="lg" className='mb-4'>
      <Container>
        <Navbar.Brand href="/">E-Commerce App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end'>
          <Nav className="justify-content-end">
            <Link to="productList" className='nav-link'>Products</Link>
            {/* <Link to="productUpload" className='nav-link'>ProductUpload</Link> // for admin access*/}
            {user.user_id ?
              <React.Fragment><Link to="cart" className='nav-link'>Cart</Link>
                <Link to="ordersList" className='nav-link'>Orders</Link><Link to="profile" className='nav-link'>Profile</Link>
              </React.Fragment>
              :
              <React.Fragment>
                <Link to="login" className='nav-link'>Login</Link><Link to="register" className='nav-link'>Register</Link>
              </React.Fragment>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}