const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { pool } = require('../Services/mysql');
const process = require('node:process');

const createUser = async (req, res) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const username = req.body.username;
  const adress = req.body.adress;
  const password = req.body.password;
  const userRole = req.body.user_role;

  const gdpr = req.body.gdpr; // new Date();
  const created_at = new Date();
  const updated_at = new Date();
  try {
    if (
      !first_name ||
      !last_name ||
      !email ||
      !username ||
      !adress ||
      !password ||
      !gdpr
    ) {
      res.status(400).json({ error: 'Some fields are missing' });
      return;
    }

    const sql_verification = `SELECT * FROM user WHERE email = ?`;
    const values_verification = [email];
    const [verification] = await pool.execute(
      sql_verification,
      values_verification
    );

    if (verification.length !== 0) {
      res
        .status(400)
        .json({ error: 'invalid credentials (mail aldeady used)' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [resultRole] = await pool.execute(
      `SELECT * FROM role WHERE role_name = 'customer'`
      // [userRole]
    );
    console.log(resultRole);

    const sqlUser = `INSERT INTO user (fk_role_id, first_name, last_name, email, username, adress, password, gdpr, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const valuesUser = [
      resultRole[0].id,
      first_name,
      last_name,
      email,
      username,
      adress,
      hashedPassword,
      new Date(),
      created_at,
      updated_at,
    ];

    const [resultUser] = await pool.execute(sqlUser, valuesUser);

    if (resultUser.affectedRows !== 1) {
      res.status(400).json({ error: 'something went wrong' });
      return;
    }
    res.status(201).json({ result: resultUser });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const readUser = async (req, res) => {
  const identifier = req.body.identifier;
  const password = req.body.password;

  try {
    if (!identifier || !password) {
      res.status(400).json({ error: 'Some fields are missing' });
      return;
    }

    const sql_verification = `SELECT user.*, role.role_name FROM user JOIN role ON user.fk_role_id = role.id WHERE user.email = ? OR user.username = ?`;
    const values_verification = [identifier, identifier];

    const [resultUser] = await pool.execute(
      sql_verification,
      values_verification
    );

    const isValidPasswod = await bcrypt.compare(
      password,
      resultUser[0].password
    );

    if (!isValidPasswod) {
      res.status(401).json({ error: 'Wrong credentials' });
      return;
    }
    const token = jwt.sign(
      {
        user_id: resultUser[0].id,
        user_role: resultUser[0].role_name,
      },
      process.env.MYSQL_USER,
      { expiresIn: '12h' }
    );

    res.status(200).json({ result: token });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

// const readAllUser

// const updateUser

// const deleteUser

module.exports = { createUser, readUser };
