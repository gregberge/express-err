# express-err

[![Build Status](https://travis-ci.org/neoziro/express-err.svg?branch=master)](https://travis-ci.org/neoziro/express-err)
[![Dependency Status](https://david-dm.org/neoziro/express-err.svg?theme=shields.io)](https://david-dm.org/neoziro/express-err)
[![devDependency Status](https://david-dm.org/neoziro/express-err/dev-status.svg?theme=shields.io)](https://david-dm.org/neoziro/express-err#info=devDependencies)

Basic error handler for express.
This middleware shows errors according to the "Accept" header. It will shutdown app in case of uncaught error.

## Install

```
npm install express-err
```

## Usage

```js
var express = require('express');
var errorHandler = require('express-err');

var app = express();

// Basic route.
app.get('/', function (req, res) {
  res.send('Hello world!');
});

// Redirect other routes to 404.
app.use(errorHandler.httpError(404));

// Handle errors.
app.use(errorHandler());
```

## errorHandler(options)

The error handler middleware is used to display errors and shutdown app in case of uncaught error.

The avalaible options are :

### view

Default view to render in case of error. Defaults to `"view"`.

```js
app.use(errorHandler({ view: 'my/custom/error-view' }));
```

### exitOnUncaughtException

Tell to the process to exit on uncaught exceptions. Defaults to `true`.

```js
app.use(errorHandler({ exitOnUncaughtException: false }));
```

### exitCode

The code used to exit app in case of uncaught exception. Defaults to `1`.

```js
app.use(errorHandler({ exitCode: 2 }));
```

### status

The default HTTP error code. Defaults to '500'.

```js
app.use(errorHandler({ status: 500 }));
```

### formatters

The supported error formatters. Defaults to JSON, HTML and plain text.

```js
app.use(errorHandler({ formatters: ['json', 'text', 'html'] }));
```

If your express app does not serve HTML, you might want to limit the supported error response types:

```js
app.use(errorHandler({ formatters: ['json', 'text'] }));
```

You can also define a default formatter that will be used if your app does not support the 
request 'Accept' type. Defaults to 'text'.

```js
app.use(errorHandler({ defaultFormatter: 'json' }));
```

## httpError(status, message)

You can use httpError to return a custom error with a status and a message.

## License

MIT
