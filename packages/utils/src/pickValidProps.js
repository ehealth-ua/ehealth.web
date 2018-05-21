import isPropValid from "@emotion/is-prop-valid";

import pickProps from "./pickProps";

const pickValidProps = props => pickProps(props, isPropValid);

export default pickValidProps;
