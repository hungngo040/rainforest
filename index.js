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
const connectEnsureLogin = require('connect-ensure-login');
const bcrypt = require('bcrypt');
const port = 3000;
const Vendor = require('./model/Vendor');
const Shipper = require('./model/Shipper');
const Customer = require('./model/Customer');
const Product = require('./model/Product');
const Help = require('./model/Help');

const Cart = require('./model/Cart');
const Order = require('./model/Order');


const fs = require('fs');
require('dotenv').config();
const multer = require('multer');
app.set('view engine', 'ejs');


const session = require('express-session');
const { connect } = require('http2');


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

passport.use('vendorLocal', new LocalStrategy(Vendor.authenticate()));
passport.serializeUser(Vendor.serializeUser());
passport.deserializeUser(Vendor.deserializeUser());


passport.use('customerLocal', new LocalStrategy(Customer.authenticate()));
passport.serializeUser(Customer.serializeUser());
passport.deserializeUser(Customer.deserializeUser());

passport.use('shipperLocal', new LocalStrategy(Shipper.authenticate()));
passport.serializeUser(Shipper.serializeUser());
passport.deserializeUser(Shipper.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
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
const upload = multer({ storage: storage });



mongoose.connect('mongodb+srv://PhapNguyen:29122002pP@cluster0.odlrcvo.mongodb.net/rainforestDB?retryWrites=true&w=majority&appName=AtlasApp')
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.log(error.message));


app.use(express.urlencoded({ extended: true }));

//ROUTES

// Show the home page
app.get('/', connectEnsureLogin.ensureLoggedOut(), (req, res) => {
  res.render('index');
});

// Filter product
app.get('/filtered', (req, res) => {
  const { min, max } = req.query;

  Product.find({ price: { $gt: min, $lt: max } })
    .then((products) => {
      if (!products) {
        return res.send("Cannot found that product!");
      }
      res.render('customer', { products: products });
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



app.get('/register', connectEnsureLogin.ensureLoggedOut(), (req, res) => {
  res.render('register');
})

// Show create  vendor account form
app.get('/vendor-new', connectEnsureLogin.ensureLoggedOut(), (req, res) => {
  res.render('create-vendor-account')
});

// create new vendor account
app.post('/vendor-new', connectEnsureLogin.ensureLoggedOut(), (req, res) => {
  console.log(req.body);
  const vendor = new Vendor(req.body);
  vendor.save()
    .then(() => res.render('vendor'))
    .catch(error => res.send(error));
});

// Show create custoner account form
app.get('/customer-new', connectEnsureLogin.ensureLoggedOut(), (req, res) => {
  res.render('create-customer-account')
});


// create new customer account
app.post('/create-customer-account', (req, res) => {
  console.log(req.body);
  const customer = new Customer(req.body);
  customer.save()
    .then(() => {
      Product.find({}, (err, products) => {
        if (err) {
          console.log(err);
        } else {
          res.render('customer', { products: products })
        }
      })
    })
});

// customer page
app.get('/customer', connectEnsureLogin.ensureLoggedIn('/customer-login'), (req, res) => {
  Product.find({}, (err, products) => {
    if (err) {
      console.log(err);
    } else {
      res.render('customer', { products: products });
    }
  });
});

// Show create shipper account form
app.get('/shipper-new', (req, res) => {
  res.render('create-shipper-account')
});

// create new shipper account
app.post('/shipper', (req, res,) => {
  console.log(req.body);
  const shipper = new Shipper(req.body);
  shipper.save()
    .then(() => res.render('shipper'))
    .catch(error => send.send(error));
});

// For vendors to view their products
app.get('/vendor-view-products', (req, res) => {
  res.render('vendor-view-products');
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
  res.render("set-up-account");
});

// Login page
app.get("/login", function (req, res) {
  res.render("login");
});

// Customer login page
app.get("/customer-login", function (req, res) {
  res.render("customer-login");
});

// Shipper login page
app.get("/shipper-login", function (req, res) {
  res.render("shipper-login");
});

// Vendor login page
app.get("/vendor-login", function (req, res) {
  res.render("vendor-login");
});

//Handling vendor login
app.post("/vendor-login", async function (req, res) {
  try {
    const vendor = await Vendor.findOne({ username: req.body.username });
    if (vendor) {
      //check if password matches
      const result = await vendor.comparePassword(req.body.password)
      if (result) {
        res.render('vendor');
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "Account doesn't exist" });
    }
  }
  catch (error) {
    res.status(400).json({ error });
  }
});

//Handling customer login
app.post("/customer-login", async function (req, res) {
  try {
    const customer = await Customer.findOne({ username: req.body.username });
    if (customer) {
      //check if password matches
      const result = await customer.comparePassword(req.body.password)
      if (result) {
        Product.find().then((products) => {
          res.render('customer', { products: products });
        })
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "Account doesn't exist" });
    }
  }
  catch (error) {
    res.status(400).json({ error });
  }
});

//Handling shipper login
app.post("/shipper-login", async function (req, res) {
  try {
    const shipper = await Shipper.findOne({ username: req.body.username });
    if (shipper) {
      //check if password matches
      const result = await shipper.comparePassword(req.body.password)
      if (result) {
        res.render('shipper');
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "Account doesn't exist" });
    }
  }
  catch (error) {
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

// Vendor page
app.get('/vendor', (req, res) => {
  res.render('vendor')
});




// About page
app.get('/about', (req, res) => {
  res.render('about')
});

// Copyright page
app.get('/copyright', (req, res) => {
  res.render('copyright')
});

// Cart page
app.get('/cart', (req, res) => {
  res.render('cart')
});

// Privacy page
app.get('/privacy', (req, res) => {
  res.render('privacy')
});

// Help page
app.get('/help', (req, res) => {
  res.render('help')
});

// Handling help form
app.post('/help-submitted', (req, res) => {
  console.log(req.body);
  const help = new Help(req.body);
  help.save()
    .then(() => res.send('Thank you for summiting your query! We will get back to you soon.'))
    .catch(error => res.send(error));
})

// 404 page
app.get('*', (req, res) => {
  res.send('404! This page does not exist')
});

app.listen(port, function () {
  console.log(`Server started on: http://localhost:${port}`);
});



