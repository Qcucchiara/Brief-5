const express = require('express');
const app = express();
const cors = require('cors');
const process = require('node:process');

require('dotenv').config();

const routeGuest = require('./routes/guest');
// const routeCustomer = require('./routes/customer');
// const routeSeller = require('./routes/seller');
// const routeAdmin = require('./routes/admin');

app.use(express.json());
app.use(cors());

app.use('/api/guest', routeGuest);
// app.use('/api/customer', routeCustomer);
// app.use('/api/seller', routeSeller);
// app.use('/api/admin', routeAdmin);

app.listen(process.env.PORT, () => {
  console.log('im listening on port', process.env.PORT);
});
