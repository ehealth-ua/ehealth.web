export default class DeferredRegistry {
  registry = new Map();

  register(id, resolve, reject) {
    this.registry.set(id, { resolve, reject });
  }

  complete({ id, error, result }) {
    if (!this.registry.has(id)) return;

    const { resolve, reject } = this.registry.get(id);

    if (error) {
      reject(error);
    } else {
      resolve(result);
    }
  }
}
