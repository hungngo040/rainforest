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
const User = require("./model/User");
app.set('view engine', 'ejs');



app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
  secret: "Rusty is a dog",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
  
mongoose.connect('mongodb+srv://PhapNguyen:29122002pP@cluster0.odlrcvo.mongodb.net/rainforestDB?retryWrites=true&w=majority&appName=AtlasApp')
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.log(error.message));



// Define schema

const VendorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: { unique: true },
    maxlength: 15,
    minlength: 8,
    validate: {
      validator: function(value) {
        return /^[a-zA-Z0-9]+$/.test(value);
      },
      message: 'The password must contain only letters (lowercase and uppercase) and digits.'
    },
  },
  password:{
    type: String,
    validate: {
      validator: function(value) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;
        return regex.test(value);
      },
      message: 'The Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
    },
    required: true
    },
  
  Business_name: {
    type: String,
    required: true
  },
  Business_address: {
    type: String,
    required: true
  },
  profile_picture:{
    type: Buffer, // Use the Buffer type to store binary data
    required: true
  }




});

const CustomerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: { unique: true }
  },
  password:{
    type: String,
    validate: {
      validator: function(value) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;
        return regex.test(value);
      },
      message: 'The password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
    },
    required: true
    },
  profile_picture: {
    type: Number
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  }

});

const ShipperSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: { unique: true }
  },
  password:{
    type: String,
    validate: {
      validator: function(value) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;
        return regex.test(value);
      },
      message: 'The password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
    },
    required: true
    },
  profile_picture: {
    type: Number
  },
  assigned_distribution_hub: {
    type: String,
    enum: ['Hanoi', 'Danang', 'HoChiMinh']
  }

});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 20,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  description: {
    type: String,
    required: true,
    maxLength: 500,
  },
  category: {
    enum: ['Smartphone','Laptop','Acessories']
  }
});

// Define a model based on the schema
const Vendor = mongoose.model('Vendor', VendorSchema);

const Customer = mongoose.model('Customer', CustomerSchema);

const Shipper = mongoose.model('Shipper', ShipperSchema);

const Product = mongoose.model('Product', ProductSchema);

app.use(express.urlencoded({ extended: true }));



// Show the home page
app.get('/', (req, res) => {
  res.render('index');
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
    .then(() => res.send('Create account successful'))
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
    .then(() => res.send('Create account successful'))
    .catch(error => res.send(error));
});


// Show create shipper account form
app.get('/shipper-new', (req, res) => {
  res.render('create-shipper-account')
});

// create new customer account
app.post('/shipper', (req, res) => {
  console.log(req.body);
  const shipper = new Shipper(req.body);
  shipper.save()
    .then(() => res.send('Create account successful'))
    .catch(error => res.send(error));
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
app.get("/register", isLoggedIn, function(req, res) {
  es.render("set-up-account");
});
// Handling user signup
app.post("/register", async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    password: req.body.password
  });
  return res.render('set-up-account')
});
//Showing login form
app.get("/login", function (req, res) {
  res.render("login");
});

//Handling user login
app.post("/login", async function(req, res){
  try {
      // check if the user exists
      const user = await User.findOne({ username: req.body.username });
      if (user) {
        //check if password matches
        const result = req.body.password === user.password;
        if (result) {
          res.render("my-account");
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
  req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}





app.listen(port, function () {
  console.log(`Server started on: http://localhost:${port}`);
});



