// const { ensureAuthenticated } = require("../middleware/checkAuth");
import express from "express";
import * as database from "../controller/postController";
const router = express.Router();
import { getSubs } from "../fake-db";

router.get("/list", async (req, res) => {
  // ⭐ TODO
  const posts = await database.getPosts();
  const AlphaOrderSubGroup = getSubs().sort((a, b) => {
    if (a > b) {
      return 1;
    } else {
      return -1;
    }
  });
  res.render("subs", { AlphaOrderSubGroup, posts, user: req.user });
});

router.get("/show/:subname", async (req, res) => {
  // ⭐ TODO

  const subname = req.params.subname;
  const posts = await database.getPosts();
  const filteredSubgroup = Object.values(posts).filter(
    (post) => post.subgroup === subname,
  );
  const TimeOrderSub = filteredSubgroup.sort((a, b) => {
    return b.timestamp - a.timestamp;
  });
  res.render("sub", { subname, TimeOrderSub, user: req.user });
});

export default router;
