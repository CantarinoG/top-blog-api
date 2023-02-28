const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true},
    timestamp: { type: Date, default: Date.now },
    post: { type: Schema.Types.ObjectId, ref: "Post" }
});

module.exports = mongoose.model("Comment", CommentSchema);