import { useEffect, useState } from "react";
import { Product } from '../components/Product';

export function ProductList() {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const response = await fetch(`http://localhost:3000/products/`, { credentials: 'include' });
      const jsonData = await response.json();
      console.log(jsonData);
      setProducts(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px', padding: '20px'}}>
        {products.map((product, i) => <Product details={product} id={i} key={i} />)}
      </div>
    </div >
  );
}