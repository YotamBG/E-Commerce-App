import { useEffect, useState } from "react";
import { Product } from '../components/Product';
import { Link } from "react-router-dom";
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
console.log(Parallax);

export function ProductList() {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/products`, { credentials: 'include' });
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
      {(products.length == 0 ? <><br /><p>Loading...</p></> : <> {/* build loader */}
        <Parallax pages={1} style={{ top: '0', left: '0' }} class="animation">

          <ParallaxLayer offset={0.4} speed={0.6} style={{ filter: 'brightness(80%)', height: '100%', width: '100%' }}>
            <div class="animation_layer parallax" style={{backgroundImage: 'url(/pls/0.webp)'}}></div>
          </ParallaxLayer>
          
          <ParallaxLayer offset={0} speed={0} style={{ height: '100%', width: '100%' }}>
            <div class="animation_layer parallax" style={{backgroundImage: 'url(/pls/1.webp)'}}></div>
          </ParallaxLayer>
          
          <ParallaxLayer offset={0.5} speed={0.2} style={{ height: '100%', width: '100%' }}>
            <div class="animation_layer parallax" style={{backgroundImage: 'url(/pls/2.webp)'}}></div>
          </ParallaxLayer>
          
          <ParallaxLayer offset={0.5} speed={0.4} style={{ height: '100%', width: '100%' }}>
            <div class="animation_layer parallax" style={{backgroundImage: 'url(/pls/3.webp)'}}></div>
          </ParallaxLayer>
          
          <ParallaxLayer offset={0.7} speed={0.6} style={{ height: '100%', width: '100%' }}>
            <div class="animation_layer parallax" style={{backgroundImage: 'url(/pls/4.webp)'}}></div>
          </ParallaxLayer>

          <ParallaxLayer offset={0} speed={0}>
            <div style={{ paddingTop: 100, position: 'absolute', zIndex: 2 }}>
              <div style={{ color: '#362020' }}>
                <h1>Our Products</h1>
                <br />
                <p>
                  Our products are carefully selected from local farms and producers, ensuring that we offer only the freshest and most nutritious options.
                </p>
                <p>
                  From fresh fruits and vegetables to organic grains and legumes, our store has everything you need to stock your pantry and prepare healthy meals.
                </p>
                <br />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${window.innerWidth > 480 ? 4 : 1}, 1fr)`, gridAutoRows: '400px', gap: 50, paddingTop: 70 }}>
                {products.map((product, i) => <div className="fade container" style={{ width: '100%', padding: 0 }}>
                  <Product details={product} id={i} key={i} />
                  <Link to={`/productDetails/${product.product_id}`} style={{ color: 'white', textDecoration: 'none', height: '100%', width: '100%' }}>
                    <div className="fade overlay">
                      <div className="fade text">
                        <h3>{product.name}</h3>
                        <br />
                        <p>{product.description}</p>
                      </div>
                    </div>
                  </Link>
                </div>)}
              </div>
            </div >
          </ParallaxLayer>
        </Parallax>
      </>)}
    </div>
  );
}

/*
{
  "product_id": 0,
  "name": "string",
  "price": 0,
  "category": "string"
  description?
  img?
}
*/