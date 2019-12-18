import {getPointsByFilter} from "../utils/filter.js";
import {FilterType} from "../utils/constants";

export default class Point {
  constructor() {
    this._points = [];
    this._activeFilterType = FilterType.EVERYTHING;
    this._filterChangeHandlers = [];
  }

  getPoints() {
    return getPointsByFilter(this._points, this._activeFilterType);
  }

  getPointsAll() {
    return this._points;
  }

  setPoints(points) {
    this._points = Array.from(points);
  }

  updatePoint(id, point) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [
      ...this._points.slice(0, index),
      point,
      ...this._points.slice(index + 1)
    ];

    return true;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }
}
