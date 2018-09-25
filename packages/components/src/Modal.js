import React from "react";
import { createPortal } from "react-dom";
import styled from "react-emotion/macro";
import system from "system-components/emotion";
import { variant } from "styled-system";
import { CloseIcon } from "@ehealth/icons";

type ModalProps = {
  backdrop?: boolean,
  onClose?: () => mixed,
  children: React.Element<any>
};

const Modal = ({ backdrop, onClose, children, ...props }: ModalProps) =>
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

const Window = system(
  {
    position: "fixed",
    p: 5,
    bg: "white",
    maxWidth: "100vw",
    maxHeight: "100vh",
    textAlign: "center",
    placement: "center"
  },
  `
    box-shadow: 0 0 7px 5px rgba(0, 0, 0, 0.1);
    overflow: auto;
  `,
  "width",
  variant({
    prop: "placement",
    key: "placements"
  })
);

const Backdrop = system({
  position: "fixed",
  bg: "rgba(255, 255, 255, 0.5)",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
});
