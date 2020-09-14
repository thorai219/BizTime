const express = require('express');
const ExpressError = require("../expressError")
const db = require('../database');

let router = new express.Router();


router.get("/", async (req, res, next) => {
  try {
    const result = await db.query(`SELECT * FROM industries`);
    return res.json(result.rows)
  } catch (e) {
    return next(e)
  }
});

router.post("/", async (req, res, next) => {
  try {
    const result = await db.query(
      `
      INSERT INTO industries (code, industry)
      VALUES ($1, $2)
      RETURNING code, industry
      `,
      [req.body.code, req.body.industry]
    )
    return res.json(result.rows[0])
  } catch(e) {
    return next(e)
  }
});



module.exports = router;