export default class Point {
  constructor() {
    this._points = [];
  }

  getPoints() {
    return this._points;
  }

  setPoints(points) {
    this._points = Array.from(points);
  }
}
