const mongoose = require('mongoose');

const Post = mongoose.model('Post');

module.exports = {
  async create(req, res, next) {
    try {
      const post = await Post.create({ ...req.body, user: req.userId });

      return res.json(post);
    } catch (err) {
      /* istanbul ignore next */
      return next(err);
    }
  },

  async destroy(req, res, next) {
    try {
      const post = await Post.findOneAndRemove({ _id: req.params.id, user: req.userId });

      if (!post) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      return res.send();
    } catch (err) {
      /* istanbul ignore next */
      return next(err);
    }
  },
};
