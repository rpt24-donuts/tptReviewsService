const express = require('express');

const mongoose = require('mongoose');

const app = express();

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
        res.send(err);
        return;
      }
      returnObject.grades = grades;
      res.send(returnObject);
    });
  }).limit(20);
});

app.put('/review/reviewId', (req, res) => {

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
