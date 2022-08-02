const {pool} = require('../../db.js');

const get = (req, res) => {
  console.log('ran metadata get');
  pool
    .query(`
      SELECT
        JSON_BUILD_OBJECT(
          1, (SELECT COUNT(*) FROM reviews WHERE product_id=1 AND rating=1),
          2, (SELECT COUNT(*) FROM reviews WHERE product_id=1 AND rating=2),
          3, (SELECT COUNT(*) FROM reviews WHERE product_id=1 AND rating=3),
          4, (SELECT COUNT(*) FROM reviews WHERE product_id=1 AND rating=4),
          5, (SELECT COUNT(*) FROM reviews WHERE product_id=1 AND rating=5)
        ) AS ratings,
        JSON_BUILD_OBJECT(
          0, (SELECT COUNT(*) FROM reviews WHERE product_id=1 AND recommend=false),
          1, (SELECT COUNT(*) FROM reviews WHERE product_id=1 AND recommend=true)
        ) AS recommend,
        (WITH featuresMeta AS
          (SELECT c.name, c.id, AVG(cr.value)
          FROM characteristics_reviews cr LEFT OUTER JOIN characteristics c
          ON c.id = cr.characteristic_id
          WHERE c.product_id=1 GROUP BY c.id)
          SELECT JSON_OBJECT_AGG(name, JSON_BUILD_OBJECT(
            'id', id,
            'value', avg))
            AS characteristics
            FROM featuresMeta
        )
    `)
    .then((data) => {
      res.send(data.rows[0]);
    })
    .catch(err => console.log(err))
};


        // (SELECT JSON_OBJECT_AGG(c.name, JSON_BUILD_OBJECT(
        //   'id', c.id,
        //   'value', cr.value))
        //   AS characteristics
        //   FROM characteristics_reviews cr INNER JOIN characteristics c
        //   ON c.id = cr.characteristic_id
        //   WHERE c.product_id=2)

        // select rating, count(*) from reviews where product_id=1 group by rating;

        // SELECT
          // JSON_BUILD_OBJECT(
          //   1, (SELECT COUNT(*) FROM reviews WHERE product_id=2 AND rating=1),
          //   2, (SELECT COUNT(*) FROM reviews WHERE product_id=2 AND rating=2),
          //   3, (SELECT COUNT(*) FROM reviews WHERE product_id=2 AND rating=3),
          //   4, (SELECT COUNT(*) FROM reviews WHERE product_id=2 AND rating=4),
          //   5, (SELECT COUNT(*) FROM reviews WHERE product_id=2 AND rating=5)
          // ) AS ratings,
          // JSON_BUILD_OBJECT(
          //   0, (SELECT COUNT(*) FROM reviews WHERE product_id=2 AND recommend=false),
          //   1, (SELECT COUNT(*) FROM reviews WHERE product_id=2 AND recommend=true)
          // ) AS recommend,
          // (SELECT JSON_OBJECT_AGG(c.name, JSON_BUILD_OBJECT(
          //   'id', c.id,
          //   'value', cr.value))
          //   AS characteristics
          //   FROM characteristics_reviews cr INNER JOIN characteristics c
          //   ON c.id = cr.characteristic_id
          //   WHERE c.product_id=1)

module.exports = {get};