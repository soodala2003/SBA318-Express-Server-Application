const express = require("express");
const router = express.Router();

//const users = require("../data/users");
const posts = require("../data/posts");
const error = require("../utilities/error");

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log("User Request Time: ", Date.now());
  next();
});

// define the base post page routes
// note that the base route "/" is actually
// "/posts/", because of the way the main app
// uses this router within index.js
router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "posts/:id",
        rel: ":id",
        type: "GET",
      },
    ];

    res.json({ posts, links });
  })
  .post((req, res) => {
    if (req.body.userId && req.body.title && req.body.content) {
      const post = {
        id: posts[posts.length - 1].id + 1,
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content,
      };

      posts.push(post);
      res.json(posts[posts.length - 1]);
    } else next(error(400, "Insufficient Data"));
    //res.json({ error: "Insufficient Data" });
    //next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);

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

    if (post) res.json({ post, links });
    else next();
  })
  .patch((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          posts[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  })
  .delete((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        posts.splice(i, 1);
        return true;
      }
    });

    if (post) res.json(post);
    else next();
});

router
  .route("/")
  .get((req, res, next) => {
    const userId = req.query.userId;

    if (userId) {
      let filteredPosts = posts.filter((u) => u.userId == userId);
      res.json(filteredPosts);
    } else {
      next();
    }  
});

module.exports = router;
