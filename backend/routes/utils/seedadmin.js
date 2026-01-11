// in a file called seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../../models/User');
require('dotenv').config();
 const email=process.env.adminEmail;
 const password=process.env.password;
mongoose.connect(process.env.DATABASE_URL)
  .then(async () => {
    const existingAdmin = await User.findOne({ email});
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit();
    }

    const hashedPassword =await bcrypt.hash(password, 10);
    await User.create({
      name: 'Admin',
      email: email,
      password:hashedPassword,
      phone:"03174099648",
      address:"house num 108 sector d2 nill 3 green toen lahore",
      userType: 'admin'
    });
console.log(`Admin created successfully with email: ${email}`);

    process.exit();
  });
