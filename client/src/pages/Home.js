import { Link } from "react-router-dom";

export function Home() {
  return (
    <div>
      <p>Home!</p>
      <Link to="register" className='btn btn-primary'>Register</Link>
      <br/>
      <br/>
      <Link to="login" className='btn btn-success'>Login</Link>
    </div>
  );
}