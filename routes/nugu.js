var express = require('express');
const npkRequest = require('../nugu');
const { json } = require('../http');
var router = express.Router();

/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/
router.post('/', json(npkRequest));

module.exports = router;
