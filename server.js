const express = require('express');
const server = express();
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/dbconnect');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

// Middleware

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(morgan('dev'));
server.use(cookieParser());

// View engine setup
server.set('view engine', 'ejs');
server.set('views', './views');

// Connect to MongoDB
connectDB();

// Routes
server.get('/', (req, res) => {
  res.render('register'); // default register page
});

const userRoutes = require('./routes/user.routes');
server.use('/users', userRoutes);

server.use((req, res) => {
  res.status(404).render('404'); // create views/404.ejs for a better user experience
});


// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
