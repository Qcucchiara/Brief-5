const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { pool } = require('../Services/mysql');
const process = require('node:process');
const { transporter } = require('../Services/mailer');

const createUser = async (req, res) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const username = req.body.username;
  const adress = req.body.adress;
  const password = req.body.password;
  // const userRole = req.body.user_role;

  let gdpr = req.body.gdpr;
  if (gdpr) {
    gdpr = new Date();
  }
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

    // const sql_verification = `SELECT * FROM user WHERE email = ?`;
    // const values_verification = [email];
    // const [verification] = await pool.execute(
    //   sql_verification,
    //   values_verification
    // );

    // if (verification.length !== 0) {
    //   res
    //     .status(400)
    //     .json({ error: 'invalid credentials (mail aldeady used)' });
    //   return;
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [resultRole] = await pool.execute(
      `SELECT * FROM role WHERE role_name = 'customer'`
    );

    const activationToken = await bcrypt.hash(email, 10);
    const cleanToken = activationToken.replaceAll('/', '');
    console.log({ activationToken: activationToken, cleanToken: cleanToken });

    const sqlUser = `INSERT INTO user VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const valuesUser = [
      resultRole[0].id,
      first_name,
      last_name,
      email,
      username,
      adress,
      hashedPassword,
      0,
      cleanToken,
      new Date(),
      created_at,
      updated_at,
    ];

    const [resultUser] = await pool.execute(sqlUser, valuesUser);
    console.log(resultUser);

    if (resultUser.affectedRows !== 1) {
      res.status(400).json({ error: 'something went wrong' });
      return;
    }

    const info = await transporter.sendMail({
      from: `${process.env.SMTP_EMAIL}`,
      to: email,
      subject: 'email activation ✔',
      text: 'activate your email',
      html: `<b>click here to <a href = "http://localhost:3000/api/guest/valide/user/${cleanToken}">activate you account</a></b>`,
    });
    console.log('Message sent: %s', info.messageId);
    res.status(201).json(`Message send with the id ${info.messageId}`);
    // res.status(201).json({ success: 'account created' });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const valideAccount = async (req, res) => {
  try {
    const token = req.params.token;
    const sql = `SELECT * FROM user WHERE token = ?`;
    const values = [token];
    const [result] = await pool.execute(sql, values);
    if (!result) {
      res.status(204).json({ error: 'g pa trouvé' });
      return;
    }
    await pool.execute(
      `UPDATE user SET is_active = 1, token = NULL WHERE token = ?`,
      [token]
    );
    res.status(200).json({ result: 'c validé' });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const readUser = async (req, res) => {
  try {
    const identifier = req.body.identifier;
    const password = req.body.password;
    if (!identifier || !password) {
      res.status(400).json({ error: 'Some fields are missing' });
      return;
    }

    const sql_verification = `SELECT BIN_TO_UUID(user.id) id, user.password, role.role_name FROM user JOIN role ON user.fk_role_id = role.id WHERE user.email = ? OR user.username = ? AND is_active = true`;
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
      res
        .status(401)
        .json({ error: 'Wrong credentials or account not activated' });
      return;
    }
    let getExpirationByRole = {};
    if (resultUser[0].role_name === 'customer') {
      getExpirationByRole = { expiresIn: '12h' };
    } else if (resultUser[0].role_name === 'seller') {
      getExpirationByRole = { expiresIn: '2h' };
    } else if (resultUser[0].role_name === 'admin') {
      getExpirationByRole = { expiresIn: '15m' };
    }

    console.log(getExpirationByRole);
    const token = jwt.sign(
      {
        user_id: resultUser[0].id,
        user_role: resultUser[0].role_name,
      },
      process.env.MYSQL_USER,
      getExpirationByRole
    );

    res.status(200).json({ result: token });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const readAllUser = async (req, res) => {
  try {
    const [result] = await pool.execute(
      `SELECT BIN_TO_UUID(user.id) id, role.role_name FROM user JOIN role ON user.fk_role_id = role.id`
    );
    res.status(200).json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const updateUser = async (req, res) => {
  try {
    const userIsValide = await pool.execute(`SELECT * FROM user WHERE id = ?`, [
      req.fromMiddleware.user_id,
    ]);
    if (!userIsValide || req.fromMiddleware.role !== 'admin') {
      res.status(400).json({ error: 'unauthorized' });
      return;
    }

    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const username = req.body.username;
    const adress = req.body.adress;
    const updated_at = new Date();
    const user_id = req.params.user_id;
    // problème de sécurité si cette fonction est utilisé par un utilisateur normal pour éditer son compte si j'utilise l'id par params.

    const sql = `UPDATE user SET first_name = ?, last_name = ?, email = ?, username = ?, adress = ?, updated_at = ? WHERE id = ?`;
    const values = [
      first_name,
      last_name,
      email,
      username,
      adress,
      updated_at,
      user_id,
    ];
    // eslint-disable-next-line no-unused-vars
    const [result] = await pool.execute(sql, values);

    res.status(200).json({ result: 'connected succesfully' });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const changeRoleUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const newRole = req.body.new_role;

    const sqlRole = `SELECT BIN_TO_UUID(id) role_id FROM role WHERE role_name = ?`;
    const valueRole = [newRole];

    const [role] = await pool.execute(sqlRole, valueRole);
    // console.log(role[0]);
    const sql = `UPDATE user SET fk_role_id = UUID_TO_BIN(?) where id = UUID_TO_BIN(?)`;
    const values = [role[0].role_id, user_id];

    console.log({ role_id: role[0].role_id, user_id: user_id });

    const [result] = await pool.execute(sql, values);
    console.log({ result: result });
    if (result.affectedRows !== 1) {
      res.status(400).json('ça a pas marché');
      return;
    }

    res.status(200).json("le role de l'utilisateur a été changé");
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const updatePassword = async (req, res) => {
  try {
    const userIsValide = await pool.execute(`SELECT * FROM user WHERE id = ?`, [
      req.fromMiddleware.user_id,
    ]);
    if (!userIsValide || req.fromMiddleware.role !== 'admin') {
      res.status(400).json({ error: 'unauthorized' });
      return;
    }

    const old_password = req.body.old_password;
    const new_password = req.body.new_password;
    const repeat_new_password = req.body.repeat_new_password;

    const [verifiedUser] = await pool.execute(
      `SELECT * FROM user WHERE password = ?`,
      [old_password]
    );

    if (!verifiedUser) {
      res.status(400).json({ error: 'wrong password' });
      return;
    } else if (new_password !== repeat_new_password) {
      res.status(400).json({ error: 'passwords not the same' });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(new_password, 10);

    const sql = `UPDATE user SET password = ? WHERE id = ?`;
    const values = [hashedNewPassword, req.fromMiddleware.user_id];
    // eslint-disable-next-line no-unused-vars
    const [result] = await pool.execute(sql, values);

    res.status(200).json({ result: 'password changed' });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

// const testEmail = async (req, res) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `${process.env.SMTP_EMAIL}`,
//       to: 'cucchiaraquentin@gmail.com',
//       subject: 'email activation ✔',
//       text: 'activate your email',
//       html: `<b>click here to <a href = "http://localhost:3000/user/activate/${token}">activate you account</a></b>`,
//     });
//     console.log('Message sent: %s', info.messageId);
//     res.status(200).json(`Message send with the id ${info.messageId}`);
//   } catch (error) {
//     res.status(500).json({ error: error.stack });
//     console.log(error.stack);
//   }
// };

// const deleteUser

module.exports = {
  createUser,
  readUser,
  readAllUser,
  changeRoleUser,
  updateUser,
  updatePassword,
  valideAccount,
};
