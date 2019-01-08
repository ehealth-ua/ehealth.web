import React, { Component } from "react";
import styled from "@emotion/styled";
import { Query, Mutation } from "react-apollo";
import { loader } from "graphql.macro";

import {
  Heading,
  Link,
  Button,
  LocationParams,
  Pagination,
  Modal,
  Spinner
} from "@ehealth/components";
import { getDefinitions } from "@ehealth/utils";
import { PencilIcon } from "@ehealth/icons";
import Section from "../components/Section";
import DefinitionListView from "../components/DefinitionListView";
import DictionaryValue from "../components/DictionaryValue";
import env from "../env";

const AuthenticationFactorQuery = loader(
  "../graphql/AuthenticationFactorQuery.graphql"
);
const ApprovalsRequestQuery = loader(
  "../graphql/ApprovalsRequestQuery.graphql"
);
const DeleteApprovalMutation = loader(
  "../graphql/DeleteApprovalMutation.graphql"
);

const SecurityPage = () => (
  <Query query={AuthenticationFactorQuery}>
    {({ loading, error, data }) => {
      if (loading || error) return null;
      const {
        factor: { data: factor }
      } = data;
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
                      На жаль, другий фактор авторизації був скинутий.
                      <br />
                      Для того, щоб його задати повторно необхідно ще раз пройти
                      процес{" "}
                      <Link
                        href={`${env.REACT_APP_OAUTH_URL}/?client_id=${
                          env.REACT_APP_CLIENT_ID
                        }&redirect_uri=${env.REACT_APP_OAUTH_REDIRECT_URI}`}
                      >
                        авторизації
                      </Link>
                    </p>
                  )}
                </>
              )}
            <ApprovalsBlock />
          </Section>
        </>
      );
    }}
  </Query>
);

const ApprovalsBlock = () => (
  <LocationParams>
    {({ locationParams: { page = 1 } }) => {
      return (
        <Query query={ApprovalsRequestQuery} variables={{ page }}>
          {({ loading, error, data, refetch }) => {
            if (loading || error) return <Spinner />;
            const {
              data: dataApprovals,
              paging: { totalPages }
            } = data.approvals;
            const approvals = getDefinitions({
              data: dataApprovals,
              keyExtractor: ({ clientId }) => `approvals.${clientId}`,
              renderLabel: ({ clientName }) => (
                <Heading.H4 weight="bold" upperCase color="red">
                  {clientName}
                </Heading.H4>
              ),
              renderItem: props => <ScopeView {...props} onDelete={refetch} />
            });
            return (
              <ApprovalsComponent>
                <Heading.H3 weight="bold">
                  Доступ до персональних даних
                </Heading.H3>

                <DefinitionListView
                  labels={approvals.labels}
                  data={approvals.items}
                />
                <Pagination totalPages={totalPages} />
              </ApprovalsComponent>
            );
          }}
        </Query>
      );
    }}
  </LocationParams>
);

const SecurityBlock = ({ phone }) => (
  <DefinitionListView
    labels={{
      phone: "Номер телефону"
    }}
    data={{
      phone: (
        <Link
          href={`${env.REACT_APP_UPDATE_FACTOR_URL}/?client_id=${
            env.REACT_APP_CLIENT_ID
          }&redirect_uri=${env.REACT_APP_OAUTH_REDIRECT_URI}`}
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
);

class ScopeView extends Component {
  state = {
    showModal: false
  };

  render() {
    const { clientName, clientId, scope, id, onDelete } = this.props;
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
                clientName={clientName}
                onDelete={onDelete}
              />
            )}
          </Mutation>
        )}
      </>
    );
  }
}

const ConfirmModal = ({ close, deleteApproval, id, clientName, onDelete }) => (
  <Modal width={760} onClose={close} placement="center" backdrop>
    <Heading.H1>
      {`
        Ви впевненні що хочете видалити
        доступ ${clientName}?`}
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
