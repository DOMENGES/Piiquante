const express = require('express');
const bodyParser = require('body-parser');
// interactions express avec la base de données MongoDB
const mongoose = require('mongoose');
const path = require('path');

// déclaration des middlewares routes
const stuffRoutes = require('./routes/stuffs');
const userRoutes = require('./routes/user');

// connection app avec base donnée
mongoose.connect('mongodb+srv://Scorsese:Holbein1533@clusterpiiquante.44b649p.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json());

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://:localhost:4200');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use(bodyParser.json());

  // enregistrement des middlewares routes dans une route unique
  app.use('/api/stuff', stuffRoutes);
  app.use('/api/auth', userRoutes);
  app.use('/images', express.static(path.join(__dirname, 'images')))

  module.exports = app;

