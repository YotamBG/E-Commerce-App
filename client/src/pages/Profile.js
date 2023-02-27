import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';

export function Profile({ user }) {
  const logout = async () => {
    try {

      const response = await fetch(process.env.REACT_APP_SERVER_URL+"/users/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include'
      });

      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (!user.username) {
      console.log('gotcha!');
      window.location = "/login";
    }
  }, []);

  return (
    <div style={{ paddingTop: 60 }}>
      <h1 style={{ color: 'rgb(243, 189, 117)', textShadow: '0px 2px 2px rgb(0 0 0 / 80%)' }}>Profile</h1>
      <img src={user.img} style={{ width: (window.innerWidth > 480 ? '20%' : '80%'), boxShadow: '0px 15px 15px' }} />
      <br />
      <br />
      <p style={{ color: 'rgb(243, 189, 117)', textShadow: '0px 2px 2px rgb(0 0 0 / 80%)' }}>{user.username}</p>
      <Button variant="danger" onClick={() => { logout() }}>Logout</Button>
    </div>
  );
}