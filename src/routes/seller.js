const express = require('express');

const router = express.Router();

router.get('/read_all_products', readAllProducts);
router.get('/read_my_rentings', verifyToken, readMyRentings);
router.get('/read_my_payments', verifyToken, readMyPayments);
router.post('/create_renting', verifyToken, createRenting);
// TODO: ajouter une table ticket à la base de donnée, que les Sellers peuvent accéder pour voir les demandes des clients.

router.post('/create_ticket', verifyToken, createTicket);
router.patch('/update_renting_date', verifyToken, updateRentingDate);
router.patch('/update_payment_status', verifyToken, updatePaymentStatus);
// TODO: ajouter un delete account, un cancel renting, etc... (avec autorisation j'imagine)

module.exports = router;
