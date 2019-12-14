import AbstractComponent from "./abstract-component";
import {getTripDuration} from "../utils/common.js";

export default class TripInfo extends AbstractComponent {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    return `<div class="trip-info__main">
    <h1 class="trip-info__title">${this._cards[0].city}
    ${this._cards.length > 2 ? `&mdash; ... &mdash;` : `&mdash;`}
    ${this._cards[this._cards.length - 1].city}
    </h1>
    <p class="trip-info__dates">
    ${getTripDuration(
      this._cards[0].startDate,
      this._cards[this._cards.length - 1].endDate
  )}
    </p>
  </div>
`;
  }
}
