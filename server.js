const express = require('express');
const server = express();
const User = require('./models/users.js'); // Assuming you have a user model
const connectDB=require('./config/dbconnect');
server.use(express.json(), express.urlencoded({ extended: true }));
server.set('view engine','ejs');
server.set('views','./views');
connectDB();

// Define root route here:
server.get('/', (req, res) => {
  res.render('register');
});

//  Mount your user routes here:
const userRoutes = require('./routes/user.routes.js');
server.use('/users', userRoutes);

// THEN start listening:
server.listen(3000, () => console.log('Server running on http://localhost:3000'));
