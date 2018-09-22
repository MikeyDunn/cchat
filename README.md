# cchat

Socket.io enabled chatting system that functions entirely inside the dev tools console.

## Motivation

This project was created as an excuse to dive into NodeJS and Websockets.

## Installing

Commands to install the application

```
npm install
```

## Running

Default settings will host the page at `localhost:8080`.

Commands to run application

```
npm run dev
```

## Testing

Testing is being handled by Tape.

Command to run application tests:

```
npm run test
```

## Structure

`/public` - Static assets that will be served to the client

`/services` - NodeJS classes to handle messaging, validation, and logging

`/templates` - HTML template to be served on every route

`/tests` - All in one testing files for services

`/index.js` - Entry point for NodeJS

## Instructions

Ignoring the decoy 404 page, you can open the dev tools console to find the chatting system

The following commands can be typed directly in the console:

`msg` - calls a function to open an alert with input field

`msg(String)` - messaging function that can be called directly

## Built With

* [Socket.io](https://socket.io/) - Event-Based Bi-Directional Communication Layer
* [Express](http://expressjs.com/) - Minimalist Web Framework
* [NodeJS](https://nodejs.org/) - JavaScript Run-Time Environment

## Authors

* **Mike Dunn** - _Initial work_ - [MikeyDunn](https://github.com/MikeyDunn)
