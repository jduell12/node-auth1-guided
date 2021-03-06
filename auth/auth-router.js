const router = require("express").Router();
const bcrypt = require("bcryptjs");

const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  //validate user credentials, check password length, libraries for this

  const rounds = process.env.HASH_ROUNDS || 8;
  const hash = bcrypt.hashSync(password, rounds);

  Users.add({ username, password: hash })
    .then((users) => {
      res.status(201).json({ data: users });
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .then(([user]) => {
      //password and then the hash - needs to be in order
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.loggedIn = true;
        res.status(200).json({ message: "logged in", session: req.session });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/logout", (req, res) => {
  if (req.session && req.session.loggedIn) {
    req.session.destroy((error) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(200).json({ message: "logged out successfully" });
      }
    });
  } else {
    res.status(200).json({ message: "you were not logged in" });
  }
});

module.exports = router;
