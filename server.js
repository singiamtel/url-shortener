import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { nanoid } from "nanoid";
import queryDB from "./database.js";
import * as dotenv from "dotenv";
import rateLimit from "express-rate-limit";
dotenv.config();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});

const debug = (...args) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(...args);
  }
};

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("tiny"));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.static("public"));
app.use(limiter);
app.use(function (req, _, next) {
  req.getUrl = function () {
    return req.protocol + "://" + req.get("host");
  };
  return next();
});

app.get("/", (_, res) => {
  res.sendFile("/public/index.html");
});

app.post("/create/", async (req, res) => {
  if (!req.body || !req.body.url) {
    res.status(400).json({ message: "No url provided" });
    return;
  }
  const id = nanoid(6);
  try {
    const response = await queryDB("select * from slugs where url = $1", [
      req.body.url,
    ]);
    if (response.rows.length > 0) {
      res
        .type("application/json")
        .json({ url: req.getUrl() + "/s/" + response.rows[0].slug });
      return;
    }
    await queryDB("INSERT INTO slugs values($1, $2)", [id, req.body.url]);
    res.type("application/json").json({ url: req.getUrl() + "/s/" + id });
  } catch (e) {
    debug("Database error", e);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
    return;
  }
});

app.get("/s/:slug", async (req, res) => {
  if (!req.params.slug) {
    res.status(400).json({
      status: "error",
      message: "No slug provided",
    });
    return;
  }
  try {
    const result = await queryDB("select url from slugs where slug = $1", [
      req.params.slug,
    ]);
    if (result.rows.length === 0) {
      res.status(404).json({
        status: "error",
        message: "Slug not found",
      });
      return;
    } else {
      const URL = /^http/.test(result.rows[0].url)
        ? result.rows[0].url
        : "http://" + result.rows[0].url;
      res.status(301).redirect(URL);
      return;
    }
  } catch (e) {
    debug(e);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
    return;
  }
});

app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
