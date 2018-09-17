import { style, util, compose } from "styled-system";

export const gradientStyle = ({ cssFunction, ...options }) => props => {
  const colors = util.get(props.theme, "colors") || {};
  const transformValue = transformGradient(cssFunction, colors);

  return style({ ...options, transformValue })(props);
};

const transformGradient = (cssFunction, colors) => value => {
  const args = Array.isArray(value)
    ? value.map(transformColorStop(colors)).join(", ")
    : value;

  return `${cssFunction}(${args})`;
};

const transformColorStop = colors => colorStop => {
  const getColor = value => util.get(colors, value) || value;

  if (Array.isArray(colorStop)) {
    const [color, length] = colorStop;
    return [getColor(color), length].join(" ");
  } else {
    return getColor(colorStop);
  }
};

export const linearGradient = gradientStyle({
  prop: "linearGradient",
  cssProperty: "backgroundImage",
  cssFunction: "linear-gradient",
  key: "gradients"
});

export const radialGradient = gradientStyle({
  prop: "radialGradient",
  cssProperty: "backgroundImage",
  cssFunction: "radial-gradient",
  key: "gradients"
});

export default compose(
  linearGradient,
  radialGradient
);
