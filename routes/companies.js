
const express = require('express');
const router = express.Router();
const db = require('../db')

router.get("/companies", async (req, res, next) => {
  try {
    let result = await db.query("SELECT * FROM companies");
    return res.json(result.rows)
  } catch (e) {
    return next(e);
  }
})



module.exports = router;