"Intl" in this &&
  Intl.Collator &&
  Intl.Collator.supportedLocalesOf &&
  Intl.Collator.supportedLocalesOf("fa").length === 1 &&
  Intl.DateTimeFormat &&
  Intl.DateTimeFormat.supportedLocalesOf &&
  Intl.DateTimeFormat.supportedLocalesOf("fa").length === 1 &&
  Intl.NumberFormat &&
  Intl.NumberFormat.supportedLocalesOf &&
  Intl.NumberFormat.supportedLocalesOf("fa").length === 1;