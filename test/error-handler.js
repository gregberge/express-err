'use strict';
/* jshint -W117 */

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


  describe('when a server error occurs', function() {
    beforeEach(function() {
      richError.status = 500;
    });

    it('should exit with `exitCode` when `exitOnUncaughtException` is set to true', function(done) {
      app.use(errorHandler({ exitOnUncaughtException: true, exitCode: 2 }));
      request(app)
        .get('/rich-error')
        .end(function(err) {
          if (err) return done(err);
          expect(process.exit).to.be.calledWith(2);
          done();
        });
    });

    it('should not exit with an error code when `exitOnUncaughtException` is set to false', function(done) {
      app.use(errorHandler({ exitOnUncaughtException: false, exitCode: 2 }));
      request(app)
        .get('/rich-error')
        .end(function(err) {
          if (err) return done(err);
          expect(process.exit).not.to.be.calledWith(2);
          done();
        });
    });
  });

  describe('should render, in JSON', function() {

    beforeEach(function () {
      app.use(errorHandler({'formatters': ['json']}));
    });

    it('a basic error defaulting to 500', function(done) {
      request(app)
        .get('/basic-error')
        .set('Accept', 'application/json')
        .expect(500, { error: { message: 'basic error', code: null } })
        .end(done);
    });

    it('a rich error with a specific HTTP code', function(done) {
      request(app)
        .get('/rich-error')
        .set('Accept', 'application/json')
        .expect(418, { error: { message: 'Rich error message.', code: 444 } })
        .end(done);
    });
  });

  describe('should render, in HTML', function() {

    beforeEach(function () {
      app.engine('html', render);
      app.set('view engine', 'html');
      app.set('views', path.join(__dirname, 'fixtures', 'views'));
    });

    it('a basic error defaulting to 500', function(done) {
      app.use(errorHandler({'formatters': ['html']}));
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

    it('a rich error', function (done) {
      app.use(errorHandler({'formatters': ['html']}));
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

    it('a rich error using a custom view', function (done) {
      app.use(errorHandler({
        view: 'big-error',
        formatters: ['html']
      }));

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

  describe('should render, in plain text', function() {

    beforeEach(function () {
      app.use(errorHandler({'formatters': ['text']}));
    });

    it('a basic error defaulting to 500', function(done) {
      request(app)
        .get('/basic-error')
        .set('Accept', 'text/plain')
        .expect(500, 'Internal Server Error')
        .end(done);
    });

    it('a rich error with a specific HTTP code', function(done) {
      request(app)
        .get('/rich-error')
        .set('Accept', 'text/plain')
        .expect(418, 'Rich error message.')
        .end(done);
    });
  });

  describe('should render in the default format if the response format is not supported', function() {
    beforeEach(function () {
      app.use(errorHandler({
        'formatters': ['text', 'json'],
        'defaultFormat': 'text'}));
    });

    it('a basic error defaulting to 500', function(done) {
      request(app)
        .get('/basic-error')
        .set('Accept', 'text/html')
        .expect(500, 'Internal Server Error')
        .end(done);
    });

    it('a rich error with a specific HTTP code', function(done) {
      request(app)
        .get('/rich-error')
        .set('Accept', 'text/html')
        .expect(418, 'Rich error message.')
        .end(done);
    });
  });

});