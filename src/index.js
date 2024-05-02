const express = require('express');
const app = express();
const cors = require('cors');
const process = require('node:process');

require('dotenv').config();

const { isAdmin, isSeller, isCustomer } = require('./Middlewares/verifyRole');

const routeGuest = require('./routes/guest');
const routesCustomer = require('./routes/customer');
const routesSeller = require('./routes/seller');
const routesAdmin = require('./routes/admin');

app.use(express.json());
app.use(cors());

app.use('/api/guest', routeGuest);
app.use('/api/customer', isCustomer, routesCustomer);
app.use('/api/seller', isSeller, routesSeller);
app.use('/api/admin', isAdmin, routesAdmin);

app.listen(process.env.PORT, () => {
  console.log('im listening on port', process.env.PORT);
});

// TODO: ajouter une table ticket à la base de donnée, que les Sellers peuvent accéder pour voir les demandes des clients.
// TODO: ajouter un delete account, un cancel renting, etc... (avec autorisation j'imagine)
// TODO: hasher le rôle dans le localstorage pour pas montrer les attributions
// TODO: ajouter une erreur 'connexion expiré, reconnectez vous'
// TODO: faire un middleware login qui s'exécute a chaque action de l'utilisateur, qui permet d'actualiser le token en localstorage
// TODO: nodemailer npm + nodemailer app
// TODO: emailing pour valider la création du compte
// TODO: emailing pour réinitialiser son mot de passe
// TODO: une sorte de login mais en middleware qui se met entre chaque action d'utilsateurs.
// TODO: faire le middleware validator pour vérifier la syntaxe de par exemple l'email, le mot de passe, le nom ...
