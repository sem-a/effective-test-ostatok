const express = require('express');
const router = express.Router();


router.get('/', function(req, res) {
  res.status(200).json({message: 'Сервер работает!'})
});

module.exports = router;
