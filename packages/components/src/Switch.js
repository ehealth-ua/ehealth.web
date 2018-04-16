const Switch = ({ value, default: defaultCase = null, ...cases }) =>
  cases[value] || defaultCase;

export default Switch;
