require('dotenv').config();
const { pool } = require('../Services/mysql');
// const process = require('node:process');

const createRenting = async (req, res) => {
  try {
    const fk_customer_id = req.fk_customer_id;
    const fk_computer_id = req.params.computer_id;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const created_at = new Date();
    const updated_at = new Date();

    if (!start_date || !end_date) {
      res.status(400).json({ error: 'missing values' });
    }

    const sql = `INSERT INTO renting (id, fk_customer_id, fk_computer_id, start_date, end_date, created_at, updated_at) VALUES ( UUID(), UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?, ?)`;

    const values = [
      fk_customer_id,
      fk_computer_id,
      start_date,
      end_date,
      created_at,
      updated_at,
    ];

    // eslint-disable-next-line no-unused-vars
    const [result] = await pool.execute(sql, values);

    res.status(201).json({ result: 'renting created' });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const readMyRenting = async (req, res) => {
  try {
    const customer_id = req.fk_customer_id;
    const [result] = await pool.execute(
      `SELECT BIN_TO_UUID(id), BIN_TO_UUID(fk_customer_id), BIN_TO_UUID(fk_seller_id), BIN_TO_UUID(fk_computer_id), start_date, end_date, return_status, created_at, updated_at FROM renting WHERE fk_customer_id = UUID_TO_BIN(?)`,
      [customer_id]
    );
    res.status(200).json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const readAllRenting = async (req, res) => {
  try {
    const [result] = await pool.execute(
      `SELECT BIN_TO_UUID(id), BIN_TO_UUID(fk_customer_id), BIN_TO_UUID(fk_seller_id), BIN_TO_UUID(fk_computer_id), start_date, end_date, return_status, created_at, updated_at FROM renting WHERE fk_customer_id = ?`
    );
    res.status(200).json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const updateRenting = async (req, res) => {
  try {
    const renting_id = req.params.renting_id;
    const fk_computer_id = req.body.fk_computer_id;
    const end_date = req.body.end_date;
    const updated_at = new Date();

    let fk_customer_id = '';
    if (fk_seller_id !== '') fk_customer_id = req.fk_customer_id;

    let fk_seller_id = '';
    if (fk_seller_id !== '') fk_seller_id = req.fk_seller_id;

    const allValues = [
      renting_id,
      fk_customer_id,
      fk_seller_id,
      fk_computer_id,
      end_date,
      updated_at,
    ];
    let allNewValues = [];

    const allSQL = [];

    allValues.forEach((element) => {
      if (element !== '') {
        allNewValues.push(element);
      }
    });

    if (renting_id !== '') allSQL.push('renting_id = ?');
    if (fk_customer_id !== '') allSQL.push('fk_customer_id = ?');
    if (fk_seller_id !== '') allSQL.push('fk_seller_id = ?');
    if (fk_computer_id !== '') allSQL.push('fk_computer_id = ?');
    if (end_date !== '') allSQL.push('end_date = ?');
    if (updated_at !== '') allSQL.push('updated_at = ?');

    let sql = `UPDATE renting SET ${allSQL.join(
      ', '
    )} WHERE id = UUID_TO_BIN(?)`;
    allNewValues.push(renting_id);
    console.log(sql);
    console.log(allNewValues);
    // eslint-disable-next-line no-unused-vars
    const [result] = await pool.execute(sql, allNewValues);
    res.status(200).json({ result: 'renting updated' });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

// const deleteRenting = async (req, res) => {
// quand l'élément est supprimé, changer le stock dans 'computer'
// la fonction doit aussi être exécuté quand la date de fin de renting est atteinte.
// };

module.exports = {
  createRenting,
  readMyRenting,
  readAllRenting,
  updateRenting,
  // deleteRenting,
};
