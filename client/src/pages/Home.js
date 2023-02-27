import { Link } from "react-router-dom";
import { Button, Container, Form } from 'react-bootstrap';
import { useEffect, useState } from "react";

export function Home({ user }) {
  const [btnUrl, setBtnUrl] = useState({ url: '/register', name: 'Register' });

  useEffect(() => {
    if (user.username) {
        setBtnUrl({ url: '/productList', name: 'Our products' });
    }
  }, [user]);

  return (
    <div className="Home" style={{ color: '#362020', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', paddingTop: 60 }}>
      <div style={{ position: 'absolute', top: 230, left: (window.innerWidth > 480 ? 400 : 20), textAlign: 'left', width: (window.innerWidth > 480 ? 380 : 350) }}>
        <p>Welcome to our</p>
        <h1>Online grocery store</h1>
        <br />
        <p>
          We believe that eating healthy should be convenient for everyone.
        </p>
        <p>
          We offer a wide range of fresh foods for those who want to maintain a healthy lifestyle.
        </p>
        <br />
        <Link className='btn mybtn' to={btnUrl.url} style={{ backgroundColor: '#362020', color: '#f3bd75', border: 'none', borderRadius: 25, height: 50, width: 200 }}>
          <p>{btnUrl.name}</p>
        </Link>
      </div>

      <div style={{ position: 'absolute', top: 730, left: (window.innerWidth > 480 ? 900 : 20), textAlign: 'left', width: (window.innerWidth > 480 ? 380 : 350) }}>
        <p>About this project</p>
        <h1>PERN app</h1>
        <br />
        <p>
          I created this app using PostgreSQL, Express, React and Node.js
        </p>
        <p>
          The names and descriptions of the products were written by ChatGPt and the backgrounds were drawn by Midjourney.
        </p>
        <br />
        <Link className='btn mybtn' to='//github.com/YotamBG' style={{ backgroundColor: '#362020', color: '#f3bd75', border: 'none', borderRadius: 25, height: 50, width: 200 }}>
          <p>My Github</p>
        </Link>
      </div>
      <div style={{ height: '1000px' }}></div>
    </div>
  );
}