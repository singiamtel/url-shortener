const express = require("express");
const morgan = require("morgan");
const mysql = require("mysql");
const cors = require("cors");
const { nanoid } = require("nanoid");
require("dotenv").config();

const connection = mysql.createConnection({
  host: "localhost",
  database: "urlshort",
  user: "sergio",
});

connection.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Connected to DB");
});

const app = express();
const port = process.env.PORT;

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
// app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  req.getUrl = function () {
    return req.protocol + "://" + req.get("host");
  };
  return next();
});

app.get("/", (_, res) => {
  res.sendFile("/public/index.html");
});

app.post("/create/", async (req, res) => {
  // console.log(req.body);
  if (!req.body || !req.body.url) {
    res.status(400).json('{"status":"error", "message": "URL needed"}');
    return;
  }
  id = nanoid(6);
  try {
    connection.query(
      "select * from slugs where url = ?",
      [req.body.url],
      (err, result) => {
        if (err) {
          console.log(err);
          res.send("ERR");
          return;
        }
        if (result?.length !== 0) {
          res
            .type("application/json")
            .json({ url: req.getUrl() + "/s/" + result[0].slug });
          return;
        }
        connection.query("INSERT INTO slugs values(?, ?)", [id, req.body.url]);
        res.type("application/json").json({ url: req.getUrl() + "/s/" + id });
      }
    );
  } catch (e) {
    console.log("Error", e);
    res.send("Error");
    return;
  }
});

app.get("/s/:slug", (req, res) => {
  if (!req.params.slug) {
    res.send("NO SLUG");
    return;
  }
  console.log(req.params.slug);
  try {
    connection.query(
      "select url from slugs where slug = ?",
      [req.params.slug],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          res.send("Error");
          return;
        }
        if (result.length === 0) {
          res.send("Slug not found");
          return;
        } else res.status(301).redirect(result[0].url);
      }
    );
  } catch (e) {
    console.log("ERROR", e);
  }
});

app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
