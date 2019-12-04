import {createElement} from "../utils.js";

const getTripDaysTemplate = () => {
  return `<ul class="trip-days"></ul>`;
};

export default class TripDays {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return getTripDaysTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
