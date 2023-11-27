// @ts-nocheck
import express from "express";
import * as database from "../controller/postController";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
//Problrem 1
//this is the controling comment ejs, right?
//I tried to render reply data which i created in DB , 
// and I could not show the reply at all....
// I tried to figure out with console.logout, but it does not come out....
// so i did not imprement <%=%>stuff in comment.ejs page in stad write down sentence
// like "this will be reply description"this wii be name and timestamp
router.get("/show/:commentid", ensureAuthenticated, async (req, res) => {
  const commentId = req.params.commentid;
  const comment = await database.getComment(commentId);
const reply = await database.getReply(commentId)
  console.log("reply",reply)
  console.log("I ran")

  //if not comment redirect to home
  if (!comment) res.redirect("/");

  const data = {
    comment,
    user: await req.user,
    reply,
  };
  res.render("helpers/comment", data);
});

router.get("/edit/:commentid", ensureAuthenticated, async (req, res) => {
  const commentId = req.params.commentid;
  const comment = await database.getComment(commentId);
  const data = {
    comment,
    user: await req.user,
  };
  res.render("helpers/editComment", data);
});

router.post("/edit/:commentid", ensureAuthenticated, async (req, res) => {
  const newComment = req.body;
  const commentId = parseInt(req.params.commentid);
  const comment = await database.editComment(commentId, newComment);
  const postId = comment.post_id;
  res.redirect(`/posts/show/${postId}`);
});

router.get("/deleteconfirm/:commentid", ensureAuthenticated, (req, res) => {
  const commentId = req.params.commentid;
  res.render("helpers/deleteConfirmComment", { commentId });
});

router.post("/delete/:commentid", ensureAuthenticated, async (req, res) => {
  const commentId = req.params.commentid;
  const comment = await database.getComment(commentId);
  const user = await req.user;

  //if not comment redirect to home
  if (!comment) return res.redirect("/");
  //only if the comment exists an the user is the owner of the post
  if (comment.creator.id === user.id) {
    database.deleteComment(commentId);
  } else {
    //If its not the owner send back to home
    return res.redirect("/");
  }

  res.redirect(`/posts/show/${comment.post_id}`);
});

export default router;
