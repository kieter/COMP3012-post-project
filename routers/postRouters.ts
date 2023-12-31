// @ts-nocheck
import express from "express";
import * as database from "../controller/postController";
const router = express.Router();
import { getUser } from "../fake-db";
import {
  ensureAuthenticated,
  ensureAuthenticatedAsUserId,
} from "../middleware/checkAuth";
import { getPost, editPost, deletePost } from "../controller/postController";

router.get("/", async (req, res) => {
  let posts = await database.getPosts(20);
  const user = req.user;

  if (req.query.sortBy === "date") {
    posts.sort((a, b) => b.timestamp - a.timestamp);
  } else if (req.query.sortBy === "vote") {
    posts = await database.sortByVote(posts);
  } else if (req.query.sortBy === "hot") {
    posts = await database.sortByHot(posts);
  } else if (req.query.sortBy === "controversial") {
    posts = await database.sortByControvatial(posts);
  }
  res.render("posts", { posts, user, getUser });
});

router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("createPosts", { user: req.user });
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
    subgroup,
  );

  //Redirect to the new Post once created
  res.redirect(`show/${newPost.id}`);
});

router.get("/show/:postid", async (req, res) => {
  const post = await database.getPost(req.params.postid);
  const user = await req.user;
  const reply = await database.getReplybyPost(post.id);
  //If not post found redirect to home
  if (!post) {
    return res.render("404NotFound");
  }
  const data = {
    post,
    user,
    reply,
  };

  res.render("individualPost", data);
});

router.get("/edit/:postid", ensureAuthenticatedAsUserId, async (req, res) => {
  const post = await getPost(req.params.postid);
  res.render("editPost", { post, user: req.user });
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
    res.redirect("/posts");
  }
});

router.get(
  "/deleteconfirm/:postid",
  ensureAuthenticatedAsUserId,
  async (req, res) => {
    const post = await getPost(req.params.postid);
    res.render("deleteConfirmPost", { post, user: req.user });
  },
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
    res.redirect(`/posts/show/${postId}`);
  }
});
//comment
router.post(
  "/comment-create/:postid",
  ensureAuthenticated,
  async (req, res) => {
    const { comment } = req.body;
    const postId = req.params.postid;
    const user = await req.user;
    await database.addComment(postId, user.id, comment);
    res.redirect(`/posts/show/${postId}`);
  },
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
