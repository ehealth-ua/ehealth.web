"Intl" in this &&
  Intl.Collator &&
  Intl.Collator.supportedLocalesOf &&
  Intl.Collator.supportedLocalesOf("ta-SG").length === 1 &&
  Intl.DateTimeFormat &&
  Intl.DateTimeFormat.supportedLocalesOf &&
  Intl.DateTimeFormat.supportedLocalesOf("ta-SG").length === 1 &&
  Intl.NumberFormat &&
  Intl.NumberFormat.supportedLocalesOf &&
  Intl.NumberFormat.supportedLocalesOf("ta-SG").length === 1;
