const express = require('express');
const ExpressError = require("../expressError")
const db = require('../database');

let router = new express.Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await db.query(`SELECT * FROM invoices`)
    if (result.rows.length === 0) {
      throw new ExpressError(`No invoices`, 404)
    } else {
      return res.json({"invoices": result.rows});
    }
  } catch(e) {
    return next(e)
  }

})

router.get("/:id", async (req, res, next) =>{
  try {
    const result = await db.query(`SELECT * FROM invoices WHERE id = ${req.params.id}`)
    if (result.rows.length === 0) {
      throw new ExpressError(`Invoice not found`, 404)
    } else {
      return res.json({"invoice": result.rows});
    }
  } catch(e) {
    return next(e)
  }
})

router.post("/", async (req, res, next) => {
  try {
    const result = db.query(
      `INSERT INTO invoices (comp_code, amt)
      VALUES ($1, $2)
      RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [req.body.comp_code, req.body.amt])
    return res.json({"invoice": result.rows})
  } catch(e) {
    return next(e)
  }
})

router.put("/:id", async (req, res, next) => {
  try{
    const result = await db.query(
      `
      UPDATE invoices
      SET amt = $1
      WHERE id = $2
      RETURNING id, comp_code, amt, paid, add_date, paid_date
      `,
      [req.body.amt, req.params.id]
    )
    if (result.rows.length === 0) {
      throw new ExpressError(`Invoice not found`, 404)
    } else {
      return res.json({"invoice": result.rows});
    }
  }catch(e) {
    return next(e)
  }
})

router.delete("/:id", async (req, res, next) => {
  try {
    const result = db.query(`
      DELETE FROM invoice WHERE id = '${req.params.id}'
    `)
    if (result.rows.length === 0) {
      throw new ExpressError(`Invoice not found`, 404)
    } else {
      return res.json({"invoice": "deleted"});
    }
  } catch(e) {
    return next(e)
  }
})

module.exports = router