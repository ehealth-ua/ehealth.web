//@flow
import * as React from "react";
import { Form } from "@ehealth/components";
import { Box, Flex } from "@rebass/emotion";
import Button, { IconButton } from "./Button";
import { RemoveItemIcon } from "@ehealth/icons";
import { Trans } from "@lingui/macro";
import isEmpty from "lodash/isEmpty";
import SelectedFilters from "./SelectedFilters";
import SearchModalForm from "./SearchModalForm";
import resetPaginationParams from "../helpers/resetPaginationParams";

type SearchFormProps = {
  initialValues: Object,
  onSubmit: Object => void,
  renderPrimary: React.ElementType,
  renderSecondary?: React.ElementType,
  decorators?: Object => void,
  searchButton?: React.ElementType
};

const SearchForm = ({
  initialValues,
  onSubmit,
  renderPrimary: PrimarySearchFields,
  renderSecondary: SecondarySearchFields,
  decorators,
  searchButton: SearchButton = DefaultSearchButton
}: SearchFormProps) => (
  <Form
    initialValues={initialValues}
    onSubmit={params =>
      onSubmit({
        ...params,
        ...resetPaginationParams(initialValues)
      })
    }
    decorators={decorators}
  >
    <PrimarySearchFields initialValues={initialValues} />
    {SecondarySearchFields && (
      <Flex mb={4} alignItems="center">
        <SearchModalForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          searchButton={SearchButton}
        >
          <PrimarySearchFields initialValues={initialValues} />
          <SecondarySearchFields initialValues={initialValues} />
        </SearchModalForm>
        <SelectedFilters initialValues={initialValues} onSubmit={onSubmit} />
      </Flex>
    )}
    <Flex mx={-1} justifyContent="flex-start">
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
);

const DefaultSearchButton = () => (
  <Button variant="blue">
    <Trans>Search</Trans>
  </Button>
);

export default SearchForm;
