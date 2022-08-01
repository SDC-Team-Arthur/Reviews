const {pool} = require('../../db.js');

const get = (req, res) => {
  //query params: page, count, sort, product_id
  //response sends review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness, photos
  console.log('ran reviews get')
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  const sort = req.query.sort || 'r.id';
  pool
    .query(`
      SELECT
        r.id AS review_id,
        r.rating,
        r.summary,
        r.recommend,
        r.response,
        r.body,
        (TO_TIMESTAMP(r.date/1000)) AS date,
        r.reviewer_name,
        r.helpfulness,
        (SELECT
          JSON_AGG(
            JSON_BUILD_OBJECT(
            'id', p.id,
            'url', p.url
            )
          )
        AS photos FROM reviews_photos p WHERE p.review_id=r.id
        )
      FROM reviews r
      WHERE r.product_id=2 AND r.reported=false
      ORDER BY ${sort}
    `)
    .then((data) => {
      res.send(data.rows)
    })
    .catch(err => console.log(err))
};

const add = (req, res) => {
  const {product_id, rating, summary, body, recommend, name, email, photos, characteristics} = req.body
  const date = Math.round((new Date()).getTime());
  if (photos.length === 0) {
    pool
      .query(`
        WITH reviewsQuery AS (
          INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email)
            VALUES (${product_id}, ${rating}, ${date}, ${summary}, ${summary}, ${body}, ${recommend}, ${name}, ${email})
        ),
        characteristicsValues AS (SELECT * FROM json_each_text(${characteristics})),
          INSERT INTO characteristics_reviews (review_id, characteristic_id, value)
          SELECT (SELECT id FROM reviewsQuery), key::integer, value::integer
          FROM characteristicsValues
      `)
      .then(() => {res.send('successfully posted review')})
      .catch(err => res.send(err))
  } else {
    pool
      .query(`
        WITH reviewsQuery AS (
          INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email)
            VALUES (${product_id}, ${rating}, ${date}, ${summary}, ${summary}, ${body}, ${recommend}, ${name}, ${email})
        ),
        characteristicsValues AS (SELECT * FROM json_each_text(${characteristics})),
          INSERT INTO characteristics_reviews (review_id, characteristic_id, value)
          SELECT (SELECT id FROM reviewsQuery), key::integer, value::integer
          FROM characteristicsValues,
        INSERT INTO reviews_photos (review_id, url)
        SELECT (SELECT idd FROM reviewsQuery), unnest(${photos}::text[])
      `)
      .then(() => {res.send('successfully posted review')})
      .catch(err => res.send(err))
  }
};

module.exports = {get, add};