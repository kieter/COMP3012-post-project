import { NextFunction, Request, Response } from "express";
import { getPost } from "../controller/postController";
function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
}

async function ensureAuthenticatedAsUserId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/login");
  }

  try {
    const postId = req.params.postid;
    const post = await getPost(Number(postId));

    if (!post) {
      return res.render("404NotFound");
    }

    // @ts-ignore
    if (post && req.session.passport.user === post.creator.id) {
      return next();
    }

    res.render("403Forbidden");
  } catch (error) {
    console.error(error);
    res.redirect("/auth/login");
  }
}

function forwardAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
export {
  ensureAuthenticated,
  forwardAuthenticated,
  ensureAuthenticatedAsUserId,
};
