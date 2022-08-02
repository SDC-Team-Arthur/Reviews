const {pool} = require('../../db.js');

const get = (req, res) => {
  console.log('ran metadata get');
  const productId = req.query.product_id || 1;
  pool
    .query(`
      SELECT
        (WITH ratingsCount AS
          (SELECT rating, COUNT(*)
          FROM reviews
          WHERE product_id=${productId}
          GROUP BY rating)
          SELECT JSON_OBJECT_AGG(rating, count) AS ratings FROM ratingsCount
        ),
        (WITH recommendCount AS
          (SELECT recommend, COUNT(*)
          FROM reviews
          WHERE product_id=${productId}
          GROUP BY recommend)
          SELECT JSON_OBJECT_AGG(recommend, count) AS recommend FROM recommendCount
        ),
        (WITH characteristicsMeta AS
          (SELECT c.name, c.id, AVG(cr.value)
          FROM characteristics_reviews cr LEFT OUTER JOIN characteristics c
          ON c.id = cr.characteristic_id
          WHERE c.product_id=${productId} GROUP BY c.id)
          SELECT JSON_OBJECT_AGG(name, JSON_BUILD_OBJECT(
            'id', id,
            'value', avg))
            AS characteristics
            FROM characteristicsMeta
        )
    `)
    .then((data) => {
      data.rows[0].product_id = productId;
      res.send(data.rows[0]);
    })
    .catch(err => console.log(err))
};

module.exports = {get};