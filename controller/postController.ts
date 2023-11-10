import * as db from "../fake-db";

// Make calls to your db from this file!
async function getPosts(n = 5, sub = undefined) {
  return db.getPosts(n, sub);
}

// Get a post from the database
async function getPost(id: number) {
  return db.getPost(id);
}

// Get a post from the database
async function addPost(
  title: string,
  link: string,
  creator: number,
  description: string,
  subgroup: string
) {
  return db.addPost(title, link, creator, description, subgroup);
}

//COMMENTS SECTION instead of creating multiple controllers

// Create a new comment
async function addComment(
  post_id: number,
  creator: number,
  description: string
) {
  return db.addComment(post_id, creator, description);
}

// Create a new comment
async function getComment(commentId: number) {
  const comment = db.getComment(commentId);

  //Fetching user instead of the id
  const user = db.getUser(comment.creator);
  comment.creator = user;

  return db.getComment(commentId);
}

// Create a new comment
async function deleteComment(commentId: number) {
  return db.deleteComment(commentId);
}

export { getPosts, getPost, addPost, addComment, getComment, deleteComment };
