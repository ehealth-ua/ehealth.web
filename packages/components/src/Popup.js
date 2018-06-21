import React from "react";
import { createPortal } from "react-dom";
import styled from "react-emotion/macro";

import { CloseIcon } from "@ehealth/icons";
import { Link } from "@ehealth/components";

const Popup = ({ onClose = () => {}, children }) => {
  return (
    <Overlay>
      <Fade />
      <PopupWindow>
        <Link onClick={onClose}>
          <CloseButton />
        </Link>

        {children}

        <LinkContainer>
          <Link size="small" onClick={onClose}>
            Повернутися
          </Link>
        </LinkContainer>
      </PopupWindow>
    </Overlay>
  );
};

export default Popup;

const Overlay = ({ children }) => {
  return createPortal(children, window.document.body);
};

const CloseButton = styled(CloseIcon)`
  position: absolute;
  top: 28px;
  right: 30px;
`;

const PopupWindow = styled.div`
  position: absolute;
  text-align: center;
  width: 753px;
  height: 652px;
  background-color: #fff;
  opacity: 1;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 7px 5px rgba(227, 223, 223, 0.5);
  padding: 45px 0 0 0;

  @media (max-width: 753px) {
    top: 0;
    width: 100%;
    padding-top: 10px;
  }
`;

const LinkContainer = styled.div`
  margin: 4px 0;
`;

const Fade = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  opacity: 0.5;
`;
