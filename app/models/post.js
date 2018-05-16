const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 280,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  root: {
    type: Boolean,
    default: true,
  },
  comments: [{ type: mongoose.Schema.ObjectId, ref: 'Post' }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model('Post', PostSchema);
