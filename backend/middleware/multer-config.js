// middleware qui confifure multer pour lui expliquer comment
// gérer les fichiers
// où les enregistrer
// quel nom de fichier leur donner
const multer = require('multer');

// objet : dictionnaire extension de fichier
// traduction des noms de fichiers du front-end
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// création d'un objet de configuration pour multer
// enregistré sur le disque
const storage = multer.diskStorage({
    // fonction qui explique à multer dans quel dossier
    // enregistrer les fichiers
    destination: (req, file, callback) => { 
        // les images doivent être enregistrées dans le
        // dossier images du backend
        callback(null, 'images')
    },
    // quel nom à donner au fichier image
    filename: (req, file, callback) => {
        // remplacer les espaces par _
        const name = file.originalname.split(' ').join('_');
        // élément du dictionnaire qui correspond au mimetype
        // envoyé par le frontend
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');