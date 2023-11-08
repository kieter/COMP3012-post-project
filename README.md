# Term Assignment

## Introduction

In this assignment, you will demonstrate an ability to make a multi-page app, with no need to write front-end JavaScript. You will use Express.js, including a templating engine, to implement multiple routes across multiple resources, and you will use passport to allow users to login.

In particular, this application will behave similar to the social network Reddit.

## Types of Resources

### Users

- **USERS** correspond to people who can log in.
  - Users directly have this data:
    - id
    - uname
    - password
  - Users relate to this other data:
    - they may have created zero or more postings
    - they may have created zero or more comments
    - for a post, they may have voted it up, or down, or not at all
    - for a comment, they may have voted it up, or down, or not at all

### Subgroups

- **SUBGROUPS** are categories of the site. Every post belongs to one subgroup. Unlike real reddit, subgroups are created dynamically, simply by saying a post belongs to one.
  - Subgroups directly have this data:
    - name
  - Subgroups relate to this other data:
    - subs always contain one or more postings

### Postings

- **POSTINGS** are the main content of the site. The purpose of a posting is a link, presumably to some external site. Postings also have some explanatory text, and a title. Postings can be voted up or voted down, and thus have a vote total.
  - Postings directly have this data:
    - id
    - title
    - link
    - description
    - creator
    - subgroup
    - timestamp
  - Postings relate to this other data:
    - they're by a user
    - they're in a sub
    - they have zero or more comments
    - they have a vote total

### Comments

- **_COMMENTS_**
  - Comments directly have this data:
    - id
    - description
    - creator
    - postid
    - timestamp
  - Comments relate to this other data:
    - they're by a user
    - they belong to a post

## Actual Requirements, organized by Grade

### PASS

✅ Users must be able to log in and log out.

Users must be able to create posts and comment on posts.

Posts are placed into subgroups, simply by specifying a subgroup during post-creation.

#### Routes Required

All GET routes, unless otherwise specified, should `res.render` a template. All POST routes, unless otherwise specified, should do their work and then `res.redirect`.

- authentication work
  - `GET /login` ✅
  - `POST /login` ✅
  - `POST /logout` ✅
- home
  - `GET /` (redirects to /posts or /login)
    - shows a listing of the most recent 20 posts ✅
      - each entry has a link, which uses the title for its visible text ✅
      - each entry also lists the user that created it
- subs

  - `GET /subs/list`
    - shows a list of all existing subs that have at least one post
      - each entry is a link to the appropriate `GET /subs/show/:subname`
      - sort them predictably somehow, either alphabetical or by-post-count or something, up to you
  - `GET /subs/show/:subname`
    - same as `GET /`, but filtered to only show posts that match the subname

- individual posts
  - `GET /posts/show/:postid`
    - shows post title, post link, timestamp, and creator
    - also has a list of _all comments_ related to this post
      - each of these should show the comment description, creator, and timestamp
      - optionally, each comment could have a link to delete it
    - if you're logged in, a form for commenting should show
  - `GET /posts/create`
    - form for creating a new post
  - `POST /posts/create`
    - processes the creation
    - doesn't allow invalid creations, for example if there's no link and also no description
      - (no-link is okay if you want to do that, though)
    - every post must have a "sub", but it can be any string, including any string not previously used
      - so if the sub already exists, connect this post to that sub
      - but if the sub doesn't already exist, make a new sub!
    - when finished redirects to the post just created
  - `GET /posts/edit/:postid`
    - form for editing an existing post
    - please think for a moment about which parts of a post should be editable, and which should not
    - Shouldn't load unless you're logged in _as the correct user_
  - `POST /posts/edit/:postid`
    - redirect back to the post when done
  - `GET /posts/deleteconfirm/:postid`
    - form for confirming delete of an existing post
    - shouldn't load unless you're logged in _as the correct user_
  - `POST /posts/delete/:postid`
    - if cancelled, redirect back to the post
    - if successful, redirect back to the _sub that the post belonged to_
  - `POST /posts/comment-create/:postid`
    - remember how `GET /posts/show/:postid` has a form for comments? It submits to here.
- comments - these routes are _all optional_ at the PASS level, but I personally would find it useful to make them
  - `GET /comments/show/:commentid`
    - shows just a single comment with all its data and any links that are useful
  - `GET /comments/deleteconfirm/:commentid`
    - could be triggered from `GET /posts/show/:postid` or from `GET /comments/show/:commentid`
  - `POST /comments/delete/:commentid`

#### Code organization

I expect you to use `express.Router` to organize your routes where appropriate (i.e. subs and posts, and if you do comments routes then those too).

I expect your variable names to be vaguely reasonable. An example of unreasonable is a variable with a name that is lies about what's in it (e.g. the variable is called `post` but it always contains an array of multiple posts, or a variable called `post_id` that contains a user ID). Also unreasonable is a variable that is super vague when there's an obvious less-vague name (e.g. a variable called `info` when there's an obvious better alternative like `post_count` or `user_name`).

#### Ordering

At this level, every time there is a listing of posts or comments, they should be sorted by timestamp, with the most recent post/comment at the top.

#### Header required

Also, there should be a header shared across all pages.
It should include the site title, of course, and that should be a link back to `GET /`.
It should also include a link to `GET /subs/list`.

If the user is logged out, the header should include a link to the login page (and, if you're doing signup stuff for higher grades, the signup page too).

If the user is logged in, the header should NOT include a login link, but it SHOULD include a link to create a new post.

#### CSS requirements

CSS requirements are _very very low_. We're not really doing CSS in this course. BUT, please try to not make it ugly. In particular, here are some suggestions.

- it'd be nice if the header looks at least sort of like a header
- it'd be nice if the lists look like lists
- in pages that combine posts and comments, it should be easy to see that the post is more important than the comments (just font-size or something would be enough)

### SATISFACTORY

For this level, probably most of the work will be on getting voting working.

#### Voting

Everywhere it's possible to see a post (homepage, subgroup listing, individual post page, etc), there should be an upvote button and a downvote button beside the post link. I suggest using two buttons, one that says "+" or "Up", and one that says "-" or "Down". This voting functionality should only show if the user is logged in.

Each button could be its own form, or they could both be in one form. Whichever seems easier for you.

Everywhere that it's possible to see a post, the net vote total should be visible (positive votes minus negative votes)

Unlike reddit, clicking on a vote link will do a full-page refresh. That's fine.

This is one area where CSS is necessary. If I have voted on a post (up or down), the button should be obviously active. Make the whole thing filled in or something.

If I click the already-voted on button, that should cancel my vote. So I should be able to upvote something, then change my mind and switch that to downvote by clickong on downvote, and then change my mind again and cancel my vote by clicking on the upvote.

So you'll need to add at least this route:

- `POST /posts/vote/:postid/`
  - uses a body field `setvoteto` to set vote to +1, -1, or 0, overriding previous vote
  - redirects back to `GET /posts/show/:postid`

#### User Signup

It should be possible to sign up as a new user.

Two new routes are required: one for the form and one for the post. If you feel like combining the login page and the signup page, then you only have to do one extra route, but it's probably harder to get right.

#### Code organization

I am expecting your code to be cleanly organized and readable. Use sensible variable
names and format your code with prettier if need be.

### EXEMPLARY

#### No Page Reload on Comment Updates

When upvoting or downvoting a post, use AJAX
to initiate the update in the background (preventing the page from reloading).

#### Comment editing

Comments should be editable, deletable, etc, just like everything else.

- So all of these comments routes
  - `GET /comments/show/:commentid`
  - `POST /comments/reply/:commentid`
  - `GET /comments/edit/:commentid`
  - `POST /comments/edit/:commentid`
  - `GET /comments/deleteconfirm/:commentid`
  - `POST /comments/delete/:commentid`

All of these will go in their own `router`, of course, because consistency will help the next developer who works on this project.

Make sure that if a post is deleted, its comments are also deleted. (Cascading Delete).

#### Ordering

- Any view that shows a list of posts can now be viewed in at least two orders:
  - by date (the thing you should already have working)
  - by vote count (positive minus negative)
  - optionally, by some combination, the way reddit does "hot"
  - optionally, by total votes (positive _plus_ negative), like reddit's "controversial"

There should be some UI element on each page to switch between which ordering is active; I suggest buttons or links in a little row near the top.

Ideally this will be implemented by adding a query parameter ( https://expressjs.com/en/4x/api.html#req.query ) like `?orderby=date` or `?orderby=votes`.

Make sure that there's sensible default behaviour when the query parameter isn't specified.
