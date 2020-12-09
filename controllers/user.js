/**
 * Importations des modules et schéma requis
 */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


/**
 * Parte métier servant à créer un nouvel utilisateur
 * On récupère le corps de la requête pour créer un nouveau User grâce à notre schéma
 * Au passage on crypte le password, base de la sécurité
 */
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
              userId: req.body.userId,
              email: req.body.email,
              password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

/**
 * Partie métier servant à connecter un utilisateur enregistré
 * on vérifie donc que l'user existe bien 
 * puis on compare le password de la requête et celui créé au signup
 * si tout est ok, on attribue un token a l'user qui lui permettra d'utiliser les routes
 * de l'api
 */
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};