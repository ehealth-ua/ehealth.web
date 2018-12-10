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
    "le.search_legal_entities":
      "\u041F\u043E\u0448\u0443\u043A \u043C\u0435\u0434\u0437\u0430\u043A\u043B\u0430\u0434\u0456\u0432",
    "nav.accounts":
      "\u041E\u0431\u043B\u0456\u043A\u043E\u0432\u0456 \u0437\u0430\u043F\u0438\u0441\u0438",
    "nav.black_list_users":
      "\u0417\u0430\u0431\u043B\u043E\u043A\u043E\u0432\u0430\u043D\u0456 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0456",
    "nav.clinics_verification":
      "\u041F\u0456\u0434\u0442\u0432\u0435\u0440\u0434\u0436\u0435\u043D\u043D\u044F \u043C\u0435\u0434\u0437\u0430\u043A\u043B\u0430\u0434\u0456\u0432",
    "nav.configuration":
      "\u041A\u043E\u043D\u0444\u0456\u0433\u0443\u0440\u0430\u0446\u0456\u044F \u0441\u0438\u0441\u0442\u0435\u043C\u0438",
    "nav.contract_requests":
      "\u0417\u0430\u044F\u0432\u0438 \u043D\u0430 \u0443\u043A\u043B\u0430\u0434\u0435\u043D\u043D\u044F \u0434\u043E\u0433\u043E\u0432\u043E\u0440\u0443",
    "nav.contracts": "\u0414\u043E\u0433\u043E\u0432\u043E\u0440\u0438",
    "nav.declarations":
      "\u0414\u0435\u043A\u043B\u0430\u0440\u0430\u0446\u0456\u0457",
    "nav.dictionaries": "\u0421\u043B\u043E\u0432\u043D\u0438\u043A\u0438",
    "nav.employees":
      "\u0421\u043F\u0456\u0432\u0440\u043E\u0431\u0456\u0442\u043D\u0438\u043A\u0438",
    "nav.innm": "\u041C\u041D\u041D",
    "nav.innm_dosage":
      "\u041B\u0456\u043A\u0430\u0440\u0441\u044C\u043A\u0430 \u0444\u043E\u0440\u043C\u0430",
    "nav.jobs":
      "\u0417\u0430\u0434\u0430\u0447\u0456 \u0432 \u043F\u0440\u043E\u0446\u0435\u0441\u0456 \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u043D\u044F",
    "nav.legal_entities":
      "\u041C\u0435\u0434\u0437\u0430\u043A\u043B\u0430\u0434\u0438",
    "nav.legal_entity_merge_jobs":
      "\u041F\u0456\u0434\u043F\u043E\u0440\u044F\u0434\u043A\u0443\u0432\u0430\u043D\u043D\u044F \u043C\u0435\u0434\u0437\u0430\u043A\u043B\u0430\u0434\u0456\u0432",
    "nav.list_of_medical_programs":
      "\u041F\u0435\u0440\u0435\u043B\u0456\u043A \u043C\u0435\u0434. \u043F\u0440\u043E\u0433\u0440\u0430\u043C",
    "nav.medical_program": "\u041F\u0440\u043E\u0433\u0440\u0430\u043C\u0438",
    "nav.medication_dispenses":
      "\u0412\u0456\u0434\u043F\u0443\u0441\u043A\u0438 \u0440\u0435\u0446\u0435\u043F\u0442\u0456\u0432",
    "nav.medicines":
      "\u041C\u0435\u0434\u0438\u043A\u0430\u043C\u0435\u043D\u0442\u0438",
    "nav.pending_declarations":
      "\u0414\u0435\u043A\u043B\u0430\u0440\u0430\u0446\u0456\u0457 \u043D\u0430 \u0440\u043E\u0437\u0433\u043B\u044F\u0434\u0456",
    "nav.pending_employees":
      "\u0421\u043F\u0456\u0432\u0440\u043E\u0431\u0456\u0442\u043D\u0438\u043A\u0438 \u043D\u0430 \u0440\u043E\u0437\u0433\u043B\u044F\u0434\u0456",
    "nav.persons": "\u041F\u0430\u0446\u0456\u0435\u043D\u0442\u0438",
    "nav.program_participants":
      "\u0423\u0447\u0430\u0441\u043D\u0438\u043A\u0438 \u043F\u0440\u043E\u0433\u0440\u0430\u043C",
    "nav.recipes": "\u0420\u0435\u0446\u0435\u043F\u0442\u0438",
    "nav.registers": "\u0420\u0435\u0454\u0441\u0442\u0440\u0438",
    "nav.registers_entries":
      "\u0417\u0430\u043F\u0438\u0441\u0438 \u0440\u0435\u0454\u0441\u0442\u0440\u0443",
    "nav.reimbursement_report": "\u0417\u0432\u0456\u0442",
    "nav.reports": "\u0417\u0432\u0456\u0442\u0438",
    "nav.reset_authentication_method":
      "\u0421\u043A\u0438\u043D\u0443\u0442\u0438 \u043C\u0435\u0442\u043E\u0434 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0456\u0457",
    "nav.statistic":
      "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430",
    "nav.trade_name":
      "\u0422\u043E\u0440\u0433\u0456\u0432\u0435\u043B\u044C\u043D\u0435 \u043D\u0430\u0439\u043C\u0435\u043D\u0443\u0432\u0430\u043D\u043D\u044F",
    "nav.users":
      "\u041A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0456"
  }
};
