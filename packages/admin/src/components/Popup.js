import React from "react";
import { Modal } from "@ehealth/components";
import { Box, Flex, Heading } from "@rebass/emotion";
import Button from "./Button";
import { Trans } from "@lingui/macro";

const Popup = ({
  visible,
  title,
  children,
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
}) =>
  visible && (
    <Modal width={width} backdrop>
      <Heading as="h1" fontWeight="normal" mb={6}>
        {title}
      </Heading>
      {children}
      <Footer
        onCancel={onCancel}
        cancelButtonProps={cancelButtonProps}
        cancelText={cancelText}
        okButtonProps={okButtonProps}
        onOk={onOk}
        okText={okText}
        justifyButtons={justifyButtons}
        formId={formId}
      />
    </Modal>
  );

const PopupFooter = ({
  onCancel,
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
      <Button onClick={onCancel} {...cancelButtonProps}>
        {cancelText}
      </Button>
    </Box>
    <Button {...okButtonProps} onClick={onOk} form={formId}>
      {okText}
    </Button>
  </Flex>
);

export default Popup;
