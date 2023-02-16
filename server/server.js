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
  origin: "http://localhost:3001",
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
      servers: ["/", "http://localhost:3000/"]
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