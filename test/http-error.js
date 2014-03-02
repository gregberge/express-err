var express = require('express');
var request = require('supertest');
var httpError = require('../lib/http-error');
var expect = require('chai').expect;

describe('httpError middleware', function () {
  var app;

  beforeEach(function () {
    app = express();
    app.use(function (err, req, res, next) {
      console.log('ok');
    });
  });

  it('should return an error with default message', function (done) {
    app.get('/error', httpError(404));

    app.use(function (err, req, res, next) {
      expect(err).to.be.instanceof(Error);
      expect(err).to.have.property('status', 404);
      expect(err).to.have.property('message', 'Not Found');
      done();
    });

    request(app).get('/error').end();
  });

  it('should return an error with custom message', function (done) {
    app.get('/error', httpError(408, 'Custom error message.'));

    app.use(function (err, req, res, next) {
      expect(err).to.be.instanceof(Error);
      expect(err).to.have.property('status', 408);
      expect(err).to.have.property('message', 'Custom error message.');
      done();
    });

    request(app).get('/error').end();
  });
});