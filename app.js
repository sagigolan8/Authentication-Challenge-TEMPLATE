require('dotenv').config()
const express = require("express")
const app = express()
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const morgan = require("morgan");
const morganHandler = require("./middlewares/morgan");
const userRouter = require('./routers/userRouter')
const apiRouter = require('./routers/apiRouter')
const { unknownEndpoint, errorHandler } = require('./middlewares/errorHandler');
const USERS = require('./usersDB/users')
const INFORMATION = []
const REFRESHTOKENS = []

app.use(express.json());
app.use(
  morganHandler,
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);


app.use('/users',userRouter)
app.use('/api',apiRouter)


app.use(unknownEndpoint);

app.use(errorHandler);

module.exports = app;
