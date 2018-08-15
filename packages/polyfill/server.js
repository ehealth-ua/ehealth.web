require("@ehealth/env/load");
const express = require("express");
const shrinkRay = require("shrink-ray-current");
const polyfill = require("polyfill-library");

const { PORT } = process.env;

const app = express();

app.use(shrinkRay({ brotli: { quality: 11 } }));

app.get("/polyfill:min(.min)?.js", (req, res) => {
  const script = polyfill.getPolyfillString({
    uaString: req.header("user-agent"),
    minify: req.params.min === ".min",
    features: {
      default: {},
      "Object.entries": {}
    },
    stream: true
  });

  res.set({
    "Content-Type": "application/javascript;charset=utf-8",
    "Content-Length": script.length,
    Vary: "User-Agent"
  });

  script.pipe(res);
});

app.listen(PORT, () => {
  console.log(`Listening on http://0.0.0.0:${PORT}`);
});
