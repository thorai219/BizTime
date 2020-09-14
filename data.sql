DROP DATABASE IF EXISTS biztime;

CREATE DATABASE biztime;

\c biztime

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS hello;

CREATE TABLE industries (
  ind_code text PRIMARY KEY,
  industry text NOT NULL
);

CREATE TABLE companies (
  comp_code text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text
);

CREATE TABLE hello (
  comp_code text REFERENCES companies(comp_code) ON DELETE CASCADE,
  ind_code text REFERENCES industries(ind_code) ON DELETE CASCADE
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

INSERT INTO companies (comp_code, name, description)
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('amazon', 'Amazon Inc', 'Amazon'),
         ('facebook', 'Facebook Inc', 'Facebook');

INSERT INTO invoices (comp_code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01');

INSERT INTO industries (ind_code, industry)
  VALUES ('Manufacturer', 'Hardware & Software'),
         ('ecomm', 'Ecommerce'),
         ('SNS','Social Network');

INSERT INTO hello (comp_code, ind_code)
  VALUES ('apple', 'Manufacturer'),
        ('amazon', 'ecomm')