const express = require('express');
const { updatePassword } = require('../Controllers/ctrlUser');

const {
  createRenting,
  readMyRenting,
  updateRenting,
} = require('../Controllers/ctrlRenting');
const {
  createPayment,
  updatePaymentStatus,
} = require('../Controllers/ctrlPayment');

const router = express.Router();

// TODO: ajouter une table ticket à la base de donnée, que les Sellers peuvent accéder pour voir les demandes des clients.

router.route('/edit/password').post(updatePassword);
// TODO: faire de l'emailing (voir index.js)
router.route('/add/renting/:computer_id').post(createRenting);
router.route('/read/my_rentings').get(readMyRenting);
router.route('/update/renting').patch(updateRenting);
// router.route('/delete/renting').delete( deleteRenting)
router.route('/add/payment/:fk_renting_id').post(createPayment);
router.route('/update/payment/:payment_id').patch(updatePaymentStatus);

module.exports = router;
