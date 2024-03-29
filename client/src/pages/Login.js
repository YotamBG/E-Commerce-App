import { Button, Container, Form } from 'react-bootstrap';
import React, { useState } from "react";
import { Link } from "react-router-dom";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitForm = async e => {
    e.preventDefault();
    console.log({ "username": username, "password": password });
    try {
      const body = { "username": username, "password": password };

      const response = await fetch(process.env.REACT_APP_SERVER_URL+"/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: 'include'
      });

      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div style={{ padding: '20px', paddingTop: 60, color: 'rgb(243, 189, 117)', textShadow: '0px 2px 2px rgb(0 0 0 / 80%)'}}>
      <h1 style={{ margin: '20px' }}>Login</h1>
      <Container style={{ width: '50%' }}>
        <Form onSubmit={onSubmitForm}>
          <Form.Group className="mb-3" controlId="formBasicUsername" value={username} onChange={e => setUsername(e.target.value)}>
            <Form.Label>Username</Form.Label>
            <Form.Control type="username" placeholder="Enter username" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword" value={password} onChange={e => setPassword(e.target.value)}>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        <br />
        <a href={`${process.env.REACT_APP_SERVER_URL}/auth/google`}>
          <img src='https://cdn-icons-png.flaticon.com/512/145/145804.png' style={{ width: '50px', margin: '20px', filter: 'drop-shadow(rgba(0, 0, 0, 0.5) 20px 20px 20px) grayscale(100%) invert(0%) sepia(47%) saturate(383%) hue-rotate(331deg)' }} />
        </a>
        <a href={`${process.env.REACT_APP_SERVER_URL}/auth/facebook`}>
          <img src='https://cdn-icons-png.flaticon.com/512/145/145802.png' style={{ width: '50px', margin: '20px', filter: 'drop-shadow(rgba(0, 0, 0, 0.5) 20px 20px 20px) grayscale(100%) invert(0%) sepia(47%) saturate(383%) hue-rotate(331deg)' }} />
        </a>
        <br /><br /><br />
        <Link to="/register" className='btn btn-success'>Register instead</Link>
      </Container>
    </div>
  );
}