declare class Object {
  static entries<T>(object: { [string]: T }): Array<[string, T]>;
  static values<T>(object: { [string]: T }): Array<T>;
}
