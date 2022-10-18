import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';

export function Profile() {
  const [user, setUser] = useState({});

  const getUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/profile", { credentials: 'include' });
      const jsonData = await response.json();
      console.log(jsonData);
      setUser(jsonData.user);
    } catch (err) {
      console.error(err.message);
    }
  };

  const logout = async () => {
    try {

      const response = await fetch("http://localhost:3000/users/logout", {
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
    getUser();
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      <img src={user.img} />
      <p>{user.username}</p>
      <Button variant="danger" onClick={() => {logout()}}>Logout</Button>
    </div>
  );
}