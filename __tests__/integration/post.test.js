const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;

chai.use(chaiHttp);

const app = require('../../index');
const factory = require('../factories');

const User = mongoose.model('User');
const Post = mongoose.model('Post');

describe('Post', () => {
  beforeEach(async () => {
    await User.remove();
    await Post.remove();
  });

  it('should be able to post', async () => {
    const user = await factory.create('User');
    const post = await factory.attrs('Post');
    const jwt = user.generateToken();

    const response = await chai
      .request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${jwt}`)
      .send({ ...post, user: user.id });

    expect(response.body.content).to.be.eq(post.content);
    expect(response.body.user).to.be.eq(user.id);
  });

  it('should be able to delete a post', async () => {
    const user = await factory.create('User');
    const post = await factory.create('Post', { user: user.id });
    const jwt = user.generateToken();

    const response = await chai
      .request(app)
      .delete(`/api/posts/${post.id}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send(post);

    expect(response).to.have.status(200);
  });

  it('should not be able to delete posts from other users', async () => {
    const user = await factory.create('User');
    const post = await factory.create('Post', { user: mongoose.Types.ObjectId() });
    const jwt = user.generateToken();

    const response = await chai
      .request(app)
      .delete(`/api/posts/${post.id}`)
      .set('Authorization', `Bearer ${jwt}`)
      .send(post);

    expect(response).to.have.status(401);
  });
});
