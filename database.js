import postgresql from "pg";
const { Pool } = postgresql;
import sqlite3 from "sqlite3";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

const debug = (...args) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(...args);
  }
};

const ispostgres = process.env.DB_ENGINE === "postgres";
let con;

if (ispostgres) {
  const connectionString = process.env.DB_CONNECTION_STRING;
  con = new Pool({ connectionString });
  console.log("Connected to PostgreSQL");
} else {
  debug("Warning: Running in-memory sqlite database");
  con = new sqlite3.Database(":memory:", (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to DB");
  });
  const sqlFile = fs.readFileSync("./setupSQLite.sql");
  const data = sqlFile.toString().split(";");
  // Remove last empty element
  data.pop();
  con.serialize(() => {
    con.run("BEGIN TRANSACTION");
    data.forEach((query) => {
      if (query) {
        con.run(query, (err) => {
          if (err) throw err;
        });
      }
    });
    con.run("COMMIT");
  });
  con.query = con.all;
}

export default async function queryDB(query, values) {
  if (ispostgres) {
    return con.query(query, values);
  } else {
    // replace $1 with ? for sqlite
    query = query.replace(/\$([0-9]+)/g, "?");
    const rows = await con.query(query, values);
    return rows;
  }
}
