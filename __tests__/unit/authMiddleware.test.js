const chai = require('chai');
const sinon = require('sinon');
const factory = require('../factories');
const httpMock = require('node-mocks-http');

const authMiddleware = require('../../app/middlewares/auth');

const { expect } = chai;

describe('Auth middleware', () => {
  it('should validate the presence of JWT', async () => {
    const req = httpMock.createRequest();
    const res = httpMock.createResponse();

    await authMiddleware(req, res);

    expect(res.statusCode).to.be.eq(401);
  });

  it('should validate the JWT', async () => {
    const req = httpMock.createRequest({
      headers: {
        authorization: 'Bearer 123456',
      },
    });
    const res = httpMock.createResponse();

    await authMiddleware(req, res);

    expect(res.statusCode).to.be.eq(401);
  });

  it('should pass valid token', async () => {
    const user = await factory.create('User');

    const req = httpMock.createRequest({
      headers: {
        authorization: `Bearer ${user.generateToken()}`,
      },
    });
    const res = httpMock.createResponse();

    const nextSpy = sinon.spy();

    await authMiddleware(req, res, nextSpy);

    expect(req).to.include({ userId: user.id });
    expect(nextSpy.calledOnce).to.be.true;
  });

  it('should check if a token is provided', async () => {
    const req = httpMock.createRequest({
      headers: {
        authorization: 'Bearer 1 2 3',
      },
    });
    const res = httpMock.createResponse();

    await authMiddleware(req, res);

    expect(res.statusCode).to.be.eq(401);
  });

  it('should check if a token is correctly formatted', async () => {
    const req = httpMock.createRequest({
      headers: {
        authorization: 'Bear DOG',
      },
    });
    const res = httpMock.createResponse();

    await authMiddleware(req, res);

    expect(res.statusCode).to.be.eq(401);
  });
});
