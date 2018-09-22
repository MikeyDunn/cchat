# C.CHAT

Socket.io enabled chatting system that functions entirely inside the dev tools console.

### Motivation

This project was created as a learning exercise for NodeJS, Websockets and general application architecture and testing.

### Author

Mike Dunn is a senior Front-end Developer with 5+ years of professional experience. Seeking to help deliver high quality applications through excellent coding practices and technical leadership. Specializing in semantics, optimization and system design.

### Application Structure

`/public` - Static assets that will be served to the client

`/services` - NodeJS classes to handle messaging, validation, and logging

`/templates` - HTML template to be served on every route

`/tests` - All in one testing files for services

`/index.js` - Entry point for NodeJS

### Getting Started

##### NPM Setup

[Node.js](https://nodejs.org) is a prerequisite.

Commands to install and run application:

```
$ git clone git@github.com:MikeyDunn/cchat.git
$ cd cchat
$ npm install
$ npm run dev

// Open browser to `http://localhost:8080`
```

##### Docker Setup

[Docker](https://www.docker.com/) is a prerequisite.

Commands to run application:

```
$ docker build -t cchat .
$ docker run -p 8080:8080 cchat

// Open browser to `http://localhost:8080`
```


### Testing

Testing is being handled by Tape and files are organized by service in the `/tests` directory.

Command to run application tests:

```
npm run test
```

### Chat Instructions

Ignoring the decoy 404 page, you can open the dev tools console to find the chatting system.

The following commands can be typed directly in the console:

`msg` - calls a function to open an alert with input field

`msg(String)` - messaging function that can be called directly

### Built With

* [Socket.io](https://socket.io/) - Event-Based Bi-Directional Communication Layer
* [Express](http://expressjs.com/) - Minimalist Web Framework
* [NodeJS](https://nodejs.org/) - JavaScript Run-Time Environment
* [Tape](https://github.com/substack/tape) - Simple Testing Framework
