const router = require("express").Router();
const bcrypt = require("bcrypt");
const Users = require("./users-model.js");

router.get("/", (req, res) => {
  if (req.session && req.session.user) {
    Users.find()
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => res.send(err));
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

router.post("/register", (req, res) => {
  let user = req.body;

  //second argument is number of rounds to create hash - helps with security
  const hash = bcrypt.hashSync(user.password, 12);

  user.password = hash;

  Users.add(user)
    .then((saved) => {
      res.status(201).json({ saved });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err });
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findByUsername(username)
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err });
    });
});

module.exports = router;
