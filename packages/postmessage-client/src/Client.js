import DeferredRegistry from "./DeferredRegistry";

export default class Client {
  remoteWindow = null;
  targetOrigin = null;
  methods = {};
  deferred = new DeferredRegistry();

  constructor(methods = {}) {
    Object.assign(this.methods, methods);
  }

  listen() {
    window.addEventListener("message", this.handleMessage);
  }

  disconnect() {
    window.removeEventListener("message", this.handleMessage);
  }

  handleMessage = event => {
    const { data } = event;

    if (!this.checkMessageAuthenticity(event)) return;

    if (data.method) {
      this.exec(data);
    } else {
      this.deferred.complete(data);
    }
  };

  checkMessageAuthenticity() {
    throw new Error("Unimplemented method checkMessageAuthenticity was called");
  }

  call(method, params = []) {
    const id = getRandomId();

    const result = new Promise((resolve, reject) => {
      this.deferred.register(id, resolve, reject);
    });

    this.postMessage({ id, method, params });

    return result;
  }

  async exec({ id, method, params }) {
    const callee = this.methods[method];

    if (!callee) return;

    try {
      const result = await callee(...params);
      this.postMessage({ id, result });
    } catch (error) {
      this.postMessage({ id, error });
    }
  }

  postMessage(callObject) {
    if (!this.checkPostMessageAbility(callObject)) return;

    this.remoteWindow.postMessage(
      { jsonrpc: "2.0", ...callObject },
      this.targetOrigin
    );
  }

  checkPostMessageAbility() {
    throw new Error("Unimplemented method checkPostMessageAbility was called");
  }
}

const getRandomId = () => Math.floor(Math.random() * 1e10);
