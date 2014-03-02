var path = require('path');
var express = require('express');
var request = require('supertest');
var errorHandler = require('../lib/error-handler');
var sinon = require('sinon');
var expect = require('chai').use(require('sinon-chai')).expect;

describe('errorHandler middleware', function () {
  var app, richError, basicError, render;

  beforeEach(function () {
    richError = new Error('Rich error message.');
    richError.status = 418;
    richError.code = 444;

    basicError = 'basic error';

    render = sinon.stub().yields();

    app = express();
    app.engine('html', render);
    app.set('view engine', 'html');
    app.set('views', path.join(__dirname, 'fixtures', 'views'));

    app.get('/rich-error', function (req, res, next) {
      next(richError);
    });

    app.get('/basic-error', function (req, res, next) {
      next(basicError);
    });

    sinon.stub(process, 'exit');
  });

  afterEach(function () {
    process.exit.restore();
  });

  describe('with a server error and `exitOnUncaughtException` setted to true', function () {
    beforeEach(function () {
      richError.status = 500;
      app.use(errorHandler({ exitOnUncaughtException: true, exitCode: 2 }));
    });

    it('should exit server with `exitCode`', function (done) {
      request(app)
        .get('/rich-error')
        .end(function (err) {
          if (err) return done(err);
          expect(process.exit).to.be.calledWith(2);
          done();
        });
    });
  });

  describe('json', function () {
    beforeEach(function () {
      app.use(errorHandler());
    });

    it('should render a basic error', function (done) {
      request(app)
        .get('/basic-error')
        .set('Accept', 'application/json')
        .expect(500, { error: { message: 'basic error', code: null } })
        .end(done);
    });

    it('should render a rich error', function (done) {
      request(app)
        .get('/rich-error')
        .set('Accept', 'application/json')
        .expect(418, { error: { message: 'Rich error message.', code: 444 } })
        .end(done);
    });
  });

  describe('html', function () {
    it('should render a basic error', function (done) {
      app.use(errorHandler());

      request(app)
        .get('/basic-error')
        .set('Accept', 'text/html')
        .expect(500)
        .end(function (err) {
          if (err) return done(err);
          var file = path.join(__dirname, 'fixtures', 'views', 'error.html');
          expect(render).to.be.calledWithMatch(file, sinon.match({
            error: basicError,
            status: 500,
            statusMessage: 'Internal Server Error'
          }));
          done();
        });
    });

    it('should render a rich error', function (done) {
      app.use(errorHandler());

      request(app)
        .get('/rich-error')
        .set('Accept', 'text/html')
        .expect(418)
        .end(function (err) {
          if (err) return done(err);
          var file = path.join(__dirname, 'fixtures', 'views', 'error.html');
          expect(render).to.be.calledWithMatch(file, sinon.match({
            error: richError,
            status: 418,
            statusMessage: 'I\'m a teapot'
          }));
          done();
        });
    });

    it('should use a custom view', function (done) {
      app.use(errorHandler({ view: 'big-error' }));

      request(app)
        .get('/rich-error')
        .set('Accept', 'text/html')
        .expect(418)
        .end(function (err) {
          if (err) return done(err);
          var file = path.join(__dirname, 'fixtures', 'views', 'big-error.html');
          expect(render).to.be.calledWithMatch(file);
          done();
        });
    });
  });

  describe('text', function () {
    beforeEach(function () {
      app.use(errorHandler());
    });

    it('should render a basic error', function (done) {
      request(app)
        .get('/basic-error')
        .set('Accept', 'text/plain')
        .expect(500, 'Internal Server Error')
        .end(done);
    });

    it('should render a rich error', function (done) {
      request(app)
        .get('/rich-error')
        .set('Accept', 'text/plain')
        .expect(418, 'Rich error message.')
        .end(done);
    });
  });
});