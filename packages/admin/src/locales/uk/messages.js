/* eslint-disable */ module.exports = {
  languageData: {
    plurals: function(n, ord) {
      var s = String(n).split("."),
        i = s[0],
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2),
        i10 = i.slice(-1),
        i100 = i.slice(-2);
      if (ord) return n10 == 3 && n100 != 13 ? "few" : "other";
      return v0 && i10 == 1 && i100 != 11
        ? "one"
        : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14)
          ? "few"
          : (v0 && i10 == 0) ||
            (v0 && i10 >= 5 && i10 <= 9) ||
            (v0 && i100 >= 11 && i100 <= 14)
            ? "many"
            : "other";
    }
  },
  messages: {
    "contract_requests.title": "contract_requests.title",
    "legal_entities.title":
      "\u041F\u043E\u0448\u0443\u043A \u043C\u0435\u0434\u0437\u0430\u043A\u043B\u0430\u0434\u0456\u0432"
  }
};
