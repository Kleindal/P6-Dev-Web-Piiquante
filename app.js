const express = require('express')
const app = express()
const path = require('path');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

const mongoose = require('mongoose');
mongoose
  // .connect('mongodb://localhost:27017/piiquante')
  .connect('mongodb+srv://kanou:38uejd21cRG89Kfx@cluster0.khqpu.mongodb.net/Piiquante?retryWrites=true&w=majority')
  .then(() => console.log('Connection à MongoDB réussie !'))
  .catch(() => console.log('Connection à MongoDB échouée !'))

const userRouter = require('./routes/user');
const saucesRouter = require('./routes/sauces.js');

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRouter);
app.use('/api/sauces', saucesRouter);


module.exports = app;



// app.post('/api/sauces', (req, res, next) => {
//   delete req.body._id;
//   const sauces = new sauces({
//     ...req.body
//   });
//   sauces.save()
//     .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
//     .catch(() => res.status(400).json({ error }));
// });

// app.get('/api/sauces/:id', (req, res, next) => {
//   Sauces.findOne({ _id: req.params.id })
//     .then(sauces => res.status(200).json(sauces))
//     .catch(error => res.status(404).json({ error }));
// });

// app.use('/api/sauces', (req, res, next) => {
//   Sauces.find()
//     .then(sauces => res.status(200).json(sauces))
//     .catch(error => res.status(404).json({ error }));
// });
