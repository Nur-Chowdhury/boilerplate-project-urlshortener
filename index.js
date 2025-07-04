require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("dns");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.use(express.urlencoded({ extended: false }));

let urlDatabase = {};
let counter = 1;

app.post("/api/shorturl", (req, res) => {
  const inputUrl = req.body.url;

  try {
    const urlObj = new URL(inputUrl);

    dns.lookup(urlObj.hostname, (err) => {
      if (err) return res.json({ error: "invalid url" });

      const short = counter++;
      urlDatabase[short] = inputUrl;

      res.json({
        original_url: inputUrl,
        short_url: short,
      });
    });
  } catch {
    res.json({ error: "invalid url" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
