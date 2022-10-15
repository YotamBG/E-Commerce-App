import logo from './logo.svg';
import './App.css';
import { } from 'react-bootstrap';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <nav>
          <Link to="/">home</Link> |{" "}
          <Link to="1">1</Link> |{" "}
          <Link to="2">2</Link>
        </nav>
        <Routes>
          <Route path="/" element={<p>home!</p>} />
          <Route path="1" element={<p>1</p>} />
          <Route path="2" element={<p>2</p>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
