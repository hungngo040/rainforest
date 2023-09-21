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
const passwordValidator = require('password-validator');
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));

mongoose.connect('mongodb+srv://PhapNguyen:29122002pP@cluster0.odlrcvo.mongodb.net/rainforestDB?retryWrites=true&w=majority&appName=AtlasApp')
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.log(error.message));



// Define schema


const VendorSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
    unique: true,
    maxlenght: 15,
    minlenght: 8,
    uppercase: true,
    lowercase:true,
    nonAlpha:true,
    number:true
  },
  password:{
    type: String,
    required: true,
  },
  profile_picture:{
    type: Number
  },
  Business_name:{
    type: String,
    required: true
  },
  Business_address:{
    type: String,
    required: true
  }
 
});


const CustomerSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true
  },
  profile_picture:{
    type: Number
  },
  name:{
    type: String,
    required: true
  },
  address:{
    type: String,
    required: true
  }

});

const ShipperSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true
  },
  profile_picture:{
    type: Number
  },
  assigned_distribution_hub:{
    type: String,
    enum: ['Hanoi','Danang','HoChiMinh']}

});

// Define a model based on the schema
const Vendor = mongoose.model('Vendor',VendorSchema);

const Customer = mongoose.model('Customer',CustomerSchema);

const Shipper = mongoose.model('Shipper', ShipperSchema);

app.use(express.urlencoded({extended: true}));


// Show the home page
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/register', (req, res) => {
  res.render('register');
})

// Show create  vendor account form
app.get('/vendor-new',(req,res)=>{
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
app.get('/customer-new',(req,res)=>{
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
app.get('/shipper-new',(req,res)=>{
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




app.listen(port, function () {
  console.log(`Server started on: http://localhost:${port}`);
});



