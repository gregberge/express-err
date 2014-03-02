# express-err [![Build Status](https://travis-ci.org/neoziro/express-err.png?branch=master)](https://travis-ci.org/neoziro/express-err)

Basic error handler for express.
This middleware shows errors according to the "accepts" header. It shutdown app in case of uncaught error.

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

## errorHandler options

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

## httpError(status, message)

You can use httpError to return a custom error with a status and a message.

## License

MIT