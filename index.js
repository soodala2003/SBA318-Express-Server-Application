const express = require("express");
const bodyParser = require("body-parser");

// These are now route imports, not database imports!
const users = require("./routes/users");
const posts = require("./routes/posts");

const error = require("./utilities/error");

const app =express();
const port =3000;

// We use the body-parser middleware FIRST so that
// we have access to the parsed data within our routes.
// The parsed data will be located in "req.body".

// Parsing Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// New logging middleware to help us keep track of
// requests during testing!

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

// Valid API Keys.
apiKeys = ["perscholas", "ps-example", "hJAsknw-L198sAJD-l3kasx"];

// New middleware to check for API keys!
// Note that if the key is not verified,
// we do not call next(); this is the end.
// This is why we attached the /api/ prefix
// to our routing at the beginning!
app.use("/api", function (req, res, next) {
    var key = req.query["api-key"];

    // Check for the absence of a key.
    if (!key) next(error(400, "API Key Required"));

    // Check for key validity.
    if (apiKeys.indexOf(key) === -1) next(error(401, "Invalid API Key"));

    // Valid key! Store it in req.key for route access.
    req.key = key;
    next();
});

// Use our Routes
app.use("/api/users", users);
app.use("/api/posts", posts);

// Adding some HATEOAS links.
app.get("/", (req, res) => {
    res.json({
        links: [
            {
                href: "/api",
                rel: "api",
                type: "GET",
            },
        ],
    });
});

// Adding some HATEOAS links.
app.get("/api", (req, res) => {
    res.json({
        links: [
            {
                href: "api/users",
                rel: "users",
                type: "GET",
            },
            {
                href: "api/users",
                rel: "users",
                type: "POST",
            },
            {
                href: "api/posts",
                rel: "posts",
                type: "GET",
            },
            {
                href: "api/posts",
                rel: "posts",
                type: "POST",
            },
        ],
    });
});

// Custom 404 (not found) middleware.
// Since we place this last, it will only process
// if no other routes have already sent a response!
// We also don't need next(), since this is the
// last stop along the request-response cycle.

// 404 Middleware
app.use((req, res) => {
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