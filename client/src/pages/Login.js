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

      const response = await fetch("http://localhost:3000/users/login", {
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
    <div style={{ padding: '20px' }}>
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
          <img src='https://cdn-icons-png.flaticon.com/512/145/145804.png' style={{ width: '50px', margin: '20px' }}/>
          <img src='https://cdn-icons-png.flaticon.com/512/145/145802.png' style={{ width: '50px', margin: '20px' }}/>
        <br /><br /><br />
        <Link to="/register" className='btn btn-success'>Register instead</Link>
      </Container>
    </div>
  );
}