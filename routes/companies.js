
const express = require('express');
const router = express.Router();
// const db = require('../db')

router.get("/", async (req, res, next) => {
  // try {
  //   const result = await db.query(`SELECT * FROM companies`);
  //   return res.json(result.rows)
  // } catch (e) {
  //   return next(e);
  // }
  res.send("hello")
})

module.exports = router;