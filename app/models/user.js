const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: { type: String, required: true },
  friends: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

mongoose.model('User', UserSchema);
