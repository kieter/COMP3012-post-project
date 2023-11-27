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

interface CommentUpdate {
  comment: string;
}
//EditComment
async function editComment(id: number, newComment: any) {
  let comment = await db.getComment(id);
  comment.description = newComment.comment;
  await db.updateComment(id, comment);
  return await comment;
}

// delete a new comment
async function deleteComment(commentId: number) {
  return db.deleteComment(commentId);
}

//create new reply
async function addReply(
  commentId:number,
  creator: number,
  description: string
) {
  return db.addReply(commentId, creator, description);
}

async function getReply(commentId:number){
  return db.getReply(commentId)
}

//Vote section
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
//count the vote amount
async function totalVote(post_id:number){
  const allVoteByPostId = await db.getVotesForPost(post_id)
  const voteTotal = await allVoteByPostId.reduce((acc, vote) => acc + vote.value, 0);
return voteTotal
}

async function totalControvatialVote(post_id:number){
  const allVoteByPostId = await db.getVotesForPost(post_id)
  const voteTotal = await allVoteByPostId.length;
return voteTotal
}

async function sortByVote(array:any) {
  const allVotes = await Promise.all(array.map(async (post:any) => {
    return {
      postId: post.id,
      votes: await totalVote(post.id),
    };
  }));
  const addVoteValue = allVotes.map(({ postId, votes }) => ({
    postId,
    postDetails: array.find((post:any) => post.id === postId),
    votes,
  }));
  const sortedPosts = addVoteValue.sort((a, b) => b.votes - a.votes).map(({ postDetails }) => postDetails);
  return sortedPosts;
}

async function sortByControvatial(array:any) {
  const allVotes = await Promise.all(array.map(async (post:any) => {
    return {
      postId: post.id,
      votes: await totalControvatialVote(post.id),
    };
  }));
  const addVoteValue = allVotes.map(({ postId, controvvatialVotes }) => ({
    postId,
    postDetails: array.find((post:any) => post.id === postId),
    controvvatialVotes,
  }));
  const sortedPosts = addVoteValue.sort((a, b) => b.controvvatialVotes - a.controvvatialVotes).map(({ postDetails }) => postDetails);
  return sortedPosts;
}

function calculateHotScore(totalLikes:number, commentNumber:number, postTimestamp:number) {
  const currentTimestamp = new Date().getTime();
  const timeDifference = currentTimestamp - postTimestamp;
  const score = totalLikes + commentNumber / 2 + 1 / Math.sqrt(timeDifference + 1);
  return score;
}

async function sortByHot(array:any) {
  const allVotes = await Promise.all(array.map(async (post:any) => {
    return {
      postId: post.id,
      votes: await totalVote(post.id),
      comments: await db.countComment(post.id),
      timestamp: post.timestamp,
    };
  }));
  const addHotValue = await Promise.all(allVotes.map(async(e:any)=>{
    const postDetails = await array.find((postItem:any) => e.postId === postItem.id);
    return{
    postId: e.postId,
    hotnumber: await calculateHotScore(e.votes, e.comments, e.timestamp),
    postDetails,
    }
  }))
  const sortedPosts = addHotValue.sort((a, b) => b.hotnumber - a.hotnumber).map(({ postDetails }:any) => postDetails);
  return sortedPosts;
}



export {
  getPosts,
  getPost,
  addPost,
  editPost,
  deletePost,
  addComment,
  getComment,
  editComment,
  deleteComment,
  getVotes,
  updateVotes,
  sortByVote,
  sortByControvatial,
  sortByHot,
  getReply,
  addReply,
};
