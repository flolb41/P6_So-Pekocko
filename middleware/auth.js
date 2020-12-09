/**
 * Importation de jsonwebtoken
 */
const jwt = require('jsonwebtoken');

/**
 * Partie métier servant à authentifier les routes à sécuriser 
 * en fonction de l'user
 * On vérifie si les données codées correspondent
 */
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};