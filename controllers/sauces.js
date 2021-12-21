const Sauce = require('../models/Sauce');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  console.log(sauceObject);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
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

exports.modifySauce = (req, res, next) => {
  const sauce = req.file? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  }: {
    ...req.body
  };

  Sauce.updateOne({_id: req.params.id}, {_id: req.params.id, ...sauce}).then(
    () => {
      res.status(200).json({
        message: 'Sauce updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id}).then(
    (sauce) => {
      if (!sauce) {
        return res.status(404).json ({
          error: new Error('Sauce introuvable...')
        });
      }
      if (sauce.userId !== req.userId) {
        return res.status(403).json ({
          error: new Error('Requête non autorisé...')
        });
      }
    }
  )
  Sauce.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};


exports.likeSauce = async (req, res, next) => {
  const likeValue = req.body.like;
  const userId = req.userId;

  const sauce = await Sauce.findOne({_id: req.params.id})
    .then(sauce => sauce._doc)
    .catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );

  try {
    switch (likeValue) {
      case 1:
        sauce.likes = sauce.likes + likeValue;
        if (sauce.usersLiked.indexOf(userId) !== -1) {
          throw new Error('You already liked this sauce');
        }
        sauce.usersLiked.push(userId);
        break;
      case 0:
        const indexUserLiked = sauce.usersLiked.indexOf(userId);
        const indexUserDisliked = sauce.usersDisliked.indexOf(userId);
        if (indexUserLiked !== -1) {
          delete sauce.usersLiked[indexUserLiked];
          sauce.likes = sauce.likes - 1;
        } else if (indexUserDisliked !== -1) {
          delete sauce.usersDisliked[indexUserDisliked];
          sauce.dislikes = sauce.dislikes + 1;
        }
        break;
      case -1:
        sauce.dislikes = sauce.dislikes + likeValue;
        if (sauce.usersDisliked.indexOf(userId) !== -1) {
          throw new Error('You already disliked this sauce');
        }
        sauce.usersDisliked.push(userId);
        break;
      default:
        throw new Error('This likeValue is not managed');
    }
  } catch(error) {
    res.status(400).json({
      error: error.message
    });
  }

  Sauce.updateOne({_id: req.params.id}, {_id: req.params.id, ...sauce}).then(
    () => {
      res.status(200).json({
        message: 'Sauce updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error
      });
    }
  );
};
