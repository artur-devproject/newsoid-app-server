const Post = require('../models/post')
const News = require('../sources')
const config = require('../config')

exports.get_posts = function(req, res, next) {
console.log('Request is received')
    const date = req.query._date || Date.now()

    Post.find({pubDate: {$lt: date}}, {_id:0}, (err, posts) => {
        if(err) return next(err)
        console.log("Response is ready")
        res.json(posts)
    }).sort({pubDate: -1}).limit(config.LIMIT_REQUEST)
}

exports.get_sources = function(req, res, next) {
    const sources = News.map(elem => elem.name)
    console.log('sources are ready')
    res.json({'number': sources.length, 'sources': sources})
}

exports.add_posts = function(posts) {
    Post.insertMany(posts, { ordered: false }, (err, docs) => {
        if(err) return console.log("...adding went wrong...")
        if(docs) return console.log(docs.length + " new posts added succesfully!")
    })
}

exports.delete_posts_by_date = async function(date) {
    try {
        const res = await Post.deleteMany({pubDate: {$lt: Number.parseInt(date)}})
        console.log(res.deletedCount + " posts have been deleted!")
    } catch (error) {
        console.log("...deleting went wrong...")
    }
}