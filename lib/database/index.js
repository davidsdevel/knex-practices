const PostSchema = require('./schema');
const {model} = require('mongoose');

const PostModel = model('BlogPost', PostSchema);

module.exports = PostModel;
