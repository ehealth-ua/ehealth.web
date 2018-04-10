#!/usr/bin/env node

const express = require("express");
const cors = require("cors");
const { Decoder, Encoder, encode } = require("b64");
const fetch = require("node-fetch");

const CACHED_RESPONSE_LIMIT = 10 ** 7; // 10 MB
const CACHE_LIMIT = 10 ** 9; // 1 GB

const { PORT = 5000 } = process.env;

let memory = new Map();

const proxyMiddleware = async (req, res, next) => {
  try {
    const { method, query: { address, raw, cache } } = req;
    let reqBody;

    if (!["GET", "HEAD"].includes(method)) {
      reqBody = raw ? req : req.pipe(new Decoder());
    }

    if (memory.has(address) && cache) {
      const buffer = memory.get(address);
      const resBody = raw ? buffer : encode(buffer);
      res.send(resBody);
    } else {
      const response = await fetch(address, { method, body: reqBody });
      const resBody = raw ? response.body : response.body.pipe(new Encoder());
      resBody.pipe(res);

      if (cache) {
        const buffer = await response.buffer();
        const totalLength = [...memory.values(), buffer].reduce(
          (total, { length }) => total + length,
          0
        );

        if (
          buffer.length <= CACHED_RESPONSE_LIMIT &&
          totalLength <= CACHE_LIMIT
        ) {
          memory.set(address, buffer);
        }
      }
    }

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
