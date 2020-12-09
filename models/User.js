/**
 * Importation de Mangoose et unique validator
 * Ici nous créons un schéma pour ajouter un nouvel User
 * Subtilité ici avec unique validator
 * En effet nous vérifions ici que la méme adresse mail 
 * ne puisse pas servir plusieurs fois 
 */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    userId: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);