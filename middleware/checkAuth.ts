import { NextFunction, Request, Response } from "express";
import { getPost } from "../controller/postController";
function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
}

async function ensureAuthenticatedAsUserId(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/login");
  }

  try {
    const postId = req.params.postid;
    const post = await getPost(Number(postId));

    // @ts-ignore
    if (post && req.session.passport.user === post.creator.id) {
      return next();
    }
    //todo 404 page for post not found
    //todo 403 page for not authorized
    res.redirect("/auth/login");
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
export { ensureAuthenticated, forwardAuthenticated, ensureAuthenticatedAsUserId };
