const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

// These are now route imports, not database imports!
const users = require("./routes/users");
const posts = require("./routes/posts");
const comments = require("./routes/comments");
const login = require("./routes/login");
const error = require("./utilities/error");

// Parsing Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug"); // register the template engine
app.set("views", path.join(__dirname, "views")); // specify the views path

// Use our Routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/comments", comments);
app.use("/api/login", login);

// Logging Middlewaare
app.use((req, res, next) => {
    const time = new Date();
  
    console.log(
      `-----
  ${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
    );
    if (Object.keys(req.body).length > 0) {
      console.log("Containing the data:");
      console.log(`${JSON.stringify(req.body)}`);
    }
    next();
}); 

app.get("/", (req, res) => {
    res.render("home");
}); 

// Adding some HATEOAS links.
app.get("/api", (req, res) => {
    res.render("users");
}); 

// 404 Middleware
app.use((req, res) => {
    res.status(404);
    next(error(404, "Resource Not Found"));
});  

// Error-handling middleware.
// Any call to next() that includes an
// Error() will skip regular middleware and
// only be processed by error-handling middleware.
// This changes our error handling throughout the application,
// but allows us to change the processing of ALL errors
// at once in a single location, which is important for
// scalability and maintainability.
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err.message });
});

app.listen(port, () => {
    console.log(`Server listening on port: ${port}.`);
});