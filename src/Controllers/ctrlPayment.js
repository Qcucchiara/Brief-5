require('dotenv').config();
const { pool } = require('../Services/mysql');
// const process = require('node:process');

const createPayment = async (req, res) => {
  try {
    const fk_renting_id = req.params.fk_renting_id;
    const date = req.body.date;
    const price = req.body.price;
    // const description = req.body.description;
    const is_paid = req.body.is_paid;
    const created_at = new Date();
    const updated_at = new Date();

    if (!fk_renting_id || !date || !price || !is_paid) {
      res.status(400).json({ error: 'missing something' });
      return;
    }

    const sql = `INSERT INTO payment (id, fk_renting_id, date, price, created_at, updated_at, is_paid) VALUES (UUID(), UUID_TO_BIN(?), ?, ?, ?, ?, ?)`;
    const values = [
      fk_renting_id,
      date,
      price,
      created_at,
      updated_at,
      is_paid,
    ];

    const [result] = await pool.execute(sql, values);

    res.status(201).json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const payment_id = req.params.payment_id;
    const sql = `UPDATE payment SET is_paid = 1 WHERE id = UUID_TO_BIN(?)`;
    const value = [payment_id];

    // eslint-disable-next-line no-unused-vars
    const [result] = await pool.execute(sql, value);

    res.status(200).json({ result: 'payment done' });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

module.exports = { createPayment, updatePaymentStatus };
