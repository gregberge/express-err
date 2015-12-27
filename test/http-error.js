var express = require('express');
var request = require('supertest');
var httpError = require('../index').httpError;
var HttpError = require('../index').HttpError;
var expect = require('chai').expect;

describe('HttpError constructor', function () {
  it('should create an error with message and status', function () {
    var error = new HttpError(401, 'my message');
    expect(error).to.have.property('name', 'HttpError');
    expect(error).to.have.property('message', 'my message');
    expect(error).to.have.property('stack');
    expect(error).to.have.property('status', 401);
  });

  it('should default message to http status', function () {
    var error = new HttpError(404);
    expect(error).to.have.property('name', 'HttpError');
    expect(error).to.have.property('message', 'Not Found');
    expect(error).to.have.property('stack');
    expect(error).to.have.property('status', 404);
  });
});

describe('httpError middleware', function () {
  var app;

  beforeEach(function () {
    app = express();
  });

  it('should return an error with default message', function (done) {
    app.get('/error', httpError(404));

    app.use(function (err, req, res, next) {
      expect(err).to.be.instanceof(Error);
      expect(err).to.have.property('name', 'HttpError');
      expect(err).to.have.property('message', 'Not Found');
      expect(err).to.have.property('stack');
      expect(err).to.have.property('status', 404);
      done();
    });

    request(app).get('/error').end();
  });

  it('should return an error with custom message', function (done) {
    app.get('/error', httpError(408, 'Custom error message.'));

    app.use(function (err, req, res, next) {
      expect(err).to.be.instanceof(Error);
      expect(err).to.have.property('name', 'HttpError');
      expect(err).to.have.property('message', 'Custom error message.');
      expect(err).to.have.property('stack');
      expect(err).to.have.property('status', 408);
      done();
    });

    request(app).get('/error').end();
  });
});
