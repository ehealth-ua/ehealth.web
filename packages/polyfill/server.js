require("@ehealth/env");
const url = require("url");
const express = require("express");
const polyfill = require("polyfill-service");

const { PORT = 4001 } = process.env;

const app = express();

app.get("/polyfill.js", async (req, res) => {
  try {
    const script = await polyfill.getPolyfillString({
      uaString: req.headers["user-agent"],
      minify: true
    });
    res.set({
      "Content-Type": "application/javascript;charset=utf-8",
      "Content-Length": script.length
    });
    res.setHeader("Cache-Control", "immutable");
    res.write(script);
    res.end();
  } catch (error) {
    res.status(error.meta.code).json(error);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on http://0.0.0.0:${PORT}`);
});
