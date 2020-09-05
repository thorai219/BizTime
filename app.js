/** BizTime express application. */
const express = require("express");

const app = express();
const ExpressError = require("./expressError")

app.use(express.json());

app.use("/company", require("./routes/companies"))
app.use("/invoice", require("./routes/invoices"))

/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  console.log(err)
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;
