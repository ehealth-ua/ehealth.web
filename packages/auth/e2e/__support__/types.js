defineParameterType({
  name: "selector",
  regexp: /\w+/,
  transformer(str) {
    return `[data-test="${str}"]`;
  }
});

defineParameterType({
  name: "env",
  regexp: /[A-Z0-9_]+/,
  transformer(str) {
    return process.env[str];
  }
});
