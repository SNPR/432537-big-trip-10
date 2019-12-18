import {
  EventsSortingComponent,
  TripDayItemComponent,
  TripInfoComponent
} from "../components";
import {renderElement, RenderPosition} from "../utils/render";
import {SortType} from "../utils/constants";
import PointController from "./point";

const tripEvents = document.querySelector(`.trip-events`);
const tripInfo = document.querySelector(`.trip-main__trip-info`);

const renderCards = (
    cards,
    container,
    onDataChange,
    onViewChange,
    isDefaultSorting = true
) => {
  const pointControllers = [];
  const dates = isDefaultSorting
    ? [...new Set(cards.map((item) => new Date(item.startDate).toDateString()))]
    : [true];

  dates.forEach((date, dateIndex) => {
    const day = isDefaultSorting
      ? new TripDayItemComponent(new Date(date), dateIndex + 1)
      : new TripDayItemComponent();

    cards
      .filter((_card) => {
        return isDefaultSorting
          ? new Date(_card.startDate).toDateString() === date
          : _card;
      })
      .forEach((_card) => {
        const pointController = new PointController(
            day.getElement().querySelector(`.trip-events__list`),
            onDataChange,
            onViewChange
        );
        pointController.render(_card);
        pointControllers.push(pointController);
      });

    renderElement(container.getElement(), day, RenderPosition.BEFOREEND);
  });

  return pointControllers;
};

export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._eventsSortingComponent = new EventsSortingComponent();
    this._showedPointControllers = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const cards = this._pointsModel.getPoints();

    this._showedPointControllers = renderCards(
        cards,
        this._container,
        this._onDataChange,
        this._onViewChange
    );

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
          sortedCards = cards
            .slice()
            .sort(
                (a, b) => b.endDate - b.startDate - (a.endDate - a.startDate)
            );
          break;
        case SortType.PRICE_DOWN:
          sortedCards = cards.slice().sort((a, b) => b.price - a.price);
          break;
      }

      this._container.getElement().innerHTML = ``;
      this._showedPointControllers = renderCards(
          sortedCards,
          this._container,
          this._onDataChange,
          this._onViewChange,
          isDefaultSorting
      );
    });

    const getFullPrice = cards.reduce((acc, item) => {
      return (
        acc +
        item.price +
        item.offers.reduce((_acc, _item) => _acc + _item.price, 0)
      );
    }, 0);

    document.querySelector(`.trip-info__cost-value`).textContent = getFullPrice;
  }

  _onDataChange(oldCard, newCard, pointController) {
    const isSuccess = this._pointsModel.updatePoint(oldCard.id, newCard);

    if (isSuccess) {
      pointController.render(newCard);
    }
  }

  _onViewChange() {
    this._showedPointControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._removePoints();
    renderCards(
        this._pointsModel.getPoints(),
        this._container,
        this._onDataChange,
        this._onViewChange
    );
  }
}
