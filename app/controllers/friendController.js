const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = {
  async create(req, res, next) {
    try {
      const friend = await User.findById(req.params.id);

      if (!friend) {
        return res.status(400).json({ error: "User doesn't exist" });
      }

      if (friend.friends.indexOf(req.userId) !== -1) {
        return res.status(400).json({ error: `You already follow ${friend.username}` });
      }

      const me = await User.findById(req.userId);

      friend.friends.push(req.userId);
      await friend.save();
      me.friends.push(friend.id);
      await me.save();

      return res.json(me);
    } catch (err) {
      /* istanbul ignore next */
      return next(err);
    }
  },

  async destroy(req, res, next) {
    try {
      const friend = await User.findById(req.params.id);

      if (!friend) {
        return res.status(400).json({ error: "User doesn't exist" });
      }

      const friendIndex = friend.friends.indexOf(req.userId);

      if (friendIndex === -1) {
        return res.status(400).json({ error: `You and ${friend.username} are not friends` });
      }

      friend.friends.splice(friendIndex, 1);
      await friend.save();

      const me = await User.findById(req.userId);
      const myFriendsIndex = me.friends.indexOf(friend.id);
      me.friends.splice(myFriendsIndex, 1);
      await me.save();

      return res.json(me);
    } catch (err) {
      /* istanbul ignore next */
      return next(err);
    }
  },
};
