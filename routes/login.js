const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("login");
    //next();
});

router.post("/", (req, res) => {
    res.send(`Success: Your username is ${req.body.username} and your password is ${req.body.password}!`);
    //next();
});

module.exports =router;