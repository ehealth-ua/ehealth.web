"Intl" in this &&
  Intl.Collator &&
  Intl.Collator.supportedLocalesOf &&
  Intl.Collator.supportedLocalesOf("sr-Cyrl-XK").length === 1 &&
  Intl.DateTimeFormat &&
  Intl.DateTimeFormat.supportedLocalesOf &&
  Intl.DateTimeFormat.supportedLocalesOf("sr-Cyrl-XK").length === 1 &&
  Intl.NumberFormat &&
  Intl.NumberFormat.supportedLocalesOf &&
  Intl.NumberFormat.supportedLocalesOf("sr-Cyrl-XK").length === 1;
