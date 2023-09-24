/*
RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023B
Assessment: Assignment 3
Author: Group 21
*/

const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const LocalStrategy = require("passport-local");
const passport = require('passport');
const passportLocalMongoose = require("passport-local-mongoose");
const bcrypt = require('bcrypt');
const port = 3000;
const Vendor = require('./model/Vendor');
const Shipper = require('./model/Shipper');
const Customer = require('./model/Customer');
const Product = require('./model/Product');

const Cart = require('./model/Cart');
const Order = require('./model/Order');


const fs = require('fs');
require('dotenv').config();
const multer = require('multer');
app.set('view engine', 'ejs');

const session = require('express-session');


app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));



app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(session({
  secret: "Rusty is a dog",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Vendor.authenticate()));
passport.serializeUser(Vendor.serializeUser());
passport.deserializeUser(Vendor.deserializeUser());



mongoose.connect('mongodb+srv://PhapNguyen:29122002pP@cluster0.odlrcvo.mongodb.net/rainforestDB?retryWrites=true&w=majority&appName=AtlasApp')
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.log(error.message));


app.use(express.urlencoded({ extended: true }));

//ROUTES

// Show the home page
app.get('/', (req, res) => {
  Product.find()
    .then((products) => {
      res.render('index', { products: products });
    })
    .catch((error) => console.log(error.message));
});
// Filter product
app.get('/filtered', (req, res) => {
  const { min, max } = req.query;

  Product.find({ price: { $gt: min, $lt: max } })
    .then((products) => {
      if (!products) {
        return res.send("Cannot found that product!");
      }
      res.render('index', { products: products });
    })
    .catch((error) => res.send(error));
});
// Search product
app.get('/search', (req, res) => {
  const { search } = req.query;

  Product.find({ name: search })
    .then((products) => {
      if (!products) {
        return res.send("Sorry, we could not find that product!");
      }
      res.render('index', { products: products });
    })
    .catch((error) => res.send(error));
});

// view product
app.get('/view-product/:id', (req, res) => {
  Product.findById(req.params.id)
    .then((product) => {
      if (!product) {
        return res.send("Cannot found that ID!");
      }
      res.render('view-product', { product: product });
    })
    .catch((error) => res.send(error));
});



app.get('/register', (req, res) => {
  res.render('register');
})

// Show create  vendor account form
app.get('/vendor-new', (req, res) => {
  res.render('create-vendor-account')
});

// create new vendor account
app.post('/vendor', (req, res) => {
  console.log(req.body);
  const vendor = new Vendor(req.body);
  vendor.save()
    .then(() => res.render('create-account-successful'))
    .catch(error => res.send(error));
});

// Show create custoner account form
app.get('/customer-new', (req, res) => {
  res.render('create-customer-account')
});

// create new customer account
app.post('/customer', (req, res) => {
  console.log(req.body);
  const customer = new Customer(req.body);
  customer.save()
    .then(() => res.render('create-account-successful'))
    .catch(error => res.send(error));
});


// Show create shipper account form
app.get('/shipper-new', (req, res) => {
  res.render('create-shipper-account')
});

// create new shipper account
app.post('/shipper',(req, res,) => {
  console.log(req.body);
  const shipper = new Shipper(req.body);
  shipper.save()
    .then(() => res.render('create-account-successful'))
    .catch(error => send.send(error));
});

// For vendors to view their products
app.get('/vendor-view-products', (req, res) => {
  res.render('vendor-view-products')
});

// For vendors to add new products
app.get('/vendor-add-products', (req, res) => {
  res.render('vendor-add-products')
});

// add new product
app.post('/product', (req, res) => {
  console.log(req.body);
  const product = new Product(req.body);
  product.save()
    .then(() => res.send('Save product successfully'))
    .catch(error => res.send(error));
});

// Showing secret page
app.get("/register", isLoggedIn, function (req, res) {
  es.render("set-up-account");
});

//Showing login form
app.get("/login", function (req, res) {
  res.render("login");
});

//Handling user login

app.post("/login", async function (req, res) {
  try {
    // check if the user exists
    const vendor = await Vendor.findOne({ username: req.body.username });
    const shipper = await Shipper.findOne({ username: req.body.username });
    const customer = await Customer.findOne({ username: req.body.username });
    if (vendor) {
      //check if password matches
      const result = await vendor.comparePassword(req.body.password)
      if (result) {
        res.render("vendor");
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    }
    if (shipper) {
      //check if password matches
      const result = await shipper.comparePassword(req.body.password)
      if (result) {
        res.render('shipper');
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    }
    if (customer) {
      //check if password matches
      const result = await customer.comparePassword(req.body.password)
      if (result) {
        res.render("customer");
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});


//Handling user logout 
app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

app.get('/shipper', (req, res) => {
  res.render('shipper')
});

// Shipper order detail page
app.get('/shipper-order-detail', (req, res) => {
  res.render('shipper-order-detail')
});


// save image on mongoDb Atlas
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
  }
});



// Cart page
app.get('/cart', (req, res) => {
  res.render('cart')
});



// 404 page
app.get('*', (req, res) => {
  res.send('404! This page does not exist')
});

app.listen(port, function () {
  console.log(`Server started on: http://localhost:${port}`);
});



