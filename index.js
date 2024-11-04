const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

// These are now route imports, not database imports!
const users = require("./routes/users");
const posts = require("./routes/posts");
const login = require("./routes/login");
const error = require("./utilities/error");

// Parsing Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// serve static files from the public directory
//app.use(express.static("./public"));
app.use("/static", express.static(path.join(__dirname, "public")));

app.set("view engine", "pug"); // register the template engine
app.set("views", path.join(__dirname, "views")); // specify the views path

// We use the body-parser middleware FIRST so that
// we have access to the parsed data within our routes.
// The parsed data will be located in "req.body".

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

// Use our Routes
app.use("/users", users);
app.use("/posts", posts);
app.use("/login", login);


//app.use("/static", express.static("./public"));

app.get("/", (req, res) => {
    res.render("home");
}); 

// Adding some HATEOAS links.
/* app.get("/", (req, res) => {
    res.json({
        links: [
            {
                href: "/users",
                rel: "users",
                type: "GET",
            },
            {
                href: "/users",
                rel: "users",
                type: "POST",
            },
            {
                href: "/posts",
                rel: "posts",
                type: "GET",
            },
            {
                href: "/posts",
                rel: "posts",
                type: "POST",
            },
        ],
    });
}); */

// Custom 404 (not found) middleware.
// Since we place this last, it will only process
// if no other routes have already sent a response!
// We also don't need next(), since this is the
// last stop along the request-response cycle.

// 404 Middleware
app.use((req, res) => {
    res.status(404);
    //res.json({ error: "Resource Not Found" });
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