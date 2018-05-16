import React from "react";
import styled from "react-emotion/macro";
import { Title } from "@ehealth/components";
import { PencilIcon } from "@ehealth/icons";

import DefinitionListView from "../components/DefinitionListView";

const temp_data_1 = {
  name: "Игорь",
  bday: "34/09",
  country: "Украина",
  city: "Киев",
  citizenship: "Украинец",
  sex: "М"
};
const temp_data_2 = {
  edrpou: "3478****33",
  passport: "ME713400"
};
const temp_data_3 = {
  registrationAddress: "г.Киев, ул. Драгомирова 34, кв.3434",
  residence: "г.Киев, ул. Драгомирова 34, кв.3434",
  contacts: "Телефон",
  secret: "Рыба-мечь"
};
const temp_data_4 = {
  name: "Игорь",
  phone: "+380993333343"
};
const temp_data_5 = {
  email: "erwrew@gmail.com",
  phone: "+380993333343"
};

const ProfilePage = () => (
  <>
    <Title.H1>мій профіль</Title.H1>
    <DefinitionListSection>
      <SubTitle>
        Персональні дані
        <EditLink onClick={() => console.log("click")}>
          <EditIcon height="14" width="14" />
          Редагувати профіль
        </EditLink>
      </SubTitle>
      <DefinitionListView
        labels={{
          name: "ПІБ",
          bday: "Дата народження",
          country: "Країна народження",
          city: "Місто народження",
          citizenship: "Громадянство",
          sex: "Стать"
        }}
        data={temp_data_1}
      />
    </DefinitionListSection>
    <DefinitionListSection>
      <DefinitionListView
        labels={{
          edrpou: "ІНН",
          passport: "Паспорт"
        }}
        data={temp_data_2}
      />
    </DefinitionListSection>
    <DefinitionListSection>
      <DefinitionListView
        labels={{
          registrationAddress: "Адреса реєстрації",
          residence: "Адреса проживання",
          contacts: "Бажаний метод зв’язку",
          secret: "Слово-пароль"
        }}
        data={temp_data_3}
      />
    </DefinitionListSection>
    <DefinitionListSection>
      <SubTitle>Контактна особа у екстреному випадку</SubTitle>
      <DefinitionListView
        labels={{
          name: "ПІБ",
          phone: "Номер телефону"
        }}
        data={temp_data_4}
      />
    </DefinitionListSection>
    <DefinitionListSection>
      <SubTitle>Авторизація</SubTitle>
      <DefinitionListView
        labels={{
          email: "Email",
          phone: "Номер телефону"
        }}
        data={temp_data_5}
      />
    </DefinitionListSection>
  </>
);

const DefinitionListSection = styled.div`
  margin: 30px 0;
  border-bottom: 1px solid #e7e7e9;
  &:last-of-type {
    border-bottom: none;
  }
`;

const SubTitle = styled.h3`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  font-size: 16px;
`;

const EditLink = styled.span`
  margin-left: auto;
  font-size: 10px;
  color: #4880ed;
  line-height: 1;
  text-transform: uppercase;
  user-select: none;
`;

const EditIcon = styled(PencilIcon)`
  margin-right: 5px;
  vertical-align: middle;
`;

export default ProfilePage;
