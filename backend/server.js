const express =require('express');
const app=express();
const cors=require('cors');
const mongoose=require('mongoose')//staring time 8  complet with .env at 9 13am
require ('dotenv').config();
const Product = require("./models/Products");
const products = require("./routes/utils/seedProducts");
const path = require("path");



app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://denimstudio.netlify.app"
  ],
  credentials: true
}));


app.use(express.json({ limit: "10mb" })); // increase as needed
app.use(express.urlencoded({ limit: "10mb", extended: true }));
const passport = require('passport');
const session = require('express-session');

// Session middleware (Passport ke liye)
app.use(session({
    secret: 'keyboard cat', 
    resave: false,
    saveUninitialized: true
}));

// Passport initialize
app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Passport config
require('./config/passport'); // GoogleStrategy yahan rahegi

app.use('/api/auth',require('./routes/authR'));
//manageProducts admin
app.use('/api/products',require('./routes/manageProducts'));
app.use('/api/orders', require('./routes/orderR'));
app.use('/api/admin',require('./routes/adminR'));
app.use('/api/create-admin',require('./routes/createAdminR'));
app.use('/api/contact',require('./routes/ContactR'));

const PORT=process.env.PORT||5000;
const DATABASE_URL=process.env.DATABASE_URL;

app.get("/test-db", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB Test Failed" });
  }
});

mongoose.connect(DATABASE_URL)
.then(()=>console.log("connected to mogodb"))
.catch(err=>console.error("db connection failed"));


app.get("/", (req, res) => {
  res.send("Al-hassana Backend Running...");
});app.get("/seed", async (req, res) => {
  try {
    await Product.deleteMany(); // old products delete (optional)
    const createdProducts = await Product.insertMany(products);
    res.send({ message: "Products seeded successfully!", data: createdProducts });
  } catch (error) {
    res.status(500).send({ message: "Seeding failed", error });
  }
});
app.listen (PORT,'0.0.0.0',()=>{
    console.log(`SEver is Running on ${PORT}`);
})