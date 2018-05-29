import React, { Fragment } from "react";
import { Query } from "react-apollo";
import { gql } from "graphql.macro";
import styled from "react-emotion/macro";

import { CabinetTable, Link } from "@ehealth/components";
import DECLARATION_STATUSES from "../helpers/statuses";

import ActiveDeclaration from "../blocks/ActiveDeclaration";

class PatientDeclarations extends React.Component {
  state = {
    show: false
  };
  render() {
    const { data } = this.props;
    const { show } = this.state;

    const [active] = data.filter(
      ({ status }) => status === "active" || status === "pending_verification"
    );
    return (
      <>
        <ActiveDeclaration active={active} blur={show} />
        <ShowBlock>
          <Link
            upperCase
            bold
            center
            onClick={() =>
              this.setState({
                show: !this.state.show
              })
            }
          >
            Показати історію декларацій
          </Link>
        </ShowBlock>
        {show && (
          <CabinetTable
            data={data}
            renderRow={({
              start_date,
              status,
              employee: { party: { last_name, first_name, second_name } },
              division: { name: division_name },
              legal_entity: { name: legal_entity_name },
              details
            }) => ({
              start_date,
              status: DECLARATION_STATUSES[status],
              division_name,
              employee: (
                <Fragment>
                  {last_name} {first_name} {second_name}
                </Fragment>
              ),
              legal_entity_name,
              action: (
                <Link bold to="/detail">
                  Показати деталі
                </Link>
              )
            })}
            header={{
              start_date: "Дата ухвалення декларації",
              status: "Статус",
              division_name: "Назва відділення",
              employee: (
                <Fragment>
                  ПІБ<br /> лікаря
                </Fragment>
              ),
              doctor_contact: "Контакті дані лікаря",
              legal_entity_name: "Медзаклад",
              action: "Дія"
            }}
          />
        )}
      </>
    );
  }
}
export default PatientDeclarations;

const ShowBlock = styled.div`
  text-align: center;
  margin: 45px 0;
`;
