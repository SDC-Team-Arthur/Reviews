DROP DATABASE IF EXISTS reviews;

CREATE DATABASE reviews;

\c reviews;

DROP TABLE IF EXISTS reviews, reviews_photos, characteristics, characteristics_reviews CASCADE;

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id integer NOT NULL,
  rating smallint NOT NULL,
  date bigint NOT NULL,
  summary varchar NOT NULL,
  body varchar(1000) NOT NULL,
  recommend boolean NOT NULL,
  reported boolean NOT NULL DEFAULT false,
  reviewer_name varchar(60) NOT NULL,
  reviewer_email varchar(60) NOT NULL,
  response varchar,
  helpfulness smallint NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews_photos (
  id SERIAL PRIMARY KEY,
  review_id integer REFERENCES reviews (id),
  url varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS characteristics (
  id SERIAL PRIMARY KEY,
  product_id integer NOT NULL,
  name varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS characteristics_reviews (
  id SERIAL PRIMARY KEY,
  characteristic_id integer REFERENCES characteristics (id),
  review_id integer REFERENCES reviews (id),
  value smallint NOT NULL
);

COPY reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/Users/harrisonzhao/Hack Reactor/SDC/Reviews Data/reviews.csv'
DELIMITER ','
CSV HEADER;

COPY reviews_photos(id, review_id, url)
FROM '/Users/harrisonzhao/Hack Reactor/SDC/Reviews Data/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics(id, product_id, name)
FROM '/Users/harrisonzhao/Hack Reactor/SDC/Reviews Data/characteristics.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics_reviews(id, characteristic_id, review_id, value)
FROM '/Users/harrisonzhao/Hack Reactor/SDC/Reviews Data/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;
