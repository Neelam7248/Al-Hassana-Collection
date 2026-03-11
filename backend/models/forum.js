const mongoose = require("mongoose");
/*
// Forum Category
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
});

const Category = mongoose.model("Category", categorySchema);*/

// Discussion (formerly Thread)
const discussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  categorySlug: { type: String, required: true },  // from categoriesConfig
  subSlug: { type: String, required: true },       // from categoriesConfig
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
}, { timestamps: true }); // adds createdAt & updatedAt automatically

const Discussion = mongoose.model("Discussion", discussionSchema);

// Post / Reply
const postSchema = new mongoose.Schema({
    discussionId: { type: mongoose.Schema.Types.ObjectId, ref: "Discussion", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
}, { timestamps: true }); // adds createdAt & updatedAt automatically

const Post = mongoose.model("Post", postSchema);

module.exports = {  Discussion, Post };