import nanoid from "nanoid";
import Point from "../models/point";

export default class Provider {
  constructor(api, backup) {
    this._api = api;
    this._backup = backup;
  }

  getPoints() {
    if (this._isOnLine()) {
      return this._api.getPoints();
    }

    return Promise.resolve(Point.parsePoints([]));
  }

  getDestinations() {
    if (this._isOnLine()) {
      return this._api.getDestinations();
    }

    return Promise.resolve([]);
  }

  getOffers() {
    if (this._isOnLine()) {
      return this._api.getOffers();
    }

    return Promise.resolve([]);
  }

  createPoint(point) {
    if (this._isOnLine()) {
      return this._api.createPoint(point);
    }

    const fakeNewPointId = nanoid();
    const fakeNewPoint = Point.parsePoint(
        Object.assign({}, point.toRAW(), {id: fakeNewPointId})
    );

    return Promise.resolve(fakeNewPoint);
  }

  updatePoint(id, data) {
    if (this._isOnLine()) {
      return this._api.updatePoint(id, data);
    }

    return Promise.resolve(data);
  }

  deletePoint(id) {
    if (this._isOnLine()) {
      return this._api.deletePoint(id);
    }

    return Promise.resolve();
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
