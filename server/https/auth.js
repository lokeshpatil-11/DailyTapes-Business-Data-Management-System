const express = require("express");
const authrequests = express.Router();
const cors = require("cors");
authrequests.use(cors());

const authConstants = require("./../functions/auth");

authrequests.post("/register", async (req, res) => {
  var body = req.body
  try {
    body = JSON.parse(body)
  } catch (e) { }

  await authConstants.register(body)
    .then((response) => {
      return res.send(response);
    })
    .catch((err) => {
      return res.send(err);
    })
});

authrequests.post("/login", async (req, res) => {
  var body = req.body
  try {
    body = JSON.parse(body)
  } catch (e) { }

  await authConstants.login(body)
    .then((response) => {
      return res.send(response);
    })
    .catch((err) => {
      return res.send(err);
    })
});

authrequests.get("/verifyauthsession", async (req, res) => {
  await authConstants.verifyAuthSession(req.headers.authorization)
    .then((response) => {
      return res.send(response);
    })
    .catch((err) => {
      return res.send(err);
    })
});
module.exports = authrequests;
