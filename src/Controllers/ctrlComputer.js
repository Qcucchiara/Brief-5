require('dotenv').config();
const { pool } = require('../Services/mysql');
// const process = require('node:process');

const createComputer = async (req, res) => {
  try {
    const name = req.body.name;
    const brand = req.body.brand;
    const memory = req.body.memory;
    const storage = req.body.storage;
    const processor = req.body.processor;
    const graphic_card = req.body.graphic_card;
    const usb = req.body.usb;
    const hdmi = req.body.hdmi;
    const wifi = req.body.wifi;
    const laptop = req.body.laptop;
    const curent_stock = '0';
    const created_at = new Date();
    const updated_at = new Date();

    if (
      !name ||
      !brand ||
      !memory ||
      !storage ||
      !processor ||
      !graphic_card ||
      !usb ||
      !hdmi ||
      !wifi ||
      !laptop
    ) {
      res.status(400).json({ error: 'Some fields are missing' });
      return;
    }

    const sql = `INSERT INTO computer VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      name,
      brand,
      memory,
      storage,
      processor,
      graphic_card,
      usb,
      hdmi,
      wifi,
      laptop,
      curent_stock,
      created_at,
      updated_at,
    ];
    // eslint-disable-next-line no-unused-vars
    const [result] = await pool.execute(sql, values);

    res.status(201).json({ result: 'product created' });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const readAllComputer = async (req, res) => {
  try {
    const [result] = await pool.execute(
      `SELECT *, BIN_TO_UUID(id) computer_id FROM computer`
    );
    res.status(200).json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const updateComputer = async (req, res) => {
  // var strings = ['a', 'b', 'c'];
  // console.log(strings.join(', '));
  try {
    const computer_id = req.params.computer_id;
    const name = req.body.name;
    const brand = req.body.brand;
    const memory = req.body.memory;
    const storage = req.body.storage;
    const processor = req.body.processor;
    const graphic_card = req.body.graphic_card;
    const usb = req.body.usb;
    const hdmi = req.body.hdmi;
    const wifi = req.body.wifi;
    const laptop = req.body.laptop;

    const allValues = [
      name,
      brand,
      memory,
      storage,
      processor,
      graphic_card,
      usb,
      hdmi,
      wifi,
      laptop,
    ];
    let allNewValues = [];

    const allSQL = [];

    allValues.forEach((element) => {
      if (element !== '') {
        allNewValues.push(element);
      }
    });

    if (name !== '') allSQL.push('name = ?');
    if (brand !== '') allSQL.push('brand = ?');
    if (memory !== '') allSQL.push('memory = ?');
    if (storage !== '') allSQL.push('storage = ?');
    if (processor !== '') allSQL.push('processor = ?');
    if (graphic_card !== '') allSQL.push('graphic_card = ?');
    if (usb !== '') allSQL.push('usb = ?');
    if (hdmi !== '') allSQL.push('hdmi = ?');
    if (wifi !== '') allSQL.push('wifi = ?');
    if (laptop !== '') allSQL.push('laptop = ?');

    let sql = `UPDATE computer SET ${allSQL.join(
      ', '
    )} WHERE id = UUID_TO_BIN(?)`;
    allNewValues.push(computer_id);
    console.log(sql);
    console.log(allNewValues);
    // eslint-disable-next-line no-unused-vars
    const [result] = await pool.execute(sql, allNewValues);

    res.status(200).json({ result: 'product updated' });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const deleteComputer = async (req, res) => {
  try {
    const computer_id = req.params.computer_id;

    const sql = `DELETE FROM computer WHERE id = UUID_TO_BIN(?)`;
    const [result] = await pool.execute(sql, [computer_id]);

    if (result.affectedRows !== 1) {
      res.status(418).json({ result: "le produit n'existe pas" });
      return;
    }
    res.status(200).json({ result: 'product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

module.exports = {
  createComputer,
  readAllComputer,
  updateComputer,
  deleteComputer,
};
