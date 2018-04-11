import React, { createContext, Component } from "react";
import DigitalSignature from "@ehealth/iit-digital-signature";

const DigitalSignatureContext = createContext();

export default class ReactDigitalSignature extends Component {
  static Producer = ({ children, render = children }) => (
    <DigitalSignatureContext.Consumer>
      {({
        initialized,
        authorityIndex,
        ds: { authorities },
        setAuthority,
        readPrivateKey
      }) =>
        initialized
          ? render({
              authorityIndex,
              authorities,
              setAuthority,
              readPrivateKey
            })
          : null
      }
    </DigitalSignatureContext.Consumer>
  );

  static Consumer = ({ children, render = children }) => (
    <DigitalSignatureContext.Consumer>
      {({ keyAvailable, ds }) => (keyAvailable ? render({ ds }) : null)}
    </DigitalSignatureContext.Consumer>
  );

  state = {
    initialized: false,
    keyAvailable: false,
    authorityIndex: 0
  };

  ds = {};

  async componentDidMount() {
    this.ds = await DigitalSignature.initialize();
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
    const { ds, readPrivateKey, setAuthority } = this;

    return {
      initialized,
      keyAvailable,
      authorityIndex,
      ds,
      readPrivateKey,
      setAuthority
    };
  }

  setAuthority = authorityIndex => {
    this.ds.setAuthoritySettings(authorityIndex);
    this.setState({ authorityIndex });
  };

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
