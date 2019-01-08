import React from "react";
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/core";
import { Manager, Reference, Popper } from "react-popper";
import { ifProp } from "styled-tools";

const Tooltip = ({
  content,
  component: Component,
  disableHover,
  showTooltip,
  placement = "auto"
}) => (
  <Manager>
    <Reference>
      {({ ref }) => (
        <Target ref={ref} disableHover={disableHover}>
          <Component />
        </Target>
      )}
    </Reference>

    <Popper
      placement={placement}
      positionFixed
      modifiers={{
        flip: {
          behavior: ["left", "bottom", "top"]
        },
        preventOverflow: {
          padding: 20,
          boundariesElement: "viewport"
        }
      }}
    >
      {({ ref, style, placement, arrowProps, ...props }) => (
        <TooltipWrapper
          style={style}
          ref={ref}
          placement={placement}
          showTooltip={showTooltip}
        >
          {content}
          <Arrow
            style={{
              top: arrowProps.style.top ? `${arrowProps.style.top}px` : "auto",
              left: arrowProps.style.left
                ? `${arrowProps.style.left}px`
                : "auto"
            }}
            placement={placement}
            ref={arrowProps.ref}
          />
        </TooltipWrapper>
      )}
    </Popper>
  </Manager>
);

const bounce = keyframes`
  0% {
    opacity: 0;
    visibility: hidden;

  }
  50% {
    opacity: 1;
    visibility: visible;
  }
  0% {
    opacity: 0;
    visibility: hidden;
  }
`;

const TooltipWrapper = styled.div`
  max-width: 450px;
  margin: 7px;
  padding: 10px;
  background-image: linear-gradient(0deg, #f2f4f7 0%, #ffffff 100%);
  border: 1px solid #ced0da;
  border-radius: 2px;
  font-size: 14px;
  color: #354052;
  text-align: center;
  line-height: 19px;
  opacity: 0;
  visibility: hidden;
  transition: all 100ms;
  animation: ${ifProp("showTooltip", `${bounce} 1.5s ease forwards`)};
`;

const Target = styled.div`
  display: inline-block;
  line-height: 0;
  ${props =>
    !props.disableHover
      ? `&:hover + ${TooltipWrapper} {
    opacity: 1;
    visibility: visible;
  }`
      : null};
`;

const arrowPosition = ({ placement }) => {
  switch (placement) {
    case "top":
      return css`
        bottom: 0;
        transform: rotate(-135deg);
        clip-path: polygon(100% 0, 0 100%, 0 0);
      `;
    case "right":
      return css`
        right: 100%;
        transform: rotate(-135deg);
        clip-path: polygon(100% 100%, 0 0, 100% 0);
      `;
    case "bottom":
      return css`
        bottom: 100%;
        transform: rotate(-135deg);
        clip-path: polygon(100% 0%, 0% 100%, 100% 100%);
      `;
    case "left":
      return css`
        right: 0;
        transform: rotate(135deg);
        clip-path: polygon(0 0, 0 100%, 100% 0);
      `;
    default:
      return;
  }
};

const Arrow = styled.div`
  position: absolute;
  z-index: 50;
  margin: -6px;
  ${arrowPosition};
  width: 12px;
  height: 12px;
  background-image: linear-gradient(135deg, #f2f4f7 0%, #ffffff 100%);
  border: 1px solid #ced0da;
  will-change: transform;
`;

export default Tooltip;
