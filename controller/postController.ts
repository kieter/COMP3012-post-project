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

// Create a new comment
async function addComment(
  post_id: number,
  creator: number,
  description: string
) {
  return db.addComment(post_id, creator, description);
}

export { getPosts, getPost, addPost, addComment };
