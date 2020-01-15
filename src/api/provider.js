import nanoid from "nanoid";
import Point from "../models/point";
import Store from "../store";

const getSyncedPoints = (items) =>
  items.filter(({success}) => success).map(({payload}) => payload.point);

export default class Provider {
  constructor(api, backup) {
    this._api = api;
    this._backup = backup;
    this._isSynchronized = true;
  }

  getPoints() {
    if (this._isOnLine()) {
      return this._api.getPoints().then((points) => {
        const rawPoints = points.map((point) => point.toRAW());
        this._backup.setItem(`points`, rawPoints);

        return points;
      });
    }

    this._isSynchronized = false;

    return Promise.resolve(Point.parsePoints(this._backup.getAll().points));
  }

  getDestinations() {
    if (this._isOnLine()) {
      return this._api.getDestinations().then(() => {
        this._backup.setItem(`destinations`, Store.getDestinations());
      });
    }

    return Store.setDestinations(this._backup.getAll().destinations);
  }

  getOffers() {
    if (this._isOnLine()) {
      return this._api.getOffers().then(() => {
        this._backup.setItem(`offers`, Store.getOffers());
      });
    }

    return Store.setOffers(this._backup.getAll().offers);
  }

  getAllData() {
    return Promise.all([
      this.getDestinations(),
      this.getOffers(),
      this.getPoints()
    ]).then((values) => values[2]);
  }

  createPoint(point) {
    if (this._isOnLine()) {
      return this._api.createPoint(point).then((newPoint) => {
        this._backup.setItem(`points`, [
          ...this._backup.getAll().points,
          newPoint.toRAW()
        ]);
        return newPoint;
      });
    }

    const fakeNewPointId = nanoid();

    const fakeNewPoint = Point.parsePoint(
        Object.assign({}, point.toRAW(), {id: fakeNewPointId})
    );

    this._isSynchronized = false;

    this._backup.setItem(`points`, [
      ...this._backup.getAll().points,
      fakeNewPoint.toRAW()
    ]);

    return Promise.resolve(fakeNewPoint);
  }

  updatePoint(id, data) {
    if (this._isOnLine()) {
      return this._api.updatePoint(id, data).then((newPoint) => {
        this._backup.setItem(`points`, [
          ...this._backup.getAll().points.filter((point) => point.id !== id),
          newPoint.toRAW()
        ]);
        return newPoint;
      });
    }

    const fakeUpdatedPoint = Point.parsePoint(
        Object.assign({}, data.toRAW(), {id})
    );

    this._isSynchronized = false;

    this._backup.setItem(`points`, [
      ...this._backup.getAll().points.filter((point) => point.id !== id),
      fakeUpdatedPoint.toRAW()
    ]);

    return Promise.resolve(fakeUpdatedPoint);
  }

  deletePoint(id) {
    if (this._isOnLine()) {
      return this._api.deletePoint(id).then(() => {
        this._backup.setItem(`points`, [
          ...this._backup.getAll().points.filter((point) => point.id !== id)
        ]);
      });
    }

    this._isSynchronized = false;
    this._backup.setItem(`points`, [
      ...this._backup.getAll().points.filter((point) => point.id !== id)
    ]);

    return Promise.resolve();
  }

  _isOnLine() {
    return window.navigator.onLine;
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  sync() {
    if (this._isOnLine()) {
      const backupPoints = this._backup.getAll().points;

      return this._api.sync(backupPoints).then((response) => {
        const createdPoints = response.created;
        const updatedPoints = getSyncedPoints(response.updated);

        this._backup.setItem(`points`, [...createdPoints, ...updatedPoints]);

        this._isSynchronized = true;

        return Promise.resolve();
      });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
