const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const usersRouter = require("../users/users-router.js");
const authRouter = require("../auth/auth-router");
const protected = require("../auth/protected");
const session = require("express-session");
const dbConnection = require("../database/connection");
const KnexSessionStore = require("connect-session-knex")(session);

const server = express();

const sessionConfig = {
  name: "monster",
  secret: "Super secret secret",
  resave: false,
  saveUninitialized: false, //GDPR compliance - ask user if they want cookies or not if true
  cookie: {
    maxAge: 1000 * 30, //30 seconds
    secure: process.env.COOKIE_SECURE || false, //if true cookie is only sent over https
    httpOnly: true, //JS can't touch the cookie
  },
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true, //creates table if no table named sessions
    clearInterval: 1000 * 60 * 60, //deletes expired sessions every hour
  }),
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/users", protected, usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.get("/hash", (req, res) => {
  //read a password property from the headers
  //hash the password and send back both the password and the hash
  const password = req.headers.password;
  try {
    const rounds = process.env.HASH_ROUNDS || 8;
    const hash = bcrypt.hashSync(password, rounds);
    res.status(200).json({ password, hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = server;
