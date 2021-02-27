const express = require('express');
const newrelic = require('newrelic');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const path = require('path');
const cors = require('cors');

app.use(cors());
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/static', express.static(path.join(__dirname, '../src')));

const model = require('./models');

app.get('/products/:id/reviews/', (req, res) => {
  const productId = req.params.id;
  model.find(productId, (err, result) => {
    if (err) {
      res.status(400).send();
    } else {
      res.status(201).send(result);
    }
  });
});

// adding a POST endpoint to CREATE a new item in the database
app.post('/products/:id/reviews', (req, res) => {
  const productId = req.params.id;
  const reviewToCreate = {};
  reviewToCreate.productId = productId;

  if (req.body.grade !== undefined) {
    reviewToCreate.grade = req.body.grade;
  }
  if (req.body.standards !== undefined) {
    reviewToCreate.standards = req.body.standards;
  }
  if (req.body.title !== undefined) {
    reviewToCreate.title = req.body.title;
  }
  if (req.body.description !== undefined) {
    reviewToCreate.description = req.body.description;
  }
  if (req.body.rating !== undefined) {
    reviewToCreate.rating = req.body.rating;
  }
  if (req.body.user !== undefined) {
    reviewToCreate.user = req.body.user;
  }
  if (req.body.helpful !== undefined) {
    reviewToCreate.helpful = req.body.helpful;
  }
  model.create(reviewToCreate, (err, result) => {
    if (err) {
      res.status(400).send();
    } else {
      res.status(201).send(result);
    }
  });
});

app.put('/reviews/:reviewId', (req, res) => {
  const reviewItem = req.params.reviewId;
  const updateFields = {};
  if (req.body.grade !== undefined) {
    updateFields.grade = req.body.grade;
  }
  if (req.body.standards !== undefined) {
    updateFields.standards = req.body.standards;
  }
  if (req.body.title !== undefined) {
    updateFields.title = req.body.title;
  }
  if (req.body.description !== undefined) {
    updateFields.description = req.body.description;
  }
  if (req.body.rating !== undefined) {
    updateFields.rating = req.body.rating;
  }
  let updateFieldsString = '';
  for (var field in updateFields) {
    var column = field;
    var updatedValue = updateFields[field];
    updateFieldsString = updateFieldsString + ' ' + column + ' = ' + "'" + updatedValue + "'" + ',';
  };
  updateFieldsString = updateFieldsString.slice(0, -1);
  model.put(reviewItem, updateFieldsString, (err, result) => {
    if (err) {
      res.status(400).send();
    } else {
      res.status(200).send(result);
    }
  });
});

app.delete('/reviews/:reviewId', (req, res) => {
  const { reviewId } = req.params;
  model.delete(reviewId, (err, result) => {
    if (err) {
      res.status(400).send();
    } else {
      res.status(204).send(result);
    }
  });
});

app.put('/helpful/:reviewId', (req, res) => {
  console.log('req.params.reviewId ', req.params.reviewId);
  review.findOneAndUpdate({ _id: req.params.reviewId }, {$inc: {helpful: 1}}, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
      return;
    }
    res.send(results);
  });
});

app.get('/products/:id/ratings', (req, res) => {
  const match = req.params.id;
  const returnValue = [];
  const matNames = ['Dice Rolling Probability', 'Laplace Transforms, real world applications', 'American History 1700-1800', 'Github for Dummies'];
  review.findOne({ productId: parseInt(req.params.id) }, (err, results) => {
    if (err) {
      res.sendStatus(500).send(err);
    } else {
      returnValue.push(results.title.slice(0,20));
      review.aggregate([{ $match: { productId: parseInt(req.params.id) } }, { $group: { _id: '$productId', average: { $avg: '$rating' }, count: { $sum: 1 } } }], (err, result) => {
        if (err) {
          res.send(err);
          return;
        }
        returnValue.push(result);
        review.aggregate([{
          $project: {
            _id: 0,
            grade: 1,
            productId: 1,
          },
        }, { $match: { productId: parseInt(req.params.id) } },
        {
          $unwind: '$grade',
        }, {
          $group: {
            _id: '$grade',
            count: {
              $sum: 1,
            },
          },
        },
        ], (err, result) => {
          if (err) {
            res.send(err);
            return;
          }
          returnValue.push(result);
          review.aggregate([{ $match: { productId: parseInt(req.params.id) } },
            { $group: { _id: '$rating', count: { $sum: 1 } } },
          ], (err, result) => {
            if (err) {
              res.send(err);
              return;
            }
            returnValue.push(result);
            res.send(returnValue);
          });
        });
      });
    }
  })

});

module.exports = app;
