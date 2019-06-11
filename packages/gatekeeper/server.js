require("@ehealth/env/load");

const url = require("url");
const express = require("express");
require("express-async-errors");
const fetch = require("node-fetch");

const {
  NODE_ENV,
  PORT = 4000,
  API_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  COOKIE_DOMAINS = "",
  AUTH_COOKIE_NAME = "authorization",
  META_COOKIE_NAME = "meta",
  REDIRECT_URL = "/"
} = process.env;

const COOKIE_DOMAINS_LIST = COOKIE_DOMAINS.split(",");

const app = express();

app.set("trust proxy", true);

app.get("/auth/redirect", async (req, res) => {
  const {
    protocol,
    path: pathname,
    headers: { host },
    query: { code }
  } = req;

  const redirect_uri = url.format({ protocol, host, pathname });

  const {
    value,
    user_id,
    expires_at,
    details: { scope }
  } = await authenticate({ code, redirect_uri });

  const expires = new Date(expires_at * 1000);
  const secure = NODE_ENV !== "development";

  const metadata = { scope, userId: user_id };

  COOKIE_DOMAINS_LIST.forEach(domain => {
    res.cookie(AUTH_COOKIE_NAME, value, {
      domain,
      expires,
      secure,
      httpOnly: true
    });

    res.cookie(META_COOKIE_NAME, JSON.stringify(metadata), {
      domain,
      expires,
      secure
    });
  });

  res.redirect(REDIRECT_URL);
});

app.get("/auth/logout", async (req, res) => {
  const secure = NODE_ENV !== "development";

  COOKIE_DOMAINS_LIST.forEach(domain => {
    res.clearCookie(AUTH_COOKIE_NAME, {
      domain,
      secure,
      httpOnly: true
    });

    res.clearCookie(META_COOKIE_NAME, {
      domain,
      secure
    });
  });

  res.redirect(REDIRECT_URL);
});

const authenticate = async ({ code, redirect_uri }) => {
  const token = {
    grant_type: "authorization_code",
    code,
    redirect_uri,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
  };

  const response = await fetch(`${API_URL}/oauth/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token })
  });

  const { meta, error, data } = await response.json();

  if (error) throw { meta, error };
  return data;
};

const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (error instanceof Error) {
    next(error);
  } else {
    const { code = 500 } = error.meta || {};
    res.status(code).json(error);
  }
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on http://0.0.0.0:${PORT}`);
});
