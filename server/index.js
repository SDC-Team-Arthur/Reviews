const {url, PORT} = require('../config.js');
const express = require('express');
const controllers = require('./controllers');

const app = express();
app.use(express.json());

app.get('/reviews', controllers.reviews.get);
app.post('/reviews', controllers.reviews.add);
app.get('/reviews/meta', controllers.metadata.get);
app.put('/reviews/:review_id/helpful', controllers.update.helpful);
app.put('/reviews/:review_id/report', controllers.update.report);
app.get('/loaderio-11ee4a0994d7e0bde1308b3659477209', (req, res) =>
  res.send('loaderio-11ee4a0994d7e0bde1308b3659477209'));

app.listen(PORT);
console.log(`Server listening at http://localhost:${PORT}`);