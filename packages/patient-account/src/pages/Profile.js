import React from "react";
import styled from "react-emotion/macro";

import DefinitionList from "../components/DefinitionList";
import { SectionList, Title } from "@ehealth/components";

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

const Profile = () => (
  <>
    <Title.H1>мій профіль</Title.H1>
    <DefinitionListContainer>
      <DefinitionList
        title="Персональні дані"
        label={{
          name: "ПІБ",
          bday: "Дата народження",
          country: "Країна народження",
          city: "Місто народження",
          citizenship: "Громадянство",
          sex: "Стать"
        }}
        data={temp_data_1}
        onEdit={() => console.log("click")}
      />
    </DefinitionListContainer>
    <DefinitionListContainer>
      <DefinitionList
        label={{
          edrpou: "ІНН",
          passport: "Паспорт"
        }}
        data={temp_data_2}
      />
    </DefinitionListContainer>
    <DefinitionListContainer>
      <DefinitionList
        label={{
          registrationAddress: "Адреса реєстрації",
          residence: "Адреса проживання",
          contacts: "Бажаний метод зв’язку",
          secret: "Слово-пароль"
        }}
        data={temp_data_3}
      />
    </DefinitionListContainer>
    <DefinitionListContainer>
      <DefinitionList
        title="Контактна особа у екстреному випадку"
        label={{
          name: "ПІБ",
          phone: "Номер телефону"
        }}
        data={temp_data_4}
      />
    </DefinitionListContainer>
    <DefinitionListContainer>
      <DefinitionList
        title="Авторизація"
        label={{
          email: "Email",
          phone: "Номер телефону"
        }}
        data={temp_data_5}
      />
    </DefinitionListContainer>
  </>
);

const DefinitionListContainer = styled.div`
  margin: 30px 0;
  border-bottom: 1px solid #e7e7e9;
  &:last-of-type {
    border-bottom: none;
  }
`;

export default Profile;
