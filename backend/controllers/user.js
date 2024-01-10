
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// enregistrement nouveaux utilisateurs
exports.signup = (req, res, next) => {
    // fonction pour crypter(hasher) le mdp
    bcrypt.hash(req.body.password, 10)
    // enregistrement de l'utilisateur dans la Bdd
    .then(hash =>{
        // création utilisateur avec le modèle mongoose
        const user = new User({
            // email récupéré dans le corps de la requête
            email: req.body.email,
            // enregistrement du mdp crypté
            password: hash
        });
        // enregistrement dans la Bdd
        user.save()
            // 201 : création de ressource
            .then(() => res.status(201).json({ message: 'utilisateur créé'}))
            .catch(error => res.status(400).json({ error }));
    })
    // 500 : erreur serveur
    .catch(error => res.status(500).json({ error }));

};

// fonction qui permet de vérifier si l'utilisateur
// existe dans la Bdd
// et
// vérification de mdp transmis correspond au mdp de la Bdd
exports.login = (req, res, next) => {
    // méthode de la classe User qui sert de filtre(sélecteur)
    // avec le champ email dont la valeur est transmise
    // par l'utilisateur
    User.findOne({email: req.body.email})
    // promesse retournée par findOne 
    // valeur retournée par la requête
    // utilisateur a-t-il bien été trouvé ?
    .then(user => {
        // Si valeur n'existe pas alors utilisateur n'existe pas ds la Bdd
        if (user===null) {
            res.status(401).json({message:'Paire identifiant/mot de passe incorrecte'})
        } else {
            // utilisateur bien enregistré dans la Bdd
            // comparaison mdp transmis par l'utilisateur (req.body...)
            // avec du mdp de la Bdd (user.password)
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                // le mdp est invalide(incorrect)
                if(!valid){
                    res.status(401).json({message:'Paire identifiant/mot de passe incorrecte'})
                } 
                    
                else{
                    // res code 200 et objet
                    res.status(200).json({
                        // infos nécessaires à l'authentification des req
                        // émises par la suite par l'utilisateur(client)
                        userId: user._id,
                        // token pour authentifier les req
                        token: jwt.sign(
                            { userId: user._id},
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h'}
                        )
                    });
                }

            })
            // erreur d'exécution de la requête dans la Bdd
            // Non Pas erreur si chp non trouvé dans la Bdd càd
            // lorsque l'utilisateur n'existe pas.
            .catch(error =>
                res.status(500).json({error}));
        }
    })
    .catch(error => {
        res.status(500).json({error});
    })
};