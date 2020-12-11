/** 
 * Importation des données requises
 */ 
const Sauce = require('../models/sauce');
const fs = require('fs');
const sauce = require('../models/sauce');

/** 
 * Partie métier servant à créer une sauce.
 * On récupère dnas un objet les données reçues dans la requete
 * On intègre cet objet à notre schéma pour le normaliser
 * On normalise le nom de fichier de l'image, on traite l'ID
 * Enfin on sauvegarde la nouvelle sauce créée
 */
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({ 
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes : 0
  });
  userId = req.body._id;
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

/** 
 * Partie métier servant à modifier une sauce
 * On récupère la nouvelle requete
 * puis on met à jour (updateOne) la sauce en question
 */
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

/** 
 * Partie métier servant à supprimer une sauce
 * On recherche la sauce par rapport a son Id
 * On récupère également son image
 * Puis à l'aide de fs.unlink() on supprime l'image puis la sauce
 * à l'aide de (deleteOne) 
 */
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

/** 
 * Partie métier servant à récupérer une seule sauce
 * A l'aide (findOne) et de l'id on renvoie un json correspondant
 * à une sauce en particulier
 */
  exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })  
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error })); 
};

/** 
 * Partie métier servant à récupérer toutes les sauces
 * Ici, on applique (find) sans paramètre, pour récupérer 
 * toutes les sauces
 */
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
  };
  
/** 
 * Partie métier servant à gérer les likes, dislikes ou neutre
 * Le premier 'if' correspond à l'ajout d'un like
 * On met a jour la sauce en fonction de son Id 
 * On ajoute (push) l'userId dans le tableau usersLiked et on incrémente
 * de 1 le total de likes
 * idem pour le second 'if'
 * Pour le dernier il faut s'assurer qu'en repassant à un avis neutre 
 * l'userId ne soit ni dans les likes ni dans les dislikes et si 
 * on le trouve dans l'un ou l'autre on le supprime et on retire un 
 * likes ou un dislikes
 */
exports.likestatus = (req, res, next) => {
  likes = 0;
  dislikes = 0;
  const userId = req.body.userId; 
  const reqLike = req.body.like;
  const sauceId = req.params.id;
    Sauce.findOne({_id: sauceId}) 
      .then((sauce) => {
          sauce.usersLiked = sauce.usersLiked.filter(item => item !== userId);
          sauce.usersDisliked = sauce.usersDisliked.filter(item => item !== userId);
          if (reqLike === 1) {sauce.usersLiked.push(userId)};
          if (reqLike === -1) {sauce.usersDisliked.push(userId)};
          sauce.likes = sauce.usersLiked.length;
          sauce.dislikes = sauce.usersDisliked.length;
          sauce.save()
            .then(() => res.status(200).json({ message: 'Sauce Sauvegardée !'}))
            .catch(error => res.status(400).json({ message : 'sauce non sauvegardée !' }));
      })
      .catch(error => res.status(500).json({ message : 'Problème base de donnée !' }));
};