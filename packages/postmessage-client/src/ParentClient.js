import Client from "./Client";

export default class ParentClient extends Client {
  methods = {
    handshake: () => {
      this.fulfillHandshake();

      const { origin } = window.location;

      return { origin };
    }
  };

  open({ url, name = "PopupWindow", features = {} }) {
    if (this.remoteWindow == null || this.remoteWindow.closed) {
      const result = new Promise(resolve => {
        this.fulfillHandshake = resolve;
      });

      this.targetOrigin = new URL(url).origin;
      this.listen();

      const featureString = formatFeatures({
        ...calculatePosition(features),
        ...features
      });

      this.remoteWindow = window.open(url, name, featureString);

      return result;
    } else {
      this.remoteWindow.focus();
    }
  }

  close() {
    this.disconnect();

    if (!(this.remoteWindow == null || this.remoteWindow.closed)) {
      this.remoteWindow.close();
    }
  }

  checkMessageAuthenticity(event) {
    const { source, origin } = event;

    return source === this.remoteWindow && origin === this.targetOrigin;
  }

  checkPostMessageAbility() {
    return this.remoteWindow != null && this.targetOrigin != null;
  }
}

const calculatePosition = ({ height, width }) => {
  const top = Number.isFinite(height)
    ? (window.screen.height - height) / 2
    : undefined;

  const left = Number.isFinite(width)
    ? (window.screen.width - width) / 2
    : undefined;

  return { top, left };
};

const formatFeatures = features =>
  Object.entries(features)
    .filter(([name, value]) => Boolean(value))
    .map(e => e.join("="))
    .join(",");
