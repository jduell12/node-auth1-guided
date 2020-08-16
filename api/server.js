const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const usersRouter = require("../users/users-router.js");

const server = express();

const sessionConfig = {
  name: "monkey",
  secret: "keep it secret, keep it safe!",
  cookie: {
    maxAge: 1000 * 30,
    secure: false, //ok in development but want true in production
    httpOnly: true, //can't be accessed from JS
  },
  resave: false, //recreate session even if nothing has changed?
  saveUninitialized: false, //GDPR compliance - laws against setting cookies automatically
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;
