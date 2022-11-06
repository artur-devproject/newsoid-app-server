const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const cron = require('node-cron')
require('dotenv').config()
const config = require('./config')
const mongoose = require('mongoose')
const postRouter = require('./routes/posts');
const postController = require('./controllers/postController');
const loadPostsFromSource = require('./controllers/loadPostsFromSource');
const newsSources = require('./sources');

// connect to database
mongoose.connect(config.DB_HOST, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('connected', () => console.log("---Database connected succesfully---"))
db.on('error', console.error.bind(console, "MongoDB connection error: "))

//add and delete posts in database by schedule
cron.schedule(config.LOADING_TIME, async ()=> {
  console.log("New posts loading ...")
  const newPosts = await loadNewPosts(newsSources)
  postController.add_posts(newPosts);
});

async function loadNewPosts(sourcesList) {
  const posts = [];
  let i = 0

  while(i < sourcesList.length) {
    let sourcePosts = await loadPostsFromSource(sourcesList[i])
    i++
    if(!sourcePosts) continue
    posts.push(...sourcePosts)
  }

  return posts
}

cron.schedule(config.REMOVING_TIME, ()=> {
  console.log("It's time to delete posts")
  let date = Date.now() - 1000*3600*24*config.STORING_DAYS
  postController.delete_posts_by_date(date)
})

// APP
const app = express()

app.use(cors({"origin": "*"}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/', postRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("...false route")
  res.status(404).send("Sorry can't find that!");
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
