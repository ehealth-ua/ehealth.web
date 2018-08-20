import React from "react";
import styled from "react-emotion/macro";
import { css } from "react-emotion";
import { prop, ifProp, withProp } from "styled-tools";

const FieldLabelView = ({
  innerRef,
  horizontal,
  label,
  children,
  wrapperIsLabel = true,
  active,
  value
}) => {
  const Wrapper = wrapperIsLabel ? FieldWrapperLabel : FieldWrapper;

  return (
    <Wrapper innerRef={innerRef} horizontal={horizontal}>
      {label && (
        <FieldLabel active={active} value={value} horizontal={horizontal}>
          {label}
        </FieldLabel>
      )}
      <FieldContent horizontal={horizontal}>{children}</FieldContent>
    </Wrapper>
  );
};

export default FieldLabelView;

export const FieldWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: ${ifProp("horizontal", "row", "column")};
  align-items: ${ifProp("horizontal", "baseline", "stretch")};
  margin-bottom: ${prop("theme.form.fieldVerticalDistance", 20)}px;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const FieldWrapperLabel = FieldWrapper.withComponent("label");

export const FieldLabel = styled.div`
  color: ${withProp(
    ["active", "value"],
    (active, value) => `${!value && !active ? "#9e9e9e" : "#3d3d3d"}`
  )};
  position: absolute;
  z-index: 2;
  left: ${withProp(
    ["active", "value"],
    (active, value) => `${!value && !active ? "25px" : "auto"}`
  )};
  right: ${withProp(
    ["active", "value"],
    (active, value) => `${!value && !active ? "auto" : "5px"}`
  )};
  top: ${withProp(
    ["active", "value"],
    (active, value) => `${!value && !active ? "14px" : "3px"}`
  )};
  font-size: ${withProp(
    ["active", "value"],
    (active, value) => `${!value && !active ? "16px" : "10px"}`
  )};
  margin-bottom: ${ifProp("horizontal", 0, 10)}px;
`;

export const FieldContent = styled.div`
  position: relative;
  width: 100%;
  ${ifProp(
    "horizontal",
    withProp(
      "theme.input.horizontalContentWidth",
      width =>
        width
          ? css`
              flex-basis: ${width}px;
            `
          : css`
              margin-left: auto;
            `
    )
  )};
`;
