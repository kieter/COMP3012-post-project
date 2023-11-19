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

async function editPost(
  postId: number,
  changes: {
    title?: string;
    link?: string;
    description?: string;
  }
) {
  return db.editPost(postId, changes);
}

async function deletePost(postId: number) {
  return db.deletePost(postId);
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
  const comment = await db.getComment(commentId);

  if (!comment) return null;
  //Fetching user instead of the id
  const user = db.getUser(comment.creator);
  comment.creator = user;

  return db.getComment(commentId);
}

// Create a new comment
async function deleteComment(commentId: number) {
  return db.deleteComment(commentId);
}

async function getVotes(postId: number, activeUser: number) {
  const post = await getPost(postId);
  const userVote = post.votes.filter(
    (p: { user_id: number }) => p.user_id == activeUser
  );
  return userVote[0];
}

async function updateVotes(post_id: number, user_id: number, action: string) {
  const votes = await getVotes(post_id, user_id);
  let value = action == "Up" ? +1 : -1;

  //if already has a value
  if (votes && votes.value != 0) {
    value = 0;
  }
  await db.insertOrUpdateVotesForPost(post_id, user_id, value);
  const post = await getPost(post_id);

  //Return the new Counted value
  let newValue = post.votes.reduce(
    (cur: number, { value }: { value: number }) => cur + value,
    0
  );

  return { newValue, value };
}

export {
  getPosts,
  getPost,
  addPost,
  editPost,
  deletePost,
  addComment,
  getComment,
  deleteComment,
  getVotes,
  updateVotes,
};
