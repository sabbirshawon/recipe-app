const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");

const userRoutes = require("./api/routes/users");
const recipeRoutes = require("./api/routes/recipes");

require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(fileUpload());

mongoose.set("useCreateIndex", true);
mongoose.connect(
  `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@ds015774.mlab.com:15774/recipe-app`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
mongoose.set("useFindAndModify", false);

app.use("/users", userRoutes);
app.use("/recipes", recipeRoutes);

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

app.listen(process.env.port || 4000);
