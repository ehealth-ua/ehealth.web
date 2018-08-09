import React, { createContext, Component } from "react";
import load from "load-js";
import { Spinner } from "@ehealth/components";

const DigitalSignatureContext = createContext({});

export default class DigitalSignature extends Component {
  static Consumer = ({ children, render = children }) => (
    <DigitalSignatureContext.Consumer>
      {({ initialized, keyAvailable, authorityIndex, ds, readPrivateKey }) =>
        initialized ? (
          render({
            keyAvailable,
            authorityIndex,
            ds,
            readPrivateKey
          })
        ) : (
          <Spinner />
        )
      }
    </DigitalSignatureContext.Consumer>
  );

  state = {
    initialized: false,
    keyAvailable: false
  };

  ds = {};

  async componentDidMount() {
    const { sourceUrl, proxy } = this.props;

    await load({ url: sourceUrl, async: true });

    this.ds = await window.DigitalSignature.initialize({ proxy });
    this.setState({ initialized: true });
  }

  render() {
    return (
      <DigitalSignatureContext.Provider value={this.stateAndHelpers}>
        {this.props.children}
      </DigitalSignatureContext.Provider>
    );
  }

  get stateAndHelpers() {
    const { initialized, keyAvailable, authorityIndex } = this.state;
    const { ds, readPrivateKey } = this;

    return {
      initialized,
      keyAvailable,
      authorityIndex,
      ds,
      readPrivateKey
    };
  }

  readPrivateKey = async (file, password) => {
    const privateKey = await readFile(file);
    const ownerInfo = this.ds.ReadPrivateKeyBinary(privateKey, password);
    this.setState({ keyAvailable: true });
    return ownerInfo;
  };
}

const readFile = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onabort = reject;
    reader.onerror = reject;

    reader.onload = event => {
      const typedArray = new Uint8Array(event.target.result);
      resolve(typedArray);
    };

    reader.readAsArrayBuffer(file);
  });
