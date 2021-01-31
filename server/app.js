const express = require('express');

const mongoose = require('mongoose');

const app = express();
// middleware for the CRUD API
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const path = require('path');

const cors = require('cors');
const { ModuleFilenameHelpers } = require('webpack');
const { db, review, schema } = require('./mongodb.js');
const model = require('./models');

app.use(cors());

app.use(express.static(path.join(__dirname, '../dist')));

app.use('/static', express.static(path.join(__dirname, '../src')));

app.get('/', (req, res) => {
  //res.send('index.html');
});

app.get('/products/:id/reviews/', (req, res) => {
  const returnObject = {};
  let query = { productId: req.params.id, grade: (req.query.grades !== 'false') ? req.query.grades : undefined, rating: (req.query.ratings !== 'false') ? req.query.ratings : undefined}
  Object.keys(query).forEach(key => {
    if (query[key] === undefined) {
      delete query[key];
    }
  });
  review.find(query, (err, results) => {
    returnObject['reviews'] = results;
    review.find().distinct('grade', (err, grades) => {
      if (err) {
        res.status(400).send(err);
        return;
      }
      returnObject.grades = grades;
      res.status(200).send(returnObject);
    });
  }).limit(20);
});

// adding a POST endpoint to CREATE a new item in the database
app.post('/products/:id/reviews', (req, res) => {
  const productId = req.params.id;
  const reviewToCreate = {};
  reviewToCreate.productId = productId;

  if (req.body.grade !== undefined) {
    reviewToCreate.grade = JSON.parse(req.body.grade);
  }
  if (req.body.standards !== undefined) {
    reviewToCreate.standards = JSON.parse(req.body.standards);
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
  model.create(reviewToCreate, (err, result) => {
    if (err) {
      res.status(400).send();
    } else {
      res.status(201).send(result);
    }
  });
});

// adding a PUT endpoint to UPDATE database
app.put('/reviews/:reviewId', (req, res) => {
  const reviewItem = { _id: req.params.reviewId };
  const updateFields = {};
  // grade test input: ["1st Grade", "3rd Grade"]
  if (req.body.grade !== undefined) {
    updateFields.grade = JSON.parse(req.body.grade);
  }
  // standards test input: [{"standard" : "TKO 12.4f","alignment" : 5},{"standard" : "CCSS 3.NF.A.1","alignment" : 2}]
  if (req.body.standards !== undefined) {
    updateFields.standards = JSON.parse(req.body.standards);
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
  model.put(reviewItem, updateFields, (err, result) => {
    if (err) {
      res.status(400).send();
    } else {
      res.status(200).send(result);
    }
  });
});

// adding a DELETE endpoint to DELETE from the database
app.delete('/reviews/:reviewId', (req, res) => {
  const reviewItem = { _id: req.params.reviewId };
  model.delete(reviewItem, (err, result) => {
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
