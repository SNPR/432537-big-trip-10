import {
  EventsSortingComponent,
  TripDayItemComponent,
  TripInfoComponent
} from "../components";
import {renderElement, RenderPosition} from "../utils/render";
import {SortType} from "../utils/constants";
import PointController from "./point-controller";

const tripEvents = document.querySelector(`.trip-events`);
const tripInfo = document.querySelector(`.trip-main__trip-info`);

const renderCards = (
    cards,
    container,
    onDataChange,
    isDefaultSorting = true
) => {
  const dates = isDefaultSorting
    ? [...new Set(cards.map((item) => new Date(item.startDate).toDateString()))]
    : [true];

  dates.forEach((date, dateIndex) => {
    const day = isDefaultSorting
      ? new TripDayItemComponent(new Date(date), dateIndex + 1)
      : new TripDayItemComponent();
    const pointController = new PointController(
        day.getElement().querySelector(`.trip-events__list`),
        onDataChange
    );

    cards
      .filter((_card) => {
        return isDefaultSorting
          ? new Date(_card.startDate).toDateString() === date
          : _card;
      })
      .forEach((_card) => {
        pointController.render(_card);
      });

    renderElement(container.getElement(), day, RenderPosition.BEFOREEND);
  });
};

export default class TripController {
  constructor(container) {
    this._container = container;
    this._eventsSortingComponent = new EventsSortingComponent();
    this._cards = [];
    this._onDataChange = this._onDataChange.bind(this);
  }

  render(cards) {
    if (this._cards.length === 0) {
      this._cards = cards;
    }
    renderCards(cards, this._container, this._onDataChange);

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
      renderCards(
          sortedCards,
          this._container,
          this._onDataChange,
          isDefaultSorting
      );
    });

    const getFullPrice = cards.reduce((acc, item) => acc + item.price, 0);

    document.querySelector(`.trip-info__cost-value`).textContent = getFullPrice;
  }

  _onDataChange(oldCard, newCard, pointController) {
    const index = this._cards.findIndex((card) => card === oldCard);

    if (index === -1) {
      return;
    }

    this._cards = [
      ...this._cards.slice(0, index),
      newCard,
      this._cards.slice(index + 1)
    ];

    pointController.render(newCard);
  }
}
