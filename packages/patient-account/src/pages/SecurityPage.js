import React, { Component } from "react";
import styled from "react-emotion/macro";
import { Query, Mutation } from "react-apollo";
import { gql } from "graphql.macro";
import {
  Heading,
  Link,
  Button,
  SearchParams,
  Pagination,
  Modal
} from "@ehealth/components";
import { getDefinitions } from "@ehealth/utils";
import { PencilIcon } from "@ehealth/icons";
import Section from "../components/Section";
import DefinitionListView from "../components/DefinitionListView";
import AuthenticationFactorQuery from "../graphql/AuthenticationFactorQuery.graphql";
import ApprovalsRequestQuery from "../graphql/ApprovalsRequestQuery.graphql";
import DictionaryValue from "../components/DictionaryValue";
import DeleteApprovalMutation from "../graphql/DeleteApprovalMutation.graphql";
import { prop } from "styled-tools";
import {
  REACT_APP_UPDATE_FACTOR_URL,
  REACT_APP_OAUTH_URL,
  REACT_APP_CLIENT_ID,
  REACT_APP_OAUTH_REDIRECT_URI
} from "../env";

const SecurityPage = () => (
  <Query query={AuthenticationFactorQuery}>
    {({ loading, error, data }) => {
      if (loading || error || !data.factor) return null;
      const { factor: { data: factor } } = data;
      let isActive, phone;
      if (factor.length > 0) {
        [{ isActive, factor: phone }] = factor;
      }

      return (
        <>
          <Heading.H1>Безпека</Heading.H1>
          <Section>
            <Heading.H3 weight="bold">
              Двоетапна перевірка{" "}
              {(factor.length === 0 || !isActive) && "не встановлена"}
            </Heading.H3>
            {factor.length > 0 &&
              isActive && (
                <>
                  {phone ? (
                    <SecurityBlock phone={phone} />
                  ) : (
                    <p>
                      На жаль, другий фактор авторизації був скинутий.<br />
                      Для того, щоб його задати повторно необхідно ще раз пройти
                      процес{" "}
                      <Link
                        href={`${REACT_APP_OAUTH_URL}/?client_id=${REACT_APP_CLIENT_ID}&redirect_uri=${REACT_APP_OAUTH_REDIRECT_URI}`}
                      >
                        авторизації
                      </Link>
                    </p>
                  )}
                </>
              )}
          </Section>
        </>
      );
    }}
  </Query>
);

const SecurityBlock = ({ phone }) => (
  <>
    <DefinitionListView
      labels={{
        phone: "Номер телефону"
      }}
      data={{
        phone: (
          <Link
            href={`${REACT_APP_UPDATE_FACTOR_URL}/?client_id=${REACT_APP_CLIENT_ID}&redirect_uri=${REACT_APP_OAUTH_REDIRECT_URI}`}
            size="s"
            upperCase
            color={"black"}
            icon={<PencilIcon height="14" />}
          >
            {phone}
          </Link>
        )
      }}
    />
    <SearchParams>
      {({ searchParams: { page = 1 } }) => {
        return (
          <Query query={ApprovalsRequestQuery} variables={{ page }}>
            {({ loading, error, data, refetch }) => {
              if (loading || error || !data.approvals) return null;
              const {
                data: dataApprovals,
                paging: { totalPages }
              } = data.approvals;
              const approvals = getDefinitions({
                data: dataApprovals,
                keyExtractor: ({ userId }) => `approvals.${userId}`,
                renderLabel: ({ clientId }) => clientId,
                renderItem: props => <ScopeView {...props} onDelete={refetch} />
              });
              return (
                <ApprovalsComponent>
                  <Heading.H3 weight="bold">
                    Доступ до персональних даних
                  </Heading.H3>

                  <DefinitionListView
                    labels={{
                      ...approvals.labels
                    }}
                    data={{
                      ...approvals.items
                    }}
                  />
                  <Pagination totalPages={totalPages} />
                </ApprovalsComponent>
              );
            }}
          </Query>
        );
      }}
    </SearchParams>
  </>
);

class ScopeView extends Component {
  state = {
    showModal: false
  };

  render() {
    const { clientId, scope, id, onDelete } = this.props;
    const { showModal } = this.state;
    return (
      <>
        {scope &&
          scope.split(" ").map((item, index, array) => (
            <span key={`${clientId}${index}`}>
              <DictionaryValue name="SCOPES" item={item} />
              {index < array.length - 1 && ", "}
            </span>
          ))}
        <br />
        <Link
          color="red"
          upperCase
          bold
          onClick={() => this.setState({ showModal: true })}
        >
          Видалити доступ
        </Link>
        {showModal && (
          <Mutation mutation={DeleteApprovalMutation}>
            {deleteApproval => (
              <ConfirmModal
                close={() => this.setState({ showModal: false })}
                deleteApproval={deleteApproval}
                id={id}
                clientId={clientId}
                onDelete={onDelete}
              />
            )}
          </Mutation>
        )}
      </>
    );
  }
}

const ConfirmModal = ({ close, deleteApproval, id, clientId, onDelete }) => (
  <Modal width={760} onClose={close}>
    <Heading.H1>
      {`
        Ви впевненні що хочете видалити
        доступ ${clientId}?`}
    </Heading.H1>
    <ControllButtonBlock>
      <Button
        onClick={async () => {
          try {
            await deleteApproval({
              variables: { id: id }
            });
            onDelete();
          } catch (error) {
            console.log(error);
          }
        }}
      >
        Так
      </Button>
      <Button onClick={close}>Ні</Button>
    </ControllButtonBlock>
  </Modal>
);

const ApprovalsComponent = styled.div`
  margin: 30px 0;
  padding-top: 30px;
  border-top: 1px solid #e7e7e9;
`;

const ControllButtonBlock = styled.div`
  max-width: 300px;
  margin: auto;
  display: flex;
  justify-content: space-between;
`;

export default SecurityPage;
