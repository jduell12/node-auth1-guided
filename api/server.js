const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const usersRouter = require("../users/users-router.js");
const authRouter = require("../auth/auth-router");
const protected = require("../auth/protected");
const session = require("express-session");

const server = express();

const sessionConfig = {
  name: "monster",
  secret: "Super secret secret",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30000 },
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
