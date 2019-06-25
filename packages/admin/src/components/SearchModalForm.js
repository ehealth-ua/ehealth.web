//@flow
import * as React from "react";
import { Form, Modal } from "@ehealth/components";
import Button, { IconButton } from "./Button";
import { Box, Flex } from "@rebass/emotion";
import { FilterIcon, RemoveItemIcon } from "@ehealth/icons";
import { Trans } from "@lingui/macro";
import isEmpty from "lodash/isEmpty";
import resetPaginationParams from "../helpers/resetPaginationParams";

type SearchModalFormProps = {
  initialValues: Object,
  onSubmit: Object => void,
  searchButton: React.ElementType,
  children: React.Node
};

const SearchModalForm = ({
  initialValues,
  onSubmit,
  searchButton: SearchButton,
  children
}: SearchModalFormProps) => {
  const [visible, setToggleState] = React.useState(false);
  const toggle = () => setToggleState(!visible);
  return (
    <>
      <IconButton
        variant="none"
        border="none"
        px={0}
        py={0}
        mr={2}
        fontSize={1}
        fontWeight="normal"
        onClick={toggle}
        type="button"
        css={{ whiteSpace: "nowrap" }}
        icon={FilterIcon}
      >
        <Trans>Show all filters</Trans>
      </IconButton>
      {visible && (
        <Modal width={990} backdrop textAlign="left" overflow="visible">
          <IconButton
            variant="none"
            border="none"
            px={0}
            py={0}
            mb={4}
            fontSize={1}
            fontWeight="normal"
            onClick={toggle}
            type="button"
            css={{ whiteSpace: "nowrap" }}
            icon={FilterIcon}
          >
            <Trans>Hide filters</Trans>
          </IconButton>
          <Form
            onSubmit={params => {
              onSubmit({
                ...params,
                ...resetPaginationParams(initialValues)
              });
              toggle();
            }}
            initialValues={initialValues}
          >
            {children}
            <Flex mx={-1} mt={4} justifyContent="flex-start">
              <Box px={1}>
                <Button variant="red" onClick={toggle}>
                  <Trans>Close</Trans>
                </Button>
              </Box>
              <Box px={1}>
                <SearchButton />
              </Box>
              <Box px={1}>
                <IconButton
                  icon={RemoveItemIcon}
                  type="reset"
                  disabled={isEmpty(initialValues.filter)}
                  onClick={() => {
                    onSubmit({
                      ...initialValues,
                      filter: null,
                      searchRequest: null
                    });
                  }}
                >
                  <Trans>Reset</Trans>
                </IconButton>
              </Box>
            </Flex>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default SearchModalForm;
