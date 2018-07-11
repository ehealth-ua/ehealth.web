import React from "react";
import { createPortal } from "react-dom";
import styled from "react-emotion/macro";
import system from "system-components/emotion";
import { complexStyle } from "styled-system";
import { Fixed } from "rebass/emotion";
import { CloseIcon } from "@ehealth/icons";

import Link from "./Link";

const Modal = ({ backdrop, onClose, children, ...props }) =>
  createPortal(
    <>
      {backdrop && <Backdrop onClick={onClose} />}
      <Window {...props}>
        {onClose && (
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        )}

        {children}
      </Window>
    </>,
    window.document.body
  );

export default Modal;

const CloseButton = styled.button`
  position: absolute;
  top: 28px;
  right: 30px;
`;

const placement = complexStyle({
  prop: "placement",
  alias: "place",
  key: "placements"
});

const Window = system(
  {
    is: Fixed,
    p: 5,
    bg: "white",
    maxWidth: "100vw",
    maxHeight: "100vh",
    textAlign: "center",
    place: "center"
  },
  `
    box-shadow: 0 0 7px 5px rgba(227, 223, 223, 0.5);
    overflow: auto
  `,
  "width",
  placement
);

const Backdrop = system({
  is: Fixed,
  bg: "rgba(255, 255, 255, 0.5)",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
});
