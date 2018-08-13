import React from "react";
import styles from "./styles.module.css";

const AddressesList = ({ list = [] }) => (
  <ul className={styles.list}>
    {list.map((item, i) => (
      <li key={i}>
        {item.settlement}, {item.street} {item.building}, кв. {item.apartment} ({
          item.zip
        })
        <span>
          Область: {item.area}, Район: {item.region}
        </span>
      </li>
    ))}
  </ul>
);

export default AddressesList;
