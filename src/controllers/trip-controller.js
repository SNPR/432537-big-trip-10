import {
  CardEditComponent,
  EventsSortingComponent,
  TripDayItemComponent,
  TripDaysComponent,
  TripInfoComponent,
  CardComponent
} from "../components";
import {renderElement, RenderPosition, replace} from "../utils/render";

const tripEvents = document.querySelector(`.trip-events`);
const tripInfo = document.querySelector(`.trip-main__trip-info`);

export default class TripController {
  constructor(container) {
    this._container = container;
    this._eventsSortingComponent = new EventsSortingComponent();
    this._tripDaysComponent = new TripDaysComponent();
  }

  render(cards) {
    const dates = [
      ...new Set(cards.map((item) => new Date(item.startDate).toDateString()))
    ];
    renderElement(
        tripInfo,
        new TripInfoComponent(cards),
        RenderPosition.AFTERBEGIN
    );

    renderElement(
        tripEvents,
        this._eventsSortingComponent,
        RenderPosition.BEFOREEND
    );

    renderElement(
        tripEvents,
        this._tripDaysComponent,
        RenderPosition.BEFOREEND
    );

    dates.forEach((date, dateIndex) => {
      const day = new TripDayItemComponent(new Date(date), dateIndex + 1);
      const dayElement = day.getElement();

      cards
        .filter((_card) => new Date(_card.startDate).toDateString() === date)
        .forEach((_card) => {
          const eventsList = dayElement.querySelector(`.trip-events__list`);

          const cardComponent = new CardComponent(_card);
          const cardEditComponent = new CardEditComponent(_card);

          const onEscKeyDown = (evt) => {
            const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

            if (isEscKey) {
              replace(cardComponent, cardEditComponent);
              document.removeEventListener(`keydown`, onEscKeyDown);
            }
          };

          renderElement(eventsList, cardComponent, RenderPosition.BEFOREEND);

          cardComponent.setClickHandler(() => {
            replace(cardEditComponent, cardComponent);
            document.addEventListener(`keydown`, onEscKeyDown);
          });

          cardEditComponent.setSubmitHandler((evt) => {
            evt.preventDefault();
            replace(cardComponent, cardEditComponent);
          });
        });

      renderElement(this._container, day, RenderPosition.BEFOREEND);
    });

    const getFullPrice = cards.reduce((acc, item) => acc + item.price, 0);

    document.querySelector(`.trip-info__cost-value`).textContent = getFullPrice;
  }
}
