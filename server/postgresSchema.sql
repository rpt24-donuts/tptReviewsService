DROP DATABASE IF EXISTS tpt_reviews;
CREATE DATABASE tpt_reviews;
\c tpt_reviews;

DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
  reviewId serial PRIMARY KEY,
  productID integer,
  username text,
  title text,
  description text,
  rating integer,
  helpful integer,
  grade text,
  standards text
)
-- to load db RUN  in the command line --> psql -U postgres -f server/postgresSchema.sql


