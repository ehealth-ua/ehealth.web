import React from "react";
import gql from "graphql-tag";
import { DateFormat, Trans } from "@lingui/macro";
import { Flex } from "@rebass/emotion";
import { NegativeIcon, PositiveIcon } from "@ehealth/icons";
import { parseSortingParams, stringifySortingParams } from "@ehealth/utils";
import DictionaryValue from "../../../components/DictionaryValue";
import AddressView from "../../../components/AddressView";
import Link from "../../../components/Link";
import Badge from "../../../components/Badge";
import Table from "../../../components/Table";

const LegalEntitiesTable = ({
  legalEntities,
  locationParams,
  setLocationParams
}) => (
  <Table
    data={legalEntities}
    header={{
      id: <Trans>ID</Trans>,
      name: <Trans>Legal entity name</Trans>,
      type: <Trans>Legal entity type</Trans>,
      edrpou: <Trans>EDRPOU</Trans>,
      addresses: <Trans>Address</Trans>,
      edrVerified: <Trans>EDR verified</Trans>,
      nhsVerified: <Trans>NHS verified</Trans>,
      nhsReviewed: <Trans>NHS reviewed</Trans>,
      insertedAt: <Trans>Inserted at</Trans>,
      status: <Trans>Status</Trans>,
      action: <Trans>Action</Trans>
    }}
    renderRow={({
      addresses,
      nhsVerified,
      nhsReviewed,
      edrVerified,
      status,
      insertedAt,
      databaseId,
      type,
      ...legalEntity
    }) => ({
      ...legalEntity,
      id: databaseId,
      type: <DictionaryValue name="LEGAL_ENTITY_TYPE" item={type} />,
      nhsVerified: (
        <Flex justifyContent="center">
          {nhsVerified ? <PositiveIcon /> : <NegativeIcon />}
        </Flex>
      ),
      edrVerified: (
        <Flex justifyContent="center">
          {edrVerified ? <PositiveIcon /> : <NegativeIcon />}
        </Flex>
      ),
      nhsReviewed: (
        <Flex justifyContent="center">
          {nhsReviewed ? <PositiveIcon /> : <NegativeIcon />}
        </Flex>
      ),
      insertedAt: (
        <DateFormat
          value={insertedAt}
          format={{
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
          }}
        />
      ),
      status: <Badge type="LEGALENTITY" name={status} display="block" />,
      addresses: (
        <>
          {addresses
            .filter(a => a && a.type === "REGISTRATION")
            .map(item => item && <AddressView data={item} />)}
        </>
      ),
      action: (
        <Link to={`../${legalEntity.id}`} fontWeight="bold">
          Деталі
        </Link>
      )
    })}
    sortableFields={[
      "edrpou",
      "status",
      "insertedAt",
      "nhsVerified",
      "nhsReviewed"
    ]}
    sortingParams={parseSortingParams(locationParams.orderBy)}
    onSortingChange={sortingParams =>
      setLocationParams({
        ...locationParams,
        orderBy: stringifySortingParams(sortingParams)
      })
    }
    tableName="legal-entities/search"
    whiteSpaceNoWrap={["id"]}
    hiddenFields="insertedAt"
  />
);

LegalEntitiesTable.fragments = {
  entry: gql`
    fragment LegalEntities on LegalEntity {
      id
      databaseId
      name
      edrpou
      addresses {
        ...Addresses
      }
      nhsVerified
      nhsReviewed
      edrVerified
      insertedAt
      status
      type
    }
    ${AddressView.fragments.entry}
  `
};

export default LegalEntitiesTable;
