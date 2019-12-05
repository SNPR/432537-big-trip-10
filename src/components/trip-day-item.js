import {createElement} from "../utils.js";

export default class TripDayItem {
  constructor(date, day) {
    this._date = date;
    this._day = day;
    this._element = null;
  }

  getTemplate(date, day) {
    return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${day}</span>
        <time class="day__date" datetime="${date}">
        ${new Date(date).toLocaleString(`en-US`, {
    month: `short`
  })}
        ${new Date(date).getDate()}
        </time>
      </div>
      <ul class="trip-events__list">
      </ul>
    </li>`;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate(this._date, this._day));
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
