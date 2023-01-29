const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const  path = require('path');

const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());
// app.use(express.static(`${__dirname}/public`));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 3) Routes
app.use('/api/v1/users', userRouter);

module.exports = app;
