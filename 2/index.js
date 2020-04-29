const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const handler = require('./lib/handler');
const helpers = require('./lib/helper');

const port = 4444;
const home = 'localhost' || '127.0.0.1';

// create  the server
const server = http.createServer(function(req, res) {
  // res.writeHead(201, {'Content-type': 'application/json'})
  // res.end('hello world 2');
  unifiedServer(req, res);
});

// a unified function to handle all the logic of the http and https server
const unifiedServer = function(req, res) {
  // get the url and parse it
  const parseUrl = url.parse(req.url, true);
  // get the path
  const path = parseUrl.pathname;
  const trimmedPath =
    path.length === 1
      ? path.replace(/^\/+|\/+$/g, '/')
      : path.replace(/^\/+|\/+$/g, '');

  // get the query string as an object
  const queryStringObject = parseUrl.query;

  // get the http method
  const method = req.method.toLowerCase();

  // get the http headers
  const { headers } = req;

  // get the http payload if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', data => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();

    // choose the handler the request should go to
    // router['/']
    const chooseHandler =
      typeof router[trimmedPath] !== 'undefined'
        ? router[trimmedPath]
        : handler.notFound;

    // data
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJSONtoObject(buffer)
    };

    // route the request to the handler specified in the request
    chooseHandler(data, (statusCode, payload) => {
      // status code or default
      statusCode = typeof statusCode === 'number' ? statusCode : 200;
      // payload or default
      payload = typeof payload === 'object' ? payload : {};

      // convert payload to a string
      const payloadString = JSON.stringify(payload);

      // return JSON
      res.setHeader('Content-Type', 'application/json');
      // return the response
      res.writeHead(statusCode);
      // send the response
      res.end(payloadString);
      // log the request path
      // console.log(`Request is listening on path- ${trimmedPath} and method ${method} and query string ${Object.entries(queryStringObject)} and headers ${Object.entries(headers)}`);
      // console.log({data})
      console.log(`Request received with payload:  ${data}`);
    });
  });
};

// define a router
const router = {
  '/': handler.home,
  sample: handler.sample,
  ping: handler.ping
  // users: handler.users,
  // tokens: handler.tokens,
  // checks: handler.checks
};

server.listen(port, home, () => {
  console.log(`Server running at http://${home}:${port}`);
});
