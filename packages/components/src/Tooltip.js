import React, { Component, Fragment } from "react";
import { createPortal } from "react-dom";
import { compose } from "recompose";

const TRANSLATE_HORIZONTAL = "translateX(-50%)";
const TRANSLATE_VERTICAL = "translateY(-50%)";

class Tooltip extends Component {
  static defaultProps = {
    leaveTimeout: 100,
    onMouseEnter: () => {},
    onMouseLeave: () => {}
  };

  state = {
    active: false
  };

  componentDidMount() {
    this.updateParentRect();
  }

  render() {
    const {
      parent,
      children,
      renderParent = parent,
      renderOverlay = children
    } = this.props;

    const { parentRect } = this.state;

    return (
      <Fragment>
        {renderParent(this.getParentStateAndHelpers())}
        <Overlay parentRect={parentRect}>
          {overlay => renderOverlay(this.getOverlayStateAndHelpers(overlay))}
        </Overlay>
      </Fragment>
    );
  }

  getParentStateAndHelpers() {
    const { active, getParentProps: getProps } = this;
    return { active, getProps };
  }

  getParentProps = ({
    refKey = "ref",
    onMouseEnter,
    onMouseLeave,
    ...props
  } = {}) => ({
    [refKey]: e => (this.parent = e),
    onMouseEnter: composeEventHandlers(onMouseEnter, this.onMouseEnter),
    onMouseLeave: composeEventHandlers(onMouseLeave, this.onMouseLeave),
    ...props
  });

  getOverlayStateAndHelpers({ getProps, ...overlay }) {
    const { active, getOverlayProps } = this;
    return {
      active,
      getProps: compose(getProps, getOverlayProps),
      ...overlay
    };
  }

  getOverlayProps = ({ onMouseEnter, onMouseLeave, ...props } = {}) => ({
    onMouseEnter: composeEventHandlers(onMouseEnter, this.onMouseEnter),
    onMouseLeave: composeEventHandlers(onMouseLeave, this.onMouseLeave),
    ...props
  });

  get active() {
    return this.props.active === undefined
      ? this.state.active
      : this.props.active;
  }

  onMouseEnter = props => {
    if (this.mouseLeaveTimeout) clearTimeout(this.mouseLeaveTimeout);

    this.updateParentRect();
    this.props.onMouseEnter(props);
    if (this.props.active === undefined) this.setState({ active: true });
  };

  onMouseLeave = event => {
    this.mouseLeaveTimeout = setTimeout(
      () => this.onMouseLeaveImmediate(event),
      this.props.leaveTimeout
    );
  };

  onMouseLeaveImmediate = event => {
    this.props.onMouseLeave(event);
    if (this.props.active === undefined) {
      this.setState({ active: false });
    }
  };

  updateParentRect() {
    const {
      x: documentX,
      y: documentY
    } = document.documentElement.getBoundingClientRect();

    const {
      x: parentX,
      y: parentY,
      width,
      height
    } = this.parent.getBoundingClientRect();

    const x = parentX - documentX;
    const y = parentY - documentY;

    this.setState({ parentRect: { x, y, width, height } });
  }
}

const Overlay = ({
  position = "bottom",
  offset = 0,
  parentRect,
  children,
  render = children
}) => {
  if (!parentRect) return null;

  const getProps = ({ style, ...props } = {}) => ({
    style: { ...style, ...getOverlayStyle(position, parentRect, offset) },
    ...props
  });

  return createPortal(render({ position, getProps }), window.document.body);
};

const getOverlayStyle = (position, parentRect, offset) => {
  const { x, y, width, height } = parentRect;

  let left;
  let top;
  let transform;

  switch (position) {
    case "top":
      left = x + width / 2;
      top = y - offset;
      transform = TRANSLATE_HORIZONTAL;
      break;
    case "right":
      left = x - offset;
      top = y + height / 2;
      transform = TRANSLATE_VERTICAL;
      break;
    case "bottom":
      left = x + width / 2;
      top = y + height + offset;
      transform = TRANSLATE_HORIZONTAL;
      break;
    case "right":
      left = x + width + offset;
      top = y + height / 2;
      transform = TRANSLATE_VERTICAL;
      break;
  }

  return { position: "absolute", left, top, transform };
};

const composeEventHandlers = (...fns) => (event, ...args) =>
  fns.some(fn => {
    fn && fn(event, ...args);
    return event.defaultPrevented;
  });

export default Tooltip;
