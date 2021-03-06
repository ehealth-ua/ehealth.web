import React from "react";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";

import { CloseIcon } from "@ehealth/icons";

type Props = {
  /** The callback to call when the modal should be closed */
  onClose: () => mixed,
  /** The content of the modal */
  children: React.Node
};

const Popup = ({ onClose = () => {}, children }: Props) =>
  createPortal(
    <>
      <Fade onClick={onClose} />
      <PopupWindow>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>

        {children}
      </PopupWindow>
    </>,
    window.document.body
  );

export default Popup;

const CloseButton = styled.button`
  position: absolute;
  top: 28px;
  right: 30px;
`;

const PopupWindow = styled.div`
  position: absolute;
  text-align: center;
  width: 753px;
  background-color: #fff;
  opacity: 1;
  top: 50px;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 7px 5px rgba(227, 223, 223, 0.5);
  padding: 60px;

  @media (max-width: 753px) {
    top: 0;
    width: 100%;
    padding-top: 10px;
  }
`;

const Fade = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  opacity: 0.5;
`;
