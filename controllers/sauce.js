const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({ 
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  userId = req.body._id;
  console.log(sauce);
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

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

  exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })  
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error })); 
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
  };
  
exports.likestatus = (req, res, next) => {
  const userId = req.body.userId; 
  const reqLike = req.body.like;
  if (reqLike === 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      { $push: { usersLiked: userId }, 
        $inc: { likes: 1 } 
      })
      .then(() => res.status(200).json({ message: " Sauce aimée !" }))
      .catch((error) => res.status(400).json({ error }));
  }
  if (reqLike === -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      { $push: { usersDisliked: userId }, 
        $inc: { dislikes: 1} 
      })
      .then(() => res.status(200).json({message: " Sauce non aimée !",}))
      .catch((error) => res.status(404).json({ error }));
  }
  if (reqLike === 0) {
    const sauceId = req.params.id;
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            { $pull: { usersLiked: userId }, 
              $inc: { likes: -1 } 
            })
            .then(() => res.status(200).json({ message: "Like retiré !" }))
            .catch((error) => res.status(400).json({ error }));
        }
        if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            { $pull: { usersDisliked: userId }, 
              $inc: { dislikes: -1 }
            })
            .then(() => res.status(200).json({ message: "Dislike retiré !" }))
            .catch((error) => res.status(400).json({ error }));
        }
      })
    .catch(error => res.status(400).json({ error }));
  }
};
