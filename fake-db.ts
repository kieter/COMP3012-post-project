// @ts-nocheck
const users = {
  1: {
    id: 1,
    uname: "alice",
    password: "alpha",
  },
  2: {
    id: 2,
    uname: "theo",
    password: "123",
  },
  3: {
    id: 3,
    uname: "prime",
    password: "123",
  },
  4: {
    id: 4,
    uname: "leerob",
    password: "123",
  },
};

const posts = {
  101: {
    id: 101,
    title: "Mochido opens its new location in Coquitlam this week",
    link: "https://dailyhive.com/vancouver/mochido-coquitlam-open",
    description:
      "New mochi donut shop, Mochido, is set to open later this week.",
    creator: 1,
    subgroup: "food",
    timestamp: 1643648446955,
  },
  102: {
    id: 102,
    title: "2023 State of Databases for Serverless & Edge",
    link: "https://leerob.io/blog/backend",
    description:
      "An overview of databases that pair well with modern application and compute providers.",
    creator: 4,
    subgroup: "coding",
    timestamp: 1642611742010,
  },
};

const comments = {
  9001: {
    id: 9001,
    post_id: 102,
    creator: 1,
    description: "Actually I learned a lot :pepega:",
    timestamp: 1642691742010,
  },
};
// for replies
const replies = {
  90011: {
    id: 90011,
    comment_id: 9001,
    post_id: 102,
    creator: 1,
    description: "Reply to 9001",
    timestamp: 1642691742010,
  },
};

const votes = [
  { user_id: 2, post_id: 101, value: +1 },
  { user_id: 3, post_id: 101, value: +1 },
  { user_id: 4, post_id: 101, value: +1 },
  { user_id: 3, post_id: 102, value: -1 },
];

function debug() {
  console.log("==== DB DEBUGING ====");
  console.log("users", users);
  console.log("posts", posts);
  console.log("comments", comments);
  console.log("votes", votes);
  console.log("==== DB DEBUGING ====");
}

function getUser(id) {
  return users[id];
}

function isUsernameTaken(uname) {
  return Object.values(users).some((user) => user.uname === uname);
}

function getUserByUsername(uname: any) {
  return getUser(
    Object.values(users).filter((user) => user.uname === uname)[0]?.id,
  );
}

function createUser(uname, password) {
  let id = Math.max(...Object.keys(users).map(Number)) + 1;
  let user = {
    id,
    uname,
    password,
  };
  users[id] = user;
  return user;
}

function getVotesForPost(post_id) {
  return votes.filter((vote) => vote.post_id === post_id);
}

function insertOrUpdateVotesForPost(
  post_id: number,
  user_id: number,
  value: number,
) {
  const findVote = votes.findIndex(
    (vote) => vote.post_id == post_id && vote.user_id == user_id,
  );

  if (findVote >= 0) {
    //update
    votes[findVote].value = value;
  } else {
    //if not found create
    votes.push({ user_id, post_id: +post_id, value });
  }
}

function decoratePost(post) {
  post = {
    ...post,
    creator: users[post.creator],
    votes: getVotesForPost(post.id),
    comments: Object.values(comments)
      .filter((comment) => comment.post_id === post.id)
      .map((comment) => ({ ...comment, creator: users[comment.creator] })),
  };
  return post;
}

/**
 * @param {*} n how many posts to get, defaults to 5
 * @param {*} sub which sub to fetch, defaults to all subs
 */
function getPosts(n = 5, sub: string = undefined) {
  let allPosts = Object.values(posts);
  if (sub) {
    allPosts = allPosts.filter((post) => post.subgroup === sub);
  }
  allPosts = allPosts
    .sort((a, b) => b.timestamp - a.timestamp)
    .map((a) => decoratePost(a));
  return allPosts.slice(0, n);
}

function getPost(id) {
  //Check there is a post
  if (!posts[id]) return null;
  return decoratePost(posts[id]);
}

function addPost(title, link, creator, description, subgroup) {
  let id = Math.max(...Object.keys(posts).map(Number)) + 1;
  let post = {
    id,
    title,
    link,
    description,
    creator: Number(creator),
    subgroup,
    timestamp: Date.now(),
  };
  posts[id] = post;
  return post;
}

function editPost(post_id, changes = {}) {
  let post = posts[post_id];
  if (changes.title) {
    post.title = changes.title;
  }
  if (changes.link) {
    post.link = changes.link;
  }
  if (changes.description) {
    post.description = changes.description;
  }
  if (changes.subgroup) {
    post.subgroup = changes.subgroup;
  }
}

function deletePost(post_id) {
  delete posts[post_id];
}

function getSubs() {
  return Array.from(new Set(Object.values(posts).map((post) => post.subgroup)));
}

function addComment(post_id, creator, description) {
  let id = Math.max(...Object.keys(comments).map(Number)) + 1;
  let comment = {
    id,
    post_id: Number(post_id),
    creator: Number(creator),
    description,
    timestamp: Date.now(),
  };
  comments[id] = comment;
  return comment;
}

function getComment(id) {
  //Check there is a post
  if (!comments[id]) return null;
  return comments[id];
}

function deleteComment(id) {
  //Check there is a post
  if (!getComment(id)) return null;
  delete comments[id];
}

function editComment(id, edit) {
  if (!getComment(id)) return null;
  const oldComment = getComment(id);
  const newComment = {
    ...getComment(id),
    post_id: oldComment.post_id,
    creator: oldComment.creator.id,
    description: edit.comment,
  };
  comments[id] = newComment;
  return newComment;
}

function countComment(post_id) {
  const commentArray = Object.values(comments);
  const number = commentArray.filter(
    (comment) => comment.post_id === post_id,
  ).length;
  return number;
}

function getCommentsForPost(post_id: number) {
  return Object.values(comments).filter(
    (comment) => comment.post_id === post_id,
  );
}

function getReply(commentid) {
  //Check there is a post
  replies.filter((reply) => reply.comment_id === commentid);
  if (!replies[id]) return null;
  return replies.filter((reply) => reply.comment_id === commentid);
}

function getReplybyPost(postId) {
  //Check there is a post
  const replyArray = Object.values(replies);
  const result = replyArray.filter((reply) => reply.post_id === postId);
  return result;
}

function addReply(commentId, creator, description) {
  let id = Math.max(...Object.keys(replies).map(Number)) + 1;
  let reply = {
    id,
    post_id: Number(comments[commentId].post_id),
    comment_id: Number(commentId),
    creator: getUser(Number(creator)),
    description,
    timestamp: Date.now(),
  };
  replies[id] = reply;
  return reply;
}

export {
  debug,
  getUser,
  getUserByUsername,
  getPosts,
  getPost,
  addPost,
  editPost,
  deletePost,
  getVotesForPost,
  getSubs,
  addComment,
  getComment,
  deleteComment,
  editComment,
  countComment,
  decoratePost,
  insertOrUpdateVotesForPost,
  createUser,
  isUsernameTaken,
  addReply,
  getReply,
  getCommentsForPost,
  getReplybyPost,
};
