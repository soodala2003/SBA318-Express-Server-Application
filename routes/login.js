const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("login");
});

router.post("/", (req, res) => {
    res.send(`Success: Your username is ${req.body.username}.`);
});

module.exports =router;