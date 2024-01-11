const Thing = require('../models/Thing');
// « file system » (« système de fichiers »). 
// Il nous donne accès aux fonctions qui nous permettent 
// de modifier le système de fichiers, 
// y compris aux fonctions permettant de supprimer les fichiers
const fs = require('fs');

// le format est modifié par multer(ds fichier route)
exports.createThing = (req, res, next) => {
    // traduction du format en JSON
    const thingObject = JSON.parse(req.body.sauce);
    // suppression du champ _id (id généré automatiquement par la Bdd)
    delete thingObject._id;
    // suppression du champ _userId (personne qui a créé l'objet)
    delete thingObject._userId;
// création instance sauce
    const thing = new Thing({
      ...thingObject,
      // userId extrait du token par le middleware d’authentification
      userId: req.auth.userId,
      // création de l'url image avec son nom créé par multer
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filnename}`
    });
// enregistrement ds la Bdd avec code réussite et erreur
    thing.save()
    .then(()=> { res.status(201).json({message: 'Objet enregistré'})})
    .catch(error => { res.status(400).json( {error})})
};

exports.getOneThing = (req, res, next) => {
  Thing.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyThing = (req, res, next) => {
  // l'objet créé a-t-il un nom(un champ file) ?
  const thingObject = req.file ? {
      // Si l'objet a un nom on parse la chaîne de caractère
      ...JSON.parse(req.body.thing),
      // Création de l'url de l'image
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      // l'objet n'a pas de nom càd qu'il n'est pas créé(modifié)
      // récupération de l'objet directement ds le corps de la req
    } : { ...req.body };
  
  // supression de du _userId de la req
  delete thingObject._userId;
    // recherche de l'objet ds la Bdd
    Thing.findOne({_id: req.params.id})
      // objet est ds la Bdd
      // vérification que l'objet appartient bien 
      // à l'utilisateur qui envoie la req de modification
      .then((thing) => {
          // Si le chp userId récupéré ds la Bdd est différent
          // de l'userId qui vient du Token cela veut dire qu'un
          // autre utilisateur essaie de modifier un objet qui
          // ne lui appartient pas 
          if (thing.userId != req.auth.userId) {
              // alors erreur
              res.status(401).json({ message : 'Not authorized'});
          } else {
              // c'est le bon utilisateur
              // mise à jour de l'enregistrement
              // filtre pour trouver quel est l'enregistrement qu'il faut remettre à jour
              // et avec quel objet càd ce qui a été récupéré ds le corps de la fonction
              // avec id qui vient de l'url des paramètres
              Thing.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

// Suppression de l'objet UNIQUEMENT si c'est
// le bon utilisateur qui le demande
exports.deleteThing = (req, res, next) => {
  // vérification des droits
  // récupération de l'objet ds la Bdd
  Thing.findOne({_id: req.params.id})
  .then(thing => {
    // vérif que c'est le bon utilisateur qui
    // demande la suppression
    if (thing.userId != req.auth.userId){
      res.status(401).json ({message: 'Non-authorisé'});
      // si c'est le bon utilisateur
    } else {
      // suppression de l'image
      // récupération du nom de fichier
      const filename = thing.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`), () => {
        Thing.deleteOne({_id: req.params.id})
          .then(() => {res.status(200).json({message:'Deleted!' })})
          .catch(error => res.status(401).json({ error}));
      }
    }
  })
}

  

exports.getAllThing = (req, res, next) => {
  Thing.find().then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  )
}