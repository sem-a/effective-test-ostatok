const express = require("express");
const { create, increase, decrease, get } = require("../controllers/stocks");
const router = express.Router();

// api/stock/create
router.post("/create", create);

// api/stock/increase
router.put("/increase", increase);

// api/stock/decrease
router.put("/decrease", decrease);

// api/stock/get
router.get("/get", get);

module.exports = router;
