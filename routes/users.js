const express = require("express");
const router = express.Router(); // Single routing

const users = require("../data/users");
const posts = require("../data/posts");
const comments = require("../data/comments");
const error = require("../utilities/error");

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log("User Request Time: ", Date.now());
  next();
}); 

// the base route "/" is actually "/api/users/"
router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "users/:id",
        rel: ":id",
        type: "GET",
      },
    ];
    res.render("getUser", { users: users, links: links });
});

router
  .route("/")
  .post((req, res, next) => {
    if (req.body.name && req.body.username && req.body.email) {
      if (users.find((u) => u.username == req.body.username)) {
        next(error(409, "Username Already Taken"));
      }

      const user = {
        id: users[users.length - 1].id + 1,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
      };

      users.push(user);
      res.render("getUser", { users: users });
    } else next(error(400, "Insufficient Data"));
});

router
  .route("/:id")
  .get((req, res, next) => {
    const user = users.find((u) => u.id == req.params.id);

    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];

    if (user) res.render("getUserId", {user: user, id: req.params.id, links: links });
    else next();
});

router
  .route("/:id")
  .patch((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        for (const key in req.body) {
          users[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (user) res.render("getUserId", {user: user, id: req.params.id });
    else next();
});

router
  .route("/:id")
  .delete((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        users.splice(i, 1);
        return true;
      }
    });

    if (user) res.render("getUser", { users: users });
    else next();
});

// Retrieves all posts by a user with the specified id.
router
  .route("/:id/posts")
  .get((req, res, next) => {
    const post = posts.filter((p) => p.userId == req.params.id);

    if (post) res.json(post);
    else next();
}); 

// Retrieves comments made by the user with the specified id.
router
  .route("/:id/comments")
  .get((req, res, next) => {
    const comment = comments.filter((c) => c.userId == req.params.id);
    
    if (comment) res.json(comment);
    else next();
}); 

module.exports = router;
