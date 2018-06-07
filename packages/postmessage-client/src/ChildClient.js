import Client from "./Client";

export default class ChildClient extends Client {
  async init({ allowedOrigins = [] }) {
    if (!window.opener)
      throw new Error("Client should be initailized from the popup window");

    this.remoteWindow = window.opener;
    this.allowedOrigins = allowedOrigins;
    this.targetOrigin = "*";
    this.listen();

    const { origin } = await this.call("handshake");

    if (!this.allowedOrigins.includes(origin)) {
      this.targetOrigin = null;
      throw new Error("Origin of opener window is not allowed");
    } else {
      this.targetOrigin = origin;
    }
  }

  checkMessageAuthenticity(event) {
    const { source, origin } = event;

    return (
      source === this.remoteWindow &&
      (this.targetOrigin === "*"
        ? this.allowedOrigins.includes(origin)
        : this.targetOrigin === origin)
    );
  }

  checkPostMessageAbility(callObject) {
    return (
      this.remoteWindow != null &&
      (this.targetOrigin === "*"
        ? callObject.method === "handshake"
        : this.targetOrigin != null)
    );
  }
}
