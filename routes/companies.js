
const express = require('express');
const ExpressError = require("../expressError")
const db = require('../database');

let router = new express.Router();

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
    const companyResult = await db.query(`SELECT code, name, description FROM companies WHERE code = $1`, [req.params.code])
    console.log(companyResult)
    const invoceResult = await db.query(`SELECT id FROM invoices WHERE comp_code = $1`, [req.params.code])
    console.log(invoceResult)
    if (companyResult.rows.length === 0) {
      throw new ExpressError(`No such company: ${code}`, 404)
    } else {
      const company = companyResult.rows[0];
      const invoice = invoceResult.rows;

      company.invoice = invoice.map(item => item.id)

      return res.json({"company": company})
    }
  } catch(e) {
    return next(e)
  }
})

router.post("/", async (req, res, next) => {
  try{
    const query = `INSERT INTO companies (code, name, description)
    VALUES ($1, $2, $3) RETURNING code, name, description`;
    const result = await db.query(query,
      [req.body.code, req.body.name, req.body.description]
    )
    return res.json({"company": result.rows[0]});
  } catch(e) {
    return next(e)
  }
})

router.put("/:code", async (req, res, next) => {
  try{
    let {name, description} = req.body;
    let code = req.params.code;

    const result = await db.query(
          `UPDATE companies
           SET name=$1, description=$2
           WHERE code = $3
           RETURNING code, name, description`,
        [name, description, code]);

    if (result.rows.length === 0) {
      throw new ExpressError(`No such company: ${code}`, 404)
    } else {
      return res.json({"company": result.rows[0]});
    }
  } catch(e) {
    return next(e)
  }
})

router.delete("/:code", async (req, res, next) => {
  try {
    const result = await db.query(
      `DELETE FROM companies WHERE code = '${req.params.code}'`
    )    
    if (result.rows.length === 0) {
      throw new ExpressError(`No such company: ${code}`, 404)
    } else {
      return res.json({"company": "deleted!"});
    }
  } catch(e) {
    return next(e)
  }
})

module.exports = router;