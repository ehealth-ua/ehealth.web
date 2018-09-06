import React from "react";
import Link from "../../components/Link";

const patients = [{ id: "abc", name: "User1" }, { id: "123", name: "User2" }];

const List = props => (
  <>
    <ul role="navigation">
      {patients.map((patient, i) => (
        <li key={i}>
          <Link to={patient.id}>{patient.name}</Link>
        </li>
      ))}
    </ul>
  </>
);

export default List;
