const {pool} = require('../../db.js');

const get = (req, res) => {
  console.log('ran reviews get')
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  const sort = req.query.sort;
  const productId = req.query.product_id;
  const offset = count * (page - 1);

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
        (SELECT COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
            'id', p.id,
            'url', p.url)
          ), '[]'::json)
        AS photos FROM reviews_photos p WHERE p.review_id=r.id
        )
      FROM reviews r
      WHERE r.product_id=${productId} AND r.reported=false
      ORDER BY ${sort === 'helpful' ? 'helpfulness' : 'date'}
      DESC LIMIT ${count} OFFSET ${offset}
    `)
    .then((data) => {
      res.send({
        product: productId,
        page: page,
        count: count,
        results: data.rows
      })
    })
    .catch(err => console.log(err))
};

const add = (req, res) => {
  const {product_id, rating, summary, body, recommend, name, email, photos, characteristics} = req.body
  const date = Math.round((new Date()).getTime());
  let queryString = photos.length === 0
  ? `
    WITH reviewsQuery AS (
      INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email, reported, helpfulness)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id AS rId
    ),
    characteristicsValues AS (SELECT * FROM json_each_text($11))
    INSERT INTO characteristics_reviews (review_id, characteristic_id, value)
    SELECT (SELECT rId FROM reviewsQuery), key::integer, value::integer
    FROM characteristicsValues
  `
  : `
    WITH reviewsQuery AS (
      INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email, reported, helpfulness)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id AS rId
    ),
    characteristicsValues AS (SELECT * FROM json_each_text($11)),
    characteristicsReviewsQuery AS (
      INSERT INTO characteristics_reviews (review_id, characteristic_id, value)
      SELECT (SELECT rId FROM reviewsQuery), key::integer, value::integer
      FROM characteristicsValues
    )
    INSERT INTO reviews_photos (review_id, url)
    SELECT (SELECT rId FROM reviewsQuery), unnest($12::text[])
  `;

  let values = photos.length === 0
    ? [product_id, rating, date, summary, body, recommend, name, email, false, 0, characteristics]
    : [product_id, rating, date, summary, body, recommend, name, email, false, 0, characteristics, photos];

  pool
    .query(queryString, values)
    .then(() => {res.send('successfully posted review')})
    .catch(err => res.send(err))
};

module.exports = {get, add};

