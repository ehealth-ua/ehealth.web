#!/usr/bin/env node

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const { PORT = 5000 } = process.env;

const proxyMiddleware = async (req, res, next) => {
  try {
    const { method, query: { address } } = req;
    const body = Buffer.from(req.body, "base64");

    const response = await fetch(address, { method, body });
    const responseData = await response.arrayBuffer();

    const data = Buffer.from(responseData).toString("base64");

    res.write(data);
    res.end();

    next();
  } catch (err) {
    console.error(err);
  }
};

const app = express();

app.use(cors());
app.use(bodyParser.text({ type: "x-user/base64-data" }));
app.use(proxyMiddleware);

app.listen(PORT, () => {
  console.log(`Listening on http://0.0.0.0:${PORT}`);
});
