var express = require('express');
const nugu = require('../nugu');
var router = express.Router();

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/
router.post(`/nugu/answerfood`, nugu);
router.post(`/nugu/answer.cook`, nugu);
router.post(`/nugu/answer.growth`, nugu);
router.post(`/nugu/answer.remedy`, nugu);
router.post(`/nugu/answer.vaccination`, nugu);
router.post(`/nugu/answer.event`, nugu);
router.post(`/nugu/answer.recommend`, nugu);
router.post(`/nugu/answer.multisick`, nugu);
router.post(`/nugu/answer.next`, nugu);
router.post(`/nugu/answer.nextevent`, nugu);
router.post(`/nugu/answer.askvaccination`, nugu);
//router.post(`/nugu/`);

module.exports = router;
