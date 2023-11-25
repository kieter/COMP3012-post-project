import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  createUser,
  getUserByEmailIdAndPassword,
  getUserById,
} from "../controller/userController";

// ⭐ TODO: Passport Types
const localLogin = new LocalStrategy(
  {
    usernameField: "uname",
    passwordField: "password",
  },
  async (uname: any, password: any, done: any) => {
    // Check if user exists in databse
    const user = await getUserByEmailIdAndPassword(uname, password);
    // console.log('passport 13: '+ user.uname);
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again.",
        });
  }
);

const localRegister = new LocalStrategy(
  {
    usernameField: "uname",
    passwordField: "password",
    passReqToCallback: true,
  },
  async (req: any, uname: any, password: any, done: any) => {
    const user = await createUser(uname, password);
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again.",
        });
  }
);

// ⭐ TODO: Passport Types
passport.serializeUser(function (user: any, done: any) {
  done(null, user.id);
});

// ⭐ TODO: Passport Types
passport.deserializeUser(async function (id: any, done: any) {
  const user = await getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

passport.use('localLogin', localLogin);
passport.use('localRegister', localRegister);

export default passport;
