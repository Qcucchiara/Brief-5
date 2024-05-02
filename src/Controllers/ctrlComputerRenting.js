require('dotenv').config();
const { pool } = require('../Services/mysql');
// const process = require('node:process');

const allRentingByComputer = async (req, res) => {
  try {
    const computer_id = req.params.computer_id;

    // const sql = `SELECT * FROM renting JOIN computer ON renting.fk_computer_id = computer.id WHERE computer.id = ?`;
    // la requête au dessus n'est pas utile dans le contexte, celle du bas suffit.
    const sql = `SELECT * FROM renting WHERE fk_computer_id = ?`;

    const values = [computer_id];

    const [result] = await pool.execute(sql, values);
    res.status(200).json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

module.exports = { allRentingByComputer };
