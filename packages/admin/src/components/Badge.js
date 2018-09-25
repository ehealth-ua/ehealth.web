import system from "system-components/emotion";

const Badge = system(
  {
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
    lineHeight: 1,
    textAlign: "center",
    p: 1,
    minWidth: 20,
    minHeight: 20,
    borderRadius: 2,
    bg: "blue"
  },
  `
    display: inline-block;
    vertical-align: middle;
    text-transform: uppercase;
  `
);

export default Badge;
