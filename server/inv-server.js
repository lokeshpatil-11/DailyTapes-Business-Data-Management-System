const express = require("express");
const cors = require("cors"); //cross origin resource sharing
const bodyParser = require("body-parser"); //extract data from body of an http request
const app = express();
const port = 5001;

try {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const authrequests = require("./https/auth")
  const productrequests = require("./https/product")
  app.use('/authrequest', authrequests);  //register
  app.use('/productrequest', productrequests)
  app.listen(port, () => {
    console.log("Server is running on port: " + port);
  });
} catch (error) {
  console.error(error);
}
