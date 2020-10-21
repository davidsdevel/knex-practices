const {Schema} = require('mongoose');

const BlogPost = new Schema({
	blogID: String,
	title: String,
	description: String,
	tags: Array,
	category: String,
	content: String,
	comments: {
		type: Number,
		default: 0
	},
	created: {
		type: Date,

	},
	published: Date,
	updated:{
		type: Date,
		default: Date.now
	},
	authorEmail: String,
	postStatus: {
		type: String,
	},
	images: Array,
	url: String,
	views: {
		type: Number,
		default: 0
	}
});

module.exports = BlogPost;
