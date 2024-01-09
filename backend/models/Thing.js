const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
    // identifiant MongoDB unique de l'utilisateur qui a créé la sauce
    userId : {type:String, required : true},
    // nom de la sauce
    name : {type:String, required : true},
    // fabricant de la sauce
    manufacturer : {type:String, required : true},
    // description de la sauce
    description : {type:String, required : true},
    // le principal ingrédient épicé de la sauce
    mainPepper :  {type:String, required : true},
    // l'URL de l'image de la sauce téléchargée par l'utilisateur
    imageUrl :  {type:String, required : true},
    // nombre entre 1 et 10 décrivant la sauce
    heat : {type : Number, required : true},
    // nombre d'utilisateurs qui aiment (= likent) la sauce
    likes : {type : Number, required : true},
    // nombre d'utilisateurs qui n'aiment pas (= dislike) la sauce
    dislikes : {type : Number, required : true},
    // tableau des identifiants des utilisateurs 
    // qui ont aimé (= liked) la sauce 
    usersLiked : [ "String <userId>" ],
    // tableau des identifiants des utilisateurs 
    // qui n'ont pas aimé (= disliked) la sauce
    usersDisliked : [ "String <userId>" ],
})

module.exports = mongoose.model('Thing', thingSchema);