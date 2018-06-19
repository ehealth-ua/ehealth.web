import React from "react";
import styled from "react-emotion/macro";
import { css } from "react-emotion";
import { prop, ifProp, withProp } from "styled-tools";

const FieldView = ({
  innerRef,
  horizontal,
  label,
  children,
  wrapperIsLabel = true
}) => {
  const Wrapper = wrapperIsLabel ? FieldWrapperLabel : FieldWrapper;

  return (
    <Wrapper innerRef={innerRef} horizontal={horizontal}>
      {label && <FieldLabel horizontal={horizontal}>{label}</FieldLabel>}
      <FieldContent horizontal={horizontal}>{children}</FieldContent>
    </Wrapper>
  );
};

export default FieldView;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: ${ifProp("horizontal", "row", "column")};
  align-items: ${ifProp("horizontal", "baseline", "stretch")};
  margin-bottom: ${prop("theme.form.fieldVerticalDistance", 20)}px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FieldWrapperLabel = FieldWrapper.withComponent("label");

export const FieldLabel = styled.div`
  color: #3d3d3d;
  flex-basis: ${ifProp(
    "horizontal",
    withProp("theme.input.horizontalLabelWidth", b => (b ? `${b}px` : "auto"))
  )};
  font-size: ${prop("theme.input.labelFontSize", 16)}px;
  font-weight: ${prop("theme.input.labelFontWeight", 400)};
  margin-bottom: ${ifProp("horizontal", 0, 10)}px;
  text-align: left;
`;

export const FieldContent = styled.div`
  position: relative;
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
