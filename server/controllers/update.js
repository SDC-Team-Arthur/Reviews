const {pool} = require('../../db.js');

const helpful = (req, res) => {
  pool
    .query(`
      UPDATE reviews
      SET helpfulness = helpfulness + 1
      WHERE id = ${req.params.review_id}
    `)
    .then(() => res.send('successfully marked helpful'))
    .catch(err => res.send(err))
};

const report = (req, res) => {
  pool
    .query(`
      UPDATE reviews
      SET reported = true
      WHERE id = ${req.params.review_id}
    `)
    .then(() => res.send('successfully reported'))
    .catch(err => res.send(err))
};

module.exports = {helpful, report};