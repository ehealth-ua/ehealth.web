"Intl" in this &&
  Intl.Collator &&
  Intl.Collator.supportedLocalesOf &&
  Intl.Collator.supportedLocalesOf("sv").length === 1 &&
  Intl.DateTimeFormat &&
  Intl.DateTimeFormat.supportedLocalesOf &&
  Intl.DateTimeFormat.supportedLocalesOf("sv").length === 1 &&
  Intl.NumberFormat &&
  Intl.NumberFormat.supportedLocalesOf &&
  Intl.NumberFormat.supportedLocalesOf("sv").length === 1;