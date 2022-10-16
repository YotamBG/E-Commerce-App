import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';

export function Profile() {
  const [username, setUsername] = useState('');

  const getUsername = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/profile", { credentials: 'include' });
      const jsonData = await response.json();
      console.log(jsonData);
      setUsername(jsonData.message);
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
    getUsername();
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      <p>{username}</p>
      {/* <Link to="/" className='btn btn-danger' onClick={()=>{logout()}}>Logout</Link> */}
      <Button variant="danger" onClick={() => {logout()}}>Logout</Button>
    </div>
  );
}