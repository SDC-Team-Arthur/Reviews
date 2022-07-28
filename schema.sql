CREATE DATABASE IF NOT EXISTS ReviewsAPI;

USE ReviewsAPI;

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id integer NOT NULL,
  rating numeric NOT NULL,
  review_date varchar NOT NULL,
  summary varchar(60) NOT NULL,
  body varchar(1000) NOT NULL CHECK (length(body) > 50),
  recommend boolean NOT NULL,
  reported boolean NOT NULL,
  reviewer_name varchar(60) NOT NULL,
  reviewer_email varchar(60) NOT NULL,
  response varchar,
  helpfulness smallint NOT NULL,
);

CREATE TABLE IF NOT EXISTS reviews_photos (
  id SERIAL PRIMARY KEY,
  review_id integer REFERENCES reviews (id),
  photo_url varchar
);

CREATE TABLE IF NOT EXISTS characteristics (
  id SERIAL PRIMARY KEY,
  product_id integer REFERENCES reviews (product_id),
  characteristics_name varchar
);

CREATE TABLE IF NOT EXISTS characteristics_reviews (
  id SERIAL PRIMARY KEY,
  characteristic_id integer REFERENCES characteristics (id),
  review_id integer REFERENCES reviews (id),
  characteristic_value smallint
);

COPY reviews(product_id, rating, review_date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/Users/harrisonzhao/Hack Reactor/SDC/Reviews Data/reviews.csv'
DELIMITER ','
CSV HEADER;

COPY reviews_photos(review_id, photo_url)
FROM '/Users/harrisonzhao/Hack Reactor/SDC/Reviews Data/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics(product_id, characteristics_name)
FROM '/Users/harrisonzhao/Hack Reactor/SDC/Reviews Data/characteristics.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics_reviews(characteristic_id, review_id, characteristic_value)
FROM '/Users/harrisonzhao/Hack Reactor/SDC/Reviews Data/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;
