import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from "react-router-dom";
import React, { Fragment, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

export function NavBar({ user, currentPage }) {
  return (
    <Navbar /*bg="light"*/ collapseOnSelect={true} expand="lg" style={{ height: (window.innerWidth > 480 ? 60 : 90), padding: '30px 0px 25px 0px', borderRadius: '0px 0px 30px 30px', marginBottom: -10, backgroundColor: 'white', zIndex: 1 }}>
      <Container /*style={{position: 'absolute', left: 3, top: 5}}*/ >
        <Navbar.Brand href="/" ><h4 style={{ fontFamily: "Times New Roman", fontWeight: 'bold' }}>Healthy Harvest</h4></Navbar.Brand> {/* make font global */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end' style={{backgroundColor: 'white', borderRadius: 10}}>
          <Nav className="justify-content-end">
            <Nav.Link href='/productList' to="productList" className='nav-link'>Products</Nav.Link>
            {/* <NavLink to="productUpload" className='nav-link'>ProductUpload</NavLink> // for admin access*/}
            {user.username ?
              <React.Fragment><Nav.Link href='/cart' to="cart" className='nav-link'>Cart</Nav.Link>
                <Nav.Link href='/ordersList' to="ordersList" className='nav-link'>Orders</Nav.Link><Nav.Link href='/profile' to="profile" className='nav-link'>Profile</Nav.Link>
              </React.Fragment>
              :
              <React.Fragment>
                <Nav.Link href='/login' to="login" className='nav-link'>Login</Nav.Link><Nav.Link href='/register' to="register" className='nav-link'>Register</Nav.Link>
              </React.Fragment>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}