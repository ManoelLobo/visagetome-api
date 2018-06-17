const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;

chai.use(chaiHttp);

const app = require('../../index');
const factory = require('../factories');

const User = mongoose.model('User');

describe('Friend', () => {
  beforeEach(async () => {
    await User.remove();
  });

  it('should be able to befriend an user', async () => {
    const user = await factory.create('User');
    const friend = await factory.create('User');
    const jwt = await user.generateToken();

    const response = await chai
      .request(app)
      .post(`/api/users/${friend.id}/friend`)
      .set('Authorization', `Bearer ${jwt}`)
      .send();

    expect(response.body.friends).to.include(friend.id);
  });

  it('should not be able to befriend twice', async () => {
    const user = await factory.create('User');
    const friend = await factory.create('User');
    const jwt = await user.generateToken();

    await chai
      .request(app)
      .post(`/api/users/${friend.id}/friend`)
      .set('Authorization', `Bearer ${jwt}`)
      .send();

    const response = await chai
      .request(app)
      .post(`/api/users/${friend.id}/friend`)
      .set('Authorization', `Bearer ${jwt}`)
      .send();

    expect(response).to.have.status(400);
    expect(response.body).to.have.property('error');
  });

  it('should not be able to befriend non existent user', async () => {
    const user = await factory.create('User');
    const fake = mongoose.Types.ObjectId();
    const jwt = await user.generateToken();

    const response = await chai
      .request(app)
      .post(`/api/users/${fake}/friend`)
      .set('Authorization', `Bearer ${jwt}`)
      .send();

    expect(response).to.have.status(400);
    expect(response.body).to.have.property('error');
  });

  it('should be able to unfriend', async () => {
    const user = await factory.create('User');
    const friend = await factory.create('User');
    const jwt = user.generateToken();

    const friendResponse = await chai
      .request(app)
      .post(`/api/users/${friend.id}/friend`)
      .set('Authorization', `Bearer ${jwt}`)
      .send();

    expect(friendResponse.body.friends).to.include(friend.id);

    const unfriendResponse = await chai
      .request(app)
      .delete(`/api/users/${friend.id}/unfriend`)
      .set('Authorization', `Bearer ${jwt}`)
      .send();

    expect(unfriendResponse.body.friends).to.not.include(friend.id);
  });

  it('should check if user exists before unfriend', async () => {
    const user = await factory.create('User');
    const fake = mongoose.Types.ObjectId();
    const jwt = await user.generateToken();

    const response = await chai
      .request(app)
      .delete(`/api/users/${fake}/unfriend`)
      .set('Authorization', `Bearer ${jwt}`)
      .send();

    expect(response).to.have.status(400);
    expect(response.body).to.have.property('error');
  });

  it('should be able to unfriend friends-only', async () => {
    const user = await factory.create('User');
    const friend = await factory.create('User');
    const jwt = await user.generateToken();

    const response = await chai
      .request(app)
      .delete(`/api/users/${friend.id}/unfriend`)
      .set('Authorization', `Bearer ${jwt}`)
      .send();

    expect(response).to.have.status(400);
    expect(response.body).to.have.property('error');
  });
});
