const express = require("express");
const { create, get } = require("../controllers/products");
const router = express.Router();

router.post("/create", create);

router.get("/get", get);

module.exports = router;
