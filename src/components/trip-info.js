import {createElement, getDuration} from "../utils.js";

export default class TripInfo {
  constructor(cards) {
    this._cards = cards;
    this._element = null;
  }

  getTemplate(cards) {
    return `<div class="trip-info__main">
    <h1 class="trip-info__title">${cards[0].city}
    ${cards.length > 2 ? `&mdash; ... &mdash;` : `&mdash;`}
    ${cards[cards.length - 1].city}
    </h1>
    <p class="trip-info__dates">
    ${getDuration(cards[0].startDate, cards[cards.length - 1].endDate)}
    </p>
  </div>
`;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate(this._cards));
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
