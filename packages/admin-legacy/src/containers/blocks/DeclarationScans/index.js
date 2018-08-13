import React from "react";

import { H2 } from "../../../components/Title";
import Line from "../../../components/Line";
import Gallery from "../../../components/Gallery";
import ShowWithScope from "../ShowWithScope";

export default class DeclarationScans extends React.Component {
  render() {
    const { declaration = {} } = this.props;

    return (
      <ShowWithScope scope="declaration_documents:read">
        {declaration.images ? (
          <div>
            <H2>Скани документів</H2>

            <Gallery images={declaration.images} />
            <Line />
          </div>
        ) : null}
      </ShowWithScope>
    );
  }
}
