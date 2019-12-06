import AbstractComponent from "./abstract-component";

export default class TripDayItem extends AbstractComponent {
  constructor(date, day) {
    super();
    this._date = date;
    this._day = day;
  }

  getTemplate() {
    return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${this._day}</span>
        <time class="day__date" datetime="${this._date}">
        ${new Date(this._date).toLocaleString(`en-US`, {month: `short`})}
        ${new Date(this._date).getDate()}
        </time>
      </div>
      <ul class="trip-events__list">
      </ul>
    </li>`;
  }
}
