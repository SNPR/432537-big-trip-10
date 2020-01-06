export default class Provider {
  constructor(api, backup) {
    this._api = api;
    this._backup = backup;
  }

  getPoints() {
    return this._api.getPoints();
  }

  createPoint(point) {
    return this._api.createPoint(point);
  }

  updatePoint(id, data) {
    return this._api.updatePoint(id, data);
  }

  deletePoint(id) {
    return this._api.deletePoint(id);
  }
}
