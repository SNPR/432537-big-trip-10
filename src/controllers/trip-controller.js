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

const renderCards = (cards, container, isDefaultSorting = true) => {
  const dates = isDefaultSorting
    ? [...new Set(cards.map((item) => new Date(item.startDate).toDateString()))]
    : [true];

  dates.forEach((date, dateIndex) => {
    const day = isDefaultSorting
      ? new TripDayItemComponent(new Date(date), dateIndex + 1)
      : new TripDayItemComponent();
    const dayElement = day.getElement();

    cards
      .filter((_card) => {
        return isDefaultSorting
          ? new Date(_card.startDate).toDateString() === date
          : _card;
      })
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

    renderElement(container.getElement(), day, RenderPosition.BEFOREEND);
  });
};

export default class TripController {
  constructor(container) {
    this._container = container;
    this._eventsSortingComponent = new EventsSortingComponent();
  }

  render(cards) {
    renderCards(cards, this._container);

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

    this._eventsSortingComponent.setSortTypeChangeHandler((sortType) => {
      let sortedCards = [];
      let isDefaultSorting = false;

      switch (sortType) {
        case SortType.DATE_DOWN:
          sortedCards = cards.slice();
          isDefaultSorting = true;
          break;
        case SortType.TIME_DOWN:
          sortedCards = cards.slice().sort((a, b) => b.startDate - a.startDate);
          break;
        case SortType.PRICE_DOWN:
          sortedCards = cards.slice().sort((a, b) => b.price - a.price);
          break;
      }

      this._container.getElement().innerHTML = ``;
      renderCards(sortedCards, this._container, isDefaultSorting);
    });

    const getFullPrice = cards.reduce((acc, item) => acc + item.price, 0);

    document.querySelector(`.trip-info__cost-value`).textContent = getFullPrice;
  }
}
