// This implementation based on motdotla/dotenv-expand source code

const expand = (config, environment) => {
  for (const key in config) {
    const value = environment[key] || config[key];

    if (config[key].substring(0, 2) === "\\$") {
      config[key] = value.substring(1);
    } else if (config[key].indexOf("\\$") > 0) {
      config[key] = value.replace(/\\\$/g, "$");
    } else {
      config[key] = interpolate(value, config, environment);
    }
  }

  return config;
};

const interpolate = function(value, config, environment) {
  const matches = value.match(/\$([a-zA-Z0-9_]+)|\${([a-zA-Z0-9_]+)}/g) || [];

  matches.forEach(function(match) {
    const key = match.replace(/\$|{|}/g, "");

    // process.env value 'wins' over .env file's value
    let variable = environment[key] || config[key] || "";

    // Resolve recursive interpolations
    variable = interpolate(variable, config, environment);

    value = value.replace(match, variable);
  });

  return value;
};

module.exports = expand;
