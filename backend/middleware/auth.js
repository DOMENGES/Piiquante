const jwt = require('jsonwebtoken');
// middelware qui permet d'extraire les infos contenues ds le token
// de vérifier que le token est valide
// et transmettre les infos aux autres middlewares ou aux gestionnaires de routes
module.exports = (req, res, next) => {
    try {
        // récupération du header et diviser la chaîne de caractère
        // en un tableau autour de l'espace qui se trouve entre le
        // mot-clé bearer et le token et c'est le token qui est en
        // en 2ème que l'on veut récupérer
        const token = req.headers.authorization.split(' ')[1];
        // décoder le token avec méthode verify du token et de la clé secrète
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // récupération d'userId
        const userId = decodedToken.userId;
        // ajout de la valeur du userId à l'objet req qui est transmis
        // aux routes qui vont être appelées par la suite
        req.auth = {
            userId: userId
        };
    } catch(error) {
        res.status(401).json({ error });
    }
};