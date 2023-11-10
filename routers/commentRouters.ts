// @ts-nocheck
import express from "express";
import * as database from "../controller/postController";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";

router.get("/show/:commentid", ensureAuthenticated, async (req, res) => {
  const commentId = req.params.commentid;
  const comment = await database.getComment(commentId);
  console.log(await req.user, comment);
  const data = {
    comment,
    user: await req.user,
  };
  res.render("helpers/comment", data);
});

router.get("/deleteconfirm/:commentid", (req, res) => {
  const commentId = req.params.commentid;
  res.render("helpers/deleteConfirmComment", { commentId });
});

router.post("/delete/:commentid", ensureAuthenticated, (req, res) => {
  const commentId = req.params.commentid;
});

export default router;
