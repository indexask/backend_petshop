const { Pool } = require("pg")
require("dotenv").config()

const pool = new Pool({
  user: 'matias',
  database: 'petshop_st4j',
  host: 'dpg-ckn1i2v83ejs7391q1j0-a',
  password: 'OTEJoWNpUBaMuxus9aQ0amDSFuqf8Xm5',
  port:5432,
  secret: 'mysecret',
  allowExitOnIdle: true,
  sll: true,
})

module.exports = pool
