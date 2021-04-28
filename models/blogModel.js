const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  postDate: String,
  authorName: String,
  blogTitle: String,
  imageUrl: String,
  description: String,
});

const BlogPost = mongoose.model("BlogPost", blogSchema);

module.exports = BlogPost;
