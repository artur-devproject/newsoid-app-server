const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const PostSchema = new mongoose.Schema({
    pubDate: {type: Date, default: Date.now},
    sourceName: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    link: {type: String, required: true, unique: true},
    img: {type: String, required: true},
})

PostSchema.plugin(uniqueValidator, { message: 'Error, expected {VALUE} to be unique.' })

module.exports = mongoose.model('posts', PostSchema)