if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const session = require('express-session');
const db = require('./utils/db');
const bodyParser = require('body-parser');
const passport = require('passport');
const initializePassport = require('./utils/passport-config');
var cors = require('cors');
var fileUpload = require('express-fileupload');
require("./utils/auth-config");


const app = express();
const port = process.env.PORT || 3000;
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: "secret"
}));
initializePassport(passport, db);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(fileUpload());
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "E-Commerce App",
      description: "This is an e-commerce application REST API",
      contact: {
        name: "Yotam Ben-Gera",
      },
      servers: ["/", process.env.SERVER_URL]
    }
  },
  apis: ["server.js", "./routers/*.js"]
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});

app.get('/', (req, res) => {
  res.status(200).send('Welcome to the e-commerce application!');
});


const users = require('./routers/users');
app.use('/users', users);
const products = require('./routers/products');
app.use('/products', products);
const cart = require('./routers/cart');
app.use('/cart', cart);
const orders = require('./routers/orders');
app.use('/orders', orders);
const auth = require('./routers/auth');
app.use('/auth', auth);



// // move to utils

// // const db = require('./utils/db');
// // const { getJson } = require('serpapi');
// // const cheerio = require('cheerio');
// // const { Configuration, OpenAIApi } = require("openai");

// const getPic = async (q, id) => {
//   //scrape google

//   // const response = await fetch(`https://www.google.com/search?q=${q.replace(/\s+/g, '+')}&tbm=isch&tbs=ic:trans`);
//   // console.log(`https://www.google.com/search?q=${q.replace(/\s+/g, '+')}&tbm=isch&tbs=ic:trans`);
//   // const body = await response.text();
//   // const $ = cheerio.load(body);
//   // const $img = $('img').map(function () { return $(this).attr('src'); });
//   // console.log($img[1]);
//   // return 0;

//   //serpapi

//   // const params = {
//   //   q: q,
//   //   tbm: "isch",
//   //   ijn: "0",
//   //   tbs: 'ic:trans',
//   //   api_key: "8a61e672000052f4e01da56a373fdebc2eae0a3504e36697d7ec3f35189b1a22"
//   // };
//   // const response = await getJson("google", params);
//   // const images = response["images_results"].map(product => product.original);
//   // console.log(images[0]);
//   // db.query('UPDATE products SET img=$1 WHERE product_id=$2;', [images[1], id], (err, result) => {
//   //   if (err) {
//   //     console.log(err);
//   //   }
//   //   console.log('ok!');
//   // })
// }

// const getImages = async () => {
//   const items = (await db.query(`
//     SELECT product_id, name,	price, img
//               FROM products
//               ORDER BY product_id;`)).rows;
//   console.log(items);
//   items.forEach(item => getPic(item.name, item.product_id))
// };

// getImages();
















  // try {
  //   const { Configuration, OpenAIApi } = require("openai");
  //   const configuration = new Configuration({
  //     apiKey: process.env.OPENAI_API_KEY,
  //   });
  //   const openai = new OpenAIApi(configuration);
  //   const response = await openai.createImage({ // subscribe with payment first
  //     prompt: "A cute baby sea otter",
  //     n: 2,
  //     size: "1024x1024",
  //   });

  //   const jsonData = response.data;
  //   console.log(jsonData);

  // } catch (err) {
  //   console.error(err.message);
  // }