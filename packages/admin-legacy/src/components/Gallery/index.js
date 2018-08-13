import React from "react";
import { connect } from "react-redux";
import Lightbox from "react-images";

import classnames from "classnames";
import { getDictionary } from "../../reducers";

import styles from "./styles.module.css";

const PERSON_TYPE = {
  "person.": "",
  "confidant_person.0.PRIMARY.RELATIONSHIP.": "Перша довірена особа: ",
  "confidant_person.1.SECONDARY.RELATIONSHIP.": "Друга довірена особа: "
};

class Gallery extends React.Component {
  state = {
    lightboxIsOpen: false,
    currentImage: 0,
    list: []
  };

  componentDidMount() {
    Promise.all(
      this.props.images.map(i =>
        this.hasImage(i.url)
          .then(resp => resp)
          .catch(() => null)
      )
    ).then(list => this.setState({ list }));
  }

  openImage(index) {
    this.setState({ currentImage: index, lightboxIsOpen: true });
  }

  hasImage = url =>
    new Promise((resolve, reject) => {
      const temp = new Image();
      temp.src = url;
      temp.onerror = e => reject(e);
      temp.onload = () => resolve(url);
    });

  render() {
    const {
      images = [],
      document_type,
      document_relationship_type
    } = this.props;
    const mergedDocs = {
      ...document_relationship_type.values,
      ...document_type.values
    };

    const MERGED_TYPES = {};
    Object.keys(PERSON_TYPE).map(person_type =>
      Object.keys(mergedDocs).map(
        item =>
          (MERGED_TYPES[`${person_type}${item}`] = `${
            PERSON_TYPE[person_type]
          }${mergedDocs[item]}`)
      )
    );
    return (
      <div>
        <ul className={styles.images}>
          {(this.state.list || []).map((image, i) => (
            <li
              onClick={() => image && this.openImage(i)}
              key={i}
              className={classnames(
                styles.image,
                !image && styles.image_notfound
              )}
            >
              <span
                className={classnames(styles.image__el)}
                style={
                  image && {
                    backgroundImage: `url(${image})`
                  }
                }
              />
              <span className={styles.image__text}>
                {MERGED_TYPES[images[i].type]}
              </span>
            </li>
          ))}
        </ul>
        <Lightbox
          images={images.map(image => ({
            src: image.url,
            caption: MERGED_TYPES[image.type] || ""
          }))}
          currentImage={this.state.currentImage}
          onClickPrev={() =>
            this.setState({ currentImage: this.state.currentImage - 1 })
          }
          onClickNext={() =>
            this.setState({ currentImage: this.state.currentImage + 1 })
          }
          isOpen={this.state.lightboxIsOpen}
          onClose={() => this.setState({ lightboxIsOpen: false })}
        />
      </div>
    );
  }
}

export default connect(state => ({
  document_type: getDictionary(state, "DOCUMENT_TYPE"),
  document_relationship_type: getDictionary(state, "DOCUMENT_RELATIONSHIP_TYPE")
}))(Gallery);
