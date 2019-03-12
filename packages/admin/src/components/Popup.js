import React, { useState } from "react";
import { Modal } from "@ehealth/components";
import { Box, Flex, Heading } from "@rebass/emotion";
import Button from "./Button";
import { Trans } from "@lingui/macro";

const Popup = ({
  title,
  children,
  render = children,
  renderToggle: ToggleButton,
  cancelText = <Trans>Return</Trans>,
  okText = title,
  okButtonProps = { type: "submit", variant: "red" },
  cancelButtonProps = { variant: "blue" },
  width = 760,
  onCancel,
  onOk,
  renderFooter: Footer = PopupFooter,
  justifyButtons = "center",
  formId
}) => {
  const [toggleState, setToggleState] = useState(false);

  const toggle = () => setToggleState(!toggleState);

  return (
    <>
      <ToggleButton onClick={toggle} opened={toggleState} />
      {toggleState && (
        <Modal width={width} backdrop>
          <Heading as="h1" fontWeight="normal" mb={6}>
            {title}
          </Heading>
          {render(toggle, toggleState)}
          <Footer
            onCancel={onCancel}
            toggle={toggle}
            cancelButtonProps={cancelButtonProps}
            cancelText={cancelText}
            okButtonProps={okButtonProps}
            onOk={onOk}
            okText={okText}
            justifyButtons={justifyButtons}
            formId={formId}
          />
        </Modal>
      )}
    </>
  );
};

const PopupFooter = ({
  onCancel,
  toggle,
  cancelButtonProps,
  cancelText,
  okButtonProps,
  onOk,
  okText,
  justifyButtons,
  formId
}) => (
  <Flex justifyContent={justifyButtons} as="footer">
    <Box mr={20}>
      <Button onClick={onCancel || toggle} {...cancelButtonProps}>
        {cancelText}
      </Button>
    </Box>
    <Button {...okButtonProps} onClick={onOk} form={formId}>
      {okText}
    </Button>
  </Flex>
);

export default Popup;
