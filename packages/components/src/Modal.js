import React from "react";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import system from "@ehealth/system-components";
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

const CloseButton = system(
  {},
  {
    position: "absolute",
    top: "28px",
    right: "30px"
  }
);

const Window = system(
  {
    position: "fixed",
    p: 7,
    bg: "white",
    placement: "center"
  },
  {
    zIndex: 10,
    maxWidth: "100vw",
    maxHeight: "100vh",
    textAlign: "center",
    overflow: "auto",
    boxShadow: "0 0 7px 5px rgba(0, 0, 0, 0.1)"
  },
  "position",
  "width",
  "color",
  "space",
  "overflow",
  "textAlign",
  variant({
    prop: "placement",
    key: "placements"
  })
);

const Backdrop = system(
  {
    bg: "rgba(255, 255, 255, 0.5)"
  },
  {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  "color"
);
