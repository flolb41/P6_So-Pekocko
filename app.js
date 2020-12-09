/**
 * Importation des éléments servant à créer l'Api
 */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const baseDonnee = require('./environementSample');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');

/**
 * Adresse de connection à la base de données MongoDb Atlas
 */
mongoose.connect('mongodb+srv://' + baseDonnee.userName + ':' + baseDonnee.pwdAtlas + '@cluster0.i2v09.mongodb.net/Cluster0?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  /**
 * Création d'un premier 'aiguillage' des routes avec les headers 
 * qui autorisent ou non certaines requetes
 */
const app = express();

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;