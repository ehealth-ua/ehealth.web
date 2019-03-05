//@flow
import * as React from "react";
import { Form } from "@ehealth/components";
import { ITEMS_PER_PAGE } from "../constants/pagination";
import { BooleanValue } from "react-values";
import { Box, Flex } from "@rebass/emotion";
import Button, { IconButton } from "./Button";
import { FilterIcon, RemoveItemIcon } from "@ehealth/icons";
import { Trans } from "@lingui/macro";
import isEmpty from "lodash/isEmpty";

type SearchFormProps = {
  initialValues: Object,
  onSubmit: Object => void,
  fields: React.ElementType,
  modal?: React.ElementType,
  selected?: React.ElementType,
  decorators?: Object => void
};

const SearchForm = ({
  initialValues,
  onSubmit,
  fields: PrimarySearchFields,
  modal: SearchModalForm,
  selected: SelectedFilters,
  decorators
}: SearchFormProps) => (
  <Form
    initialValues={initialValues}
    onSubmit={params =>
      onSubmit({
        ...params,
        after: undefined,
        before: undefined,
        last: undefined,
        first: initialValues.first || ITEMS_PER_PAGE[0]
      })
    }
    decorators={decorators}
  >
    <PrimarySearchFields initialValues={initialValues} />
    {SearchModalForm && (
      <BooleanValue>
        {({ value: opened, toggle }) => (
          <>
            {opened && (
              <SearchModalForm
                initialValues={initialValues}
                onSubmit={onSubmit}
                fields={PrimarySearchFields}
                toggle={toggle}
              />
            )}
            <Flex mb={4} alignItems="center">
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
              {SelectedFilters && (
                <SelectedFilters
                  initialValues={initialValues}
                  onSubmit={onSubmit}
                />
              )}
            </Flex>
          </>
        )}
      </BooleanValue>
    )}
    <Flex mx={-1} justifyContent="flex-start">
      <Box px={1}>
        <Button variant="blue">
          <Trans>Search</Trans>
        </Button>
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
);

export default SearchForm;
