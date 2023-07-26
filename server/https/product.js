const express = require("express");
const productrequests = express.Router();
const cors = require("cors");
productrequests.use(cors());

const productConstants = require("./../functions/product");

productrequests.post("/addproductcard", async (req, res) => {
    var body = req.body
    try {
        body = JSON.parse(body)
    } catch (e) { }

    await productConstants.addProductCard(body, req.headers.authorization)
        .then((response) => {
            return res.send(response);
        })
        .catch((err) => {
            return res.send(err);
        })
});

productrequests.get("/fetchproductcards", async (req, res) => {
    await productConstants.fetchProductCards(req.headers.authorization)
        .then((response) => {
            return res.send(response);
        })
        .catch((err) => {
            return res.send(err);
        })
});

module.exports = productrequests;