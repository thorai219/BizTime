
const express = require('express');
const router = express.Router();
const db = require('../database')

router.get("/", async (req, res, next) => {
  try {
    const result = await db.query(`SELECT * FROM companies`);
    return res.json(result.rows)
  } catch (e) {
    return next(e);
  }
})

router.get("/:code", async (req, res, next) => {
  try{
    const queryStr = req.params.code;
    const result = await db.query(`SELECT * FROM companies WHERE code = '${queryStr}'`)
    return res.json({company: result.rows})
  } catch(e) {
    return next(e)
  }
})

router.post("/", async (req, res, next) => {
  try{
    const result = db.query(
      `INSERT INTO companies (code, name, description)
      value ($1, $2, $3) RETURNING code, name, description`,
      [req.body.code, req.body.name, req.body.description]
    )
    return res.status(201).json({company: result.row})
  } catch(e) {
    return next(e)
  }
})

module.exports = router;