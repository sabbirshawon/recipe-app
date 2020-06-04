const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const db = require('./databases');
const userRoutes = require("./routings/users");
const recipeRoutes = require("./routings/recipes");

// enabling .env
require("dotenv").config();

// making an instance of express
const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(fileUpload());

// grouping routes
app.use("/users", userRoutes);
app.use("/recipes", recipeRoutes);

// calling db connection
db.makeDb();

// checking any error request
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

// listening the port
app.listen(process.env.port || 5000);
