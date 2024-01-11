const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// interactions express avec la base de données MongoDB
const mongoose = require('mongoose');
// importation pour accéder au path du serveur
// pour traiter les req vers la route /images
const path = require('path');



// connection app avec base donnée
mongoose.connect('mongodb+srv://Scorsese:Holbein1533@clusterpiiquante.44b649p.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const app = express();
  

// headers spécifiques de contrôle d'accès à l'api sans pb
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use(express.json());

// déclaration des middlewares routes
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

// route images qui sert des fichiers statiques
// indique à Express qu'il faut gérer la ressource images 
// de manière statique (un sous-répertoire de notre répertoire de base, __dirname) 
// à chaque fois qu'elle reçoit une req vers la route /images
app.use('/images', express.static(path.join(__dirname, 'images')));
// enregistrement des middlewares routes dans une route unique
app.use('/api/sauces', saucesRoutes);
// auth : racine de ttes les routes liées à l'authentification
app.use('/api/auth', userRoutes);



// CORS
app.use(cors());

app.use(bodyParser.json());

  
  module.exports = app;