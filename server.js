const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
var xss = require("xss-clean");
const path = require("path");
const morgan = require("morgan");
const { fileParser } = require('express-multipart-file-parser');
require("dotenv").config();
const app = express();

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileParser({
    rawBodyOptions: {
      limit: '30mb', //file size limit
    },
    busboyOptions: {
      limits: {
        fields: 50, //Number text fields allowed
      },
    },
  })
);


app.use(cors());
app.options("*", cors());

app.use(helmet());
app.use(xss());
app.use(morgan("tiny"));

const db = require("./app/models");

db.mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

require("./app/routes/auth.routes")(app);


const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
