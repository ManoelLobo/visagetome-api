const mongoose = require('mongoose');
const sendMail = require('../services/mailer');

const User = mongoose.model('User');

module.exports = {
  async signin(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      if (!(await user.compareHash(password))) {
        return res.status(400).json({ error: 'Invalid password' });
      }

      const { username, name, friends } = user;
      return res.json({
        user: {
          name,
          username,
          email,
          friends,
        },
        token: user.generateToken(),
      });
    } catch (err) {
      /* istanbul ignore next */
      return next(err);
    }
  },

  async signup(req, res, next) {
    try {
      const { email, username } = req.body;

      if (await User.findOne({ $or: [{ email }, { username }] })) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const user = await User.create(req.body);

      sendMail({
        from: '"VisageTome" no-reply@visagetome.com',
        to: user.email,
        subject: `Welcome to VisageTome, ${user.name}`,
        template: 'auth/register',
        context: {
          name: user.name,
          username: user.username,
        },
      });

      return res.json({
        user: {
          name: user.name,
          username,
          email,
          friends: [],
        },
        token: user.generateToken(),
      });
    } catch (err) {
      /* istanbul ignore next */
      return next(err);
    }
  },
};
