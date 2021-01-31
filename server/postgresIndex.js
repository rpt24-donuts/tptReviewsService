const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tpt_reviews',
  password: '',
  port: 5432,
});

pool.query("COPY reviews(productID, username, title, description, rating, helpful, grade, standards) FROM '/Users/matteo/Desktop/HackReactor/Immersive/systems-design-capstone/tptReviewsService/server/reviews.tsv' DELIMITER '\t' CSV HEADER;", (err, res) => {
  if (err) {
    console.log('there was an error ', err);
  } else {
    console.log('success ', res);
  }
  pool.end();
});
