export default class Backup {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getAll() {}

  dropAll() {}

  setItem(key, value) {}

  removeItem(key) {}
}
