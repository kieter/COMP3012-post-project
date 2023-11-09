// @ts-nocheck
import express from "express";
import * as database from "../controller/postController";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";

router.get("/", async (req, res) => {
  const posts = await database.getPosts(20);
  const user = await req.user;
  res.render("posts", { posts, user });
});

router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("createPosts");
});

router.post("/create", ensureAuthenticated, async (req, res) => {
  //Get body data
  const { title, link, sub: subgroup, description } = req.body;
  //Get user data
  const user = await req.user;

  //Create Post
  const newPost = await database.addPost(
    title,
    link,
    user.id,
    description,
    subgroup
  );

  //Redirect to the new Post once created
  res.redirect(`show/${newPost.id}`);
});

router.get("/show/:postid", async (req, res) => {
  const post = await database.getPost(req.params.postid);

  //If not post found redirect to home
  if (!post) return res.redirect("/");

  res.render("individualPost", post);
});

router.get("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.post("/edit/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  // ⭐ TODO
});

router.post(
  "/comment-create/:postid",
  ensureAuthenticated,
  async (req, res) => {
    // ⭐ TODO
  }
);

export default router;
