CREATE DATABASE IF NOT EXISTS ReviewsAPI;

USE ReviewsAPI;

CREATE TABLE Products (
  product_id int UNIQUE,
  PRIMARY KEY (product_id)
);

CREATE TABLE Reviews (
  id int AUTO_INCREMENT,
  product_id int REFERENCES products (product_id),
  review_id int,
  rating int,
  summary varchar,
  recommend boolean,
  response varchar,
  body varchar,
  date time,
  reviewer_name varchar,
  helpfulness int,
  photos jsonb,
  PRIMARY KEY (id)
);

CREATE TABLE Metadata (
  id int AUTO_INCREMENT,
  product_id int REFERENCES products (product_id),
  ratings jsonb,
  recommended jsonb,
  characteristics jsonb,
  PRIMARY KEY (id)
);
