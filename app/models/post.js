const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  comments: [
    {
      user: { type: mongoose.Schema.ObjectId, ref: 'User' },
      content: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model('Post', PostSchema);
