const db = require("../database/connection.js");

module.exports = {
  add,
  find,
  findByUsername,
  findById,
};

function find() {
  return db("users").select("id", "username", "password").orderBy("id");
}

function findByUsername(username, password) {
  return db("users").where({ username: username }).orderBy("id");
}

async function add(user) {
  try {
    const [id] = await db("users").insert(user, "id");

    return findById(id);
  } catch (error) {
    throw error;
  }
}

function findById(id) {
  return db("users").where({ id }).first();
}
