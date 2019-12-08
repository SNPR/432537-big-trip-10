import {
  CardEditComponent,
  EventsSortingComponent,
  TripDayItemComponent,
  TripInfoComponent,
  CardComponent
} from "../components";
import {renderElement, RenderPosition, replace} from "../utils/render";
import {SortType} from "../utils/constants";
const tripEvents = document.querySelector(`.trip-events`);
const tripInfo = document.querySelector(`.trip-main__trip-info`);

export default class TripController {
  constructor(container) {
    this._container = container;
    this._eventsSortingComponent = new EventsSortingComponent();
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
        RenderPosition.AFTERBEGIN
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

      renderElement(
          this._container.getElement(),
          day,
          RenderPosition.BEFOREEND
      );
    });

    this._eventsSortingComponent.setSortTypeChangeHandler((sortType) => {
      let sortedCards = [];

      switch (sortType) {
        case SortType.DATE_DOWN:
          sortedCards = cards.slice();
          break;
        case SortType.TIME_DOWN:
          sortedCards = cards.slice().sort((a, b) => b.startDate - a.startDate);
          break;
        case SortType.PRICE_DOWN:
          sortedCards = cards.slice().sort((a, b) => a.price - b.price);
          break;
      }

      this._container.getElement().innerHTML = ``;
    });

    const getFullPrice = cards.reduce((acc, item) => acc + item.price, 0);

    document.querySelector(`.trip-info__cost-value`).textContent = getFullPrice;
  }
}
