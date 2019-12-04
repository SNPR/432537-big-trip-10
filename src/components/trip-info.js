import {createElement} from "../utils.js";

const getDuration = (startDateUTCTimestamp, endDateUTCTimestamp) => {
  const startDate = new Date(startDateUTCTimestamp);

  const monthName = startDate.toLocaleString(`en-US`, {
    month: `short`
  });
  const startDay = startDate.getDate();
  const endDay = new Date(endDateUTCTimestamp).getDate();

  return `${monthName} ${startDay}&nbsp;&mdash;&nbsp;${endDay}`;
};

const getTripInfoTemplate = (cards) => {
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
};

export default class TripInfo {
  constructor(cards) {
    this._cards = cards;
    this._element = null;
  }

  getTemplate() {
    return getTripInfoTemplate(this._cards);
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
