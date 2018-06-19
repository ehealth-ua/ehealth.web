import { Component } from "react";
import { ParentClient, ChildClient } from "@ehealth/postmessage-client";

class Parent extends Component {
  componentDidMount() {
    this.client = new ParentClient();
  }

  componentWillUnmount() {
    this.client.close();
  }

  render() {
    const { children, render = children } = this.props;
    const { signData } = this;
    return render({ signData });
  }

  signData = async data => {
    const { url, features } = this.props;

    await this.client.open({ url, features });
    const result = await this.client.call("signData", [data]);
    this.client.close();

    return result;
  };
}

class Child extends Component {
  state = {
    data: null
  };

  signedData = new Promise((resolve, reject) => {
    this.fullfillSignedData = resolve;
    this.rejectSignedData = reject;
  });

  componentDidMount() {
    const { allowedOrigins } = this.props;

    this.client = new ChildClient({
      signData: data => {
        this.setState({ data });
        return this.signedData;
      }
    });

    this.client.init({ allowedOrigins });
  }

  componentWillUnmount() {
    this.client.disconnect();
  }

  render() {
    const { children, render = children } = this.props;
    const { data } = this.state;
    const {
      fullfillSignedData: onSignSuccess,
      rejectSignedData: onSignError
    } = this;

    return render({ data, onSignSuccess, onSignError });
  }
}

export default { Parent, Child };
