import express from "express";
import passport from "../middleware/passport";
const router = express.Router();

router.get("/login", async (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("localLogin", {
    successRedirect: "/posts",
    failureRedirect: "/auth/login",
  }),
);

router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  passport.authenticate("localRegister", {
    successRedirect: "/posts",
    failureRedirect: "/auth/register",
  }),
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  res.redirect("/");
});

export default router;
