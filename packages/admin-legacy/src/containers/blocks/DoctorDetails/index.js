import React from "react";

import { H3 } from "../../../components/Title";
import Line from "../../../components/Line";
import ColoredText from "../../../components/ColoredText";

import BlocksList from "../BlocksList";
import ShowMore from "../ShowMore";
import DictionaryValue from "../DictionaryValue";

const DoctorDetails = ({
  doctor: { educations = [], qualifications = [] }
}) => (
  <ShowMore name="Показати документи" show_block>
    {/* TODO: It will be better to display emptiness messages here in case
        if there are no educations or qualifications */}
    {educations.length > 0 && [
      <H3 key="title">Освіта</H3>,
      <BlocksList key="blockList">
        {educations.map(
          (
            {
              issued_date,
              institution_name,
              country,
              city,
              speciality,
              degree,
              diploma_number
            },
            index
          ) => (
            <li key={index}>
              <div>
                {issued_date}, {institution_name}
              </div>
              <div>
                <ColoredText color="gray">
                  {country}, {city}
                </ColoredText>
              </div>
              {speciality}
              <div>
                <ColoredText color="gray">
                  <DictionaryValue
                    dictionary="EDUCATION_DEGREE"
                    value={degree}
                  />, диплом: {diploma_number}
                </ColoredText>
              </div>
            </li>
          )
        )}
      </BlocksList>,
      qualifications.length > 0 && <Line key="line" />
    ]}

    {qualifications.length > 0 && [
      <H3 key="h3">Кваліфікація</H3>,
      <BlocksList key="blockList">
        {qualifications.map(
          (
            {
              issued_date,
              institution_name,
              speciality,
              type,
              certificate_number
            },
            index
          ) => (
            <li key={index}>
              <div>
                {issued_date}, {institution_name}
              </div>
              {speciality}
              <div>
                <ColoredText color="gray">
                  <DictionaryValue
                    dictionary="SPEC_QUALIFICATION_TYPE"
                    value={type}
                  />, сертифікат: {certificate_number}
                </ColoredText>
              </div>
            </li>
          )
        )}
      </BlocksList>
    ]}
  </ShowMore>
);

export default DoctorDetails;
