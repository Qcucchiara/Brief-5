const express = require('express');
const {
  createComputer,
  updateComputer,
  readAllComputer,
  deleteComputer,
} = require('../Controllers/ctrlComputer');
const { createPayment } = require('../Controllers/ctrlPayment');
const { allRentingByComputer } = require('../Controllers/ctrlComputerRenting');

const router = express.Router();

router.route('/add/computer').post(createComputer);
router.route('/add/payment').post(createPayment);
router.route('/read/computer/all').get(readAllComputer);
router.route('/update/computer/:computer_id').patch(updateComputer);
router.route('/delete/computer/:computer_id').delete(deleteComputer);
router
  .route('/read/renting/by_computer/:computer_id')
  .get(allRentingByComputer);

module.exports = router;
