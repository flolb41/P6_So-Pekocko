/**
 * Importation de Mangoose
 * Ici nous créons un schéma de sauce
 * Ce format est demandé par le client
 * Il s'agit de la structure type d'une sauce
 */
const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  id: { type: String },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: [String] },
  usersDisliked: { type: [String] }
});

module.exports = mongoose.model('Sauce', sauceSchema);