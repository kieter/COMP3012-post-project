// @ts-nocheck
import express from "express";
import * as database from "../controller/postController";
const router = express.Router();
<<<<<<< HEAD
import { getUser } from "../fake-db";
import {ensureAuthenticated, ensureAuthenticatedAsUserId} from "../middleware/checkAuth";
=======
import {
  ensureAuthenticated,
  ensureAuthenticatedAsUserId,
} from "../middleware/checkAuth";
>>>>>>> 26e7c3294f3372f28406313eb2a5a37be9e2cea9
import { getPost, editPost, deletePost } from "../controller/postController";


router.get("/", async (req, res) => {
  const posts = await database.getPosts(20);
  const user =  req.user;
  res.render("posts", { posts, user, getUser });
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
  const user = await req.user;

  //If not post found redirect to home
  if (!post) {
    return res.render("404NotFound");
  }

  const data = {
    post,
    user,
  };

  res.render("individualPost", data);
});

router.get("/edit/:postid", ensureAuthenticatedAsUserId, async (req, res) => {
  const post = await getPost(req.params.postid);
  res.render("editPost", { post });
});

router.post("/edit/:postid", ensureAuthenticated, async (req, res) => {
  try {
    const { title, link, description } = req.body;
    const postId = req.params.postid;
    const user = await req.user;
    await editPost(postId, {
      title,
      link,
      description,
    });
    res.redirect(`/posts/show/${postId}`);
  } catch (e) {
    console.log(e);
    res.redirect("/posts");
  }
});

router.get(
  "/deleteconfirm/:postid",
  ensureAuthenticatedAsUserId,
  async (req, res) => {
    const post = await getPost(req.params.postid);
    res.render("deleteConfirmPost", { post });
  }
);

router.post("/delete/:postid", ensureAuthenticated, async (req, res) => {
  try {
    const postId = req.params.postid;
    const post = await getPost(postId);
    const postSubgroup = post.subgroup;
    const user = await req.user;

    await deletePost(postId);
    res.redirect(`/subs/show/${postSubgroup}`);
  } catch (e) {
    console.log(e);
    res.redirect(`/posts/show/${postId}`);
  }
});

router.post(
  "/comment-create/:postid",
  ensureAuthenticated,
  async (req, res) => {
    const { comment } = req.body;
    const postId = req.params.postid;
    const user = await req.user;
    await database.addComment(postId, user.id, comment);
    res.redirect(`/posts/show/${postId}`);
  }
);

//vote System

router.post("/vote/:postid", async (req, res) => {
  const post_id = req.params.postid;
  const user = await req.user;
  const { action } = req.body;

  const data = await database.updateVotes(post_id, user.id, action);

  res.status(200).send(JSON.stringify(data));
});

export default router;
