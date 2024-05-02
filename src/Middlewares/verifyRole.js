const jwt = require('jsonwebtoken');
require('dotenv').config();
const process = require('node:process');
const { pool } = require('../Services/mysql');

// j'aurais pu ne faire qu'une comparaison dans le middleware, puis laisser la gestion de restriction à un autre middleware (ou la fonction directement).
const isCustomer = async (req, res, next) => {
  try {
    const bearerWithToken = req.headers.authorization;

    const bearer = bearerWithToken.split(' ');
    const token = bearer[1];

    if (!bearer[1]) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }
    const user = jwt.verify(token, process.env.MYSQL_USER);

    const user_id = user.user_id;
    const user_role = user.user_role;

    if (user_role !== 'customer' && user_role !== 'admin') {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }

    const [searchUser] = await pool.execute(
      `SELECT user.*, BIN_TO_UUID(user.id) user_id, BIN_TO_UUID(fk_role_id) role_id, role.role_name FROM user JOIN role ON user.fk_role_id = role.id WHERE user.id = UUID_TO_BIN(?) AND role.role_name = 'customer' OR role.role_name = 'admin'`,
      [user_id]
    );

    if (!searchUser[0]) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }
    req.fk_customer_id = user_id;
    next();
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const isSeller = async (req, res, next) => {
  try {
    const bearerWithToken = req.headers.authorization;

    const bearer = bearerWithToken.split(' ');
    const token = bearer[1];

    if (!bearer[1]) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }
    const user = jwt.verify(token, process.env.MYSQL_USER);

    const user_id = user.user_id;
    const user_role = user.user_role;

    if (user_role !== 'seller' && user_role !== 'admin') {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }

    const [searchUser] = await pool.execute(
      `SELECT user.*, BIN_TO_UUID(user.id) user_id, BIN_TO_UUID(fk_role_id) role_id, role.role_name FROM user JOIN role ON user.fk_role_id = role.id WHERE user.id = UUID_TO_BIN(?) AND role.role_name = 'seller' OR role.role_name = 'admin'`,
      [user_id]
    );

    if (!searchUser[0]) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }
    req.fk_seller_id = user_id;

    next();
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const bearerWithToken = req.headers.authorization;

    const bearer = bearerWithToken.split(' ');
    const token = bearer[1];

    if (!bearer[1]) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }
    const user = jwt.verify(token, process.env.MYSQL_USER);

    const user_id = user.user_id;
    const user_role = user.user_role;

    if (user_role !== 'admin') {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }

    const [searchUser] = await pool.execute(
      `SELECT user.*, BIN_TO_UUID(user.id) user_id, BIN_TO_UUID(fk_role_id) role_id, role.role_name FROM user JOIN role ON user.fk_role_id = role.id WHERE user.id = UUID_TO_BIN(?) AND role.role_name = 'admin'`,
      [user_id]
    );

    if (!searchUser[0]) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }

    req.fk_admin_id = user_id;
    next();
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

module.exports = { isCustomer, isSeller, isAdmin };
