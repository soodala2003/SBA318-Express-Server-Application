const express = require("express");
const router = express.Router(); // Single routing

const users = require("../data/users");
const posts = require("../data/posts");
const comments = require("../data/comments");
const error = require("../utilities/error");

// middleware that is specific to this router
/* router.use((req, res, next) => {
  console.log("User Request Time: ", Date.now());
  next();
});  */

// define the base user page routes
// note that the base route "/" is actually
// "/api/users/", because of the way the main app
// uses this router within index.js

// the base paths defined in index.js.
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
  
    //if (users) 
    res.json({ users, links });
    //else next();
    
  })
  .post((req, res, next) => {
    if (req.body.name && req.body.username && req.body.email) {
      if (users.find((u) => u.username == req.body.username)) {
        //res.json({ error: "Username Already Taken" });
        //return;
        next(error(409, "Username Already Taken"));
      }

      const user = {
        id: users[users.length - 1].id + 1,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
      };

      users.push(user);
      res.json(users[users.length - 1]);
    } else next(error(400, "Insufficient Data"));
    //res.json({ error: "Insufficient Data" });
    //next(error(400, "Insufficient Data"));
    
});

router
  .route("/:id")
  .get((req, res, next) => {
    const userId = `/${req.params.id}`;
    const user = users.find((u) => u.id == req.params.id);
    //console.log(res.json({useruser}));
    //const name = users.name;

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

    if (user) res.json({ user, links });
    //if (user) res.render("users", {href: userId});
    else next();
  })
  .patch((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        for (const key in req.body) {
          users[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  })
  .delete((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        users.splice(i, 1);
        return true;
      }
    });

    if (user) res.json(user);
    else next();
});

/* router
  .route("/:id/posts")
  .get((req, res, next) => {
    //const userId = users.find((u) => u.id == req.params.id);
    const userId = posts.find((u) => u.userId == req.params.id);

    if (userId) {
      let filteredPosts = posts.filter((u) => u.userId === userId);
      res.json(filteredPosts);
    } else {
      next();
    }
}); */

/*router
  .route("/:id/comments")
  .get((req, res, next) => {
    const userId = users.find((u) => u.id == req.params.id);
    const postId =  req.query.postId;
    
    if (postId) {
      let filteredComments = comments.filter((u) => u.postId === postId);
      res.json(filteredComments);
    } else {
      next();
    } 
}); */

module.exports = router;
