const {pool} = require('../../db.js');

const get = (req, res) => {
  //query params: product_id
  //response sends ratings, recommended, characteristics
  //characterstics: characteristics_name from characteristics, characteristic_id and characteristic_value from characteristics_reviews
  console.log('ran metadata get');
  pool
    .query(`
      (SELECT JSON_OBJECT_AGG(c.name, JSON_BUILD_OBJECT(
        'id', c.id,
        'value', cr.value))
        AS characteristics
        FROM characteristics_reviews cr INNER JOIN characteristics c
        ON c.id = cr.characteristic_id
        WHERE c.product_id=1)
    `)
    .then((data) => {
      res.send(data.rows[0]);
    })
    .catch(err => console.log(err))
}



        // SELECT JSON_OBJECT_AGG(rating, COUNT(rating))
        //   AS ratings
        //   FROM reviews
        //   WHERE product_id=1,

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

        // JSON_BUILD_OBJECT(
        //   'characteristics', (SELECT JSON_BUILD_OBJECT(
        //     'id', characteristic_id,
        //     'value', characteristic_value
        //   ) AS characteristics_name
        //   FROM characteristics JOIN characteristics_reviews
        //   ON characteristics.id=characteristics_reviews.characteristic_id WHERE characteristics.product_id=2)
        // )



module.exports = {get};