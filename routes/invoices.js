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
  try {''
    let id = req.params.id;

    const result = await db.query(
          `SELECT i.id, 
                  i.comp_code, 
                  i.amt, 
                  i.paid, 
                  i.add_date, 
                  i.paid_date, 
                  c.name, 
                  c.description 
           FROM invoices AS i
             INNER JOIN companies AS c ON (i.comp_code = c.code)  
           WHERE id = $1`,
          [id]
        );

    if (result.rows.length === 0) {
      throw new ExpressError(`No such invoice: ${id}`,404);
    }

    const data = result.rows[0];
    const invoice = {
      id: data.id,
      company: {
        code: data.comp_code,
        name: data.name,
        description: data.description,
      },
      amt: data.amt,
      paid: data.paid,
      add_date: data.add_date,
      paid_date: data.paid_date,
    };

    return res.json({"invoice": invoice});
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
    let {amt, paid} = req.body;
    let {id} = req.params;
    let datePaid = null;
    
    const currInvoice = await db.query(
      `SELECT paid FROM
      invoices WHERE id = $1`,
      [id]
    )

    if (currInvoice.rows.length === 0) {
      throw new ExpressError("Invoice not found", 404);
    }

    const currPaidDate = currInvoice.rows[0].paid_date;

    if (!currPaidDate && paid) {
      paid_date = new Date();
    } else if (!paid) {
      paidDate = null;
    } else {
      paidDate = currPaidDate;
    }

    const result = await db.query(
      `UPDATE invoices SET amt=$1, paid=$2, paid_date=$3
      WHERE id = $4 
      RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [amt, paid, paid_date, id]);

    return res.json({"invoice": result.rows[0]});
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