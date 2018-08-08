require("@ehealth/env/load");
const url = require("url");
const express = require("express");
require("express-async-errors");
const polyfill = require("polyfill-service");

const { PORT } = process.env;

const app = express();

app.get("/polyfill:min(.min)?.js", async (req, res) => {
  const script = await polyfill.getPolyfillString({
    uaString: req.headers["user-agent"],
    minify: req.params.min === ".min",
    features: {
      default: {},
      "Object.entries": {}
    }
  });

  res.set({
    "Content-Type": "application/javascript;charset=utf-8",
    "Content-Length": script.length
  });
  res.write(script);
  res.end();
});

app.listen(PORT, () => {
  console.log(`Listening on http://0.0.0.0:${PORT}`);
});
