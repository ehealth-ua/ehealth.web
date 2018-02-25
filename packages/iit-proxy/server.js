#!/usr/bin/env node

const express = require("express");
const cors = require("cors");
const { Decoder, Encoder } = require("b64");
const fetch = require("node-fetch");

const { PORT = 5000 } = process.env;

const proxyMiddleware = async (req, res, next) => {
  try {
    const { method, query: { address } } = req;
    const reqBody = req.pipe(new Decoder());

    const { body: resBody } = await fetch(address, { method, body: reqBody });
    resBody.pipe(new Encoder()).pipe(res);

    next();
  } catch (err) {
    console.error(err);
  }
};

const app = express();

app.use(cors());
app.use(proxyMiddleware);

app.listen(PORT, () => {
  console.log(`Listening on http://0.0.0.0:${PORT}`);
});
