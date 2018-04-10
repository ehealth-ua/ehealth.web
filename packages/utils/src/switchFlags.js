const switchFlags = (switches, defaultValue) => props => {
  const name = Object.keys(switches).find(name => props[name]);
  return name ? switches[name] : defaultValue;
};

export default switchFlags;
