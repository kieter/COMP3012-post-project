import * as db from "../fake-db";
import {isUsernameTaken} from "../fake-db";

export const getUserByEmailIdAndPassword = async (
  uname: string,
  password: string
) => {
  let user = db.getUserByUsername(uname);
  if (user) {
    if (user.password === password) {
      return user;
    } else {
      return null;
    }
  }
};

export const createUser = async (
  uname: string,
  password: string,
) => {
  if (isUsernameTaken(uname)) {
    return null;
  } else {
    return db.createUser(uname, password);
  }
}

export const getUserById = async (id: string) => {
  let user = db.getUser(id);
  if (user) {
    return user;
  }
  return null;
};
