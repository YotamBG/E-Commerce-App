import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from "react-router-dom";

export function NavBar() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">E-Commerce App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end'>
          <Nav className="justify-content-end">
            <Link to="products" className='nav-link'>Products</Link>
            <Link to="cart" className='nav-link'>Cart</Link>
            <Link to="profile" className='nav-link'>Profile</Link>
            <Link to="orders" className='nav-link'>Orders</Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}