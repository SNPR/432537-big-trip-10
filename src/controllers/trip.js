import {
  EventsSortingComponent,
  TripDayItemComponent,
  TripInfoComponent
} from "../components";
import {renderElement, RenderPosition} from "../utils/render";
import {SortType, Mode} from "../utils/constants";
import PointController from "./point";
import {EmptyPoint} from "../mock/cards";

const tripEvents = document.querySelector(`.trip-events`);
const tripInfo = document.querySelector(`.trip-main__trip-info`);

const renderCards = (
    cards,
    container,
    onDataChange,
    onViewChange,
    isDefaultSorting
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
        pointController.render(_card, Mode.DEFAULT);
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
    this._creatingPoint = null;
    this._isDefaultSorting = true;
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    const tripDaysElement = this._container.getElement();
    this._creatingPoint = new PointController(
        tripDaysElement,
        this._onDataChange,
        this._onViewChange
    );

    this._creatingPoint.render(EmptyPoint, Mode.ADDING);
    this._onViewChange();
  }

  _updatePoints() {
    this._removePoints();
    renderCards(
        this._pointsModel.getPoints(),
        this._container,
        this._onDataChange,
        this._onViewChange,
        this._isDefaultSorting
    );
  }

  render() {
    this._showedPointControllers = renderCards(
        this._pointsModel.getPoints(),
        this._container,
        this._onDataChange,
        this._onViewChange,
        this._isDefaultSorting
    );

    renderElement(
        tripInfo,
        new TripInfoComponent(this._pointsModel.getPoints()),
        RenderPosition.AFTERBEGIN
    );

    renderElement(
        tripEvents,
        this._eventsSortingComponent,
        RenderPosition.AFTERBEGIN
    );

    this._eventsSortingComponent.setSortTypeChangeHandler((sortType) => {
      let sortedCards = [];

      switch (sortType) {
        case SortType.DATE_DOWN:
          sortedCards = this._pointsModel
            .getPoints()
            .sort((a, b) => a.startDate - b.startDate);
          this._isDefaultSorting = true;
          break;
        case SortType.TIME_DOWN:
          sortedCards = this._pointsModel
            .getPoints()
            .slice()
            .sort(
                (a, b) => b.endDate - b.startDate - (a.endDate - a.startDate)
            );
          this._isDefaultSorting = false;
          break;
        case SortType.PRICE_DOWN:
          sortedCards = this._pointsModel
            .getPoints()
            .slice()
            .sort((a, b) => b.price - a.price);
          this._isDefaultSorting = false;
          break;
      }

      this._removePoints();
      this._showedPointControllers = renderCards(
          sortedCards,
          this._container,
          this._onDataChange,
          this._onViewChange,
          this._isDefaultSorting
      );
    });

    const getFullPrice = this._pointsModel.getPoints().reduce((acc, item) => {
      return (
        acc +
        item.price +
        item.offers.reduce((_acc, _item) => _acc + _item.price, 0)
      );
    }, 0);

    document.querySelector(`.trip-info__cost-value`).textContent = getFullPrice;
  }

  _onDataChange(oldCard, newCard, pointController) {
    if (oldCard === EmptyPoint) {
      this._creatingPoint = null;
      if (newCard === null) {
        pointController.destroy();
        this._updatePoints();
      } else {
        this._pointsModel.addPoint(newCard);

        this._showedPointControllers = [
          pointController,
          ...this._showedPointControllers
        ];

        this._removePoints();

        this._showedPointControllers = renderCards(
            this._pointsModel.getPoints(),
            this._container,
            this._onDataChange,
            this._onViewChange,
            this._isDefaultSorting
        );
      }
    } else if (newCard === null) {
      this._pointsModel.removePoint(oldCard.id);
      this._updatePoints();
    } else {
      const isSuccess = this._pointsModel.updatePoint(oldCard.id, newCard);

      if (isSuccess) {
        pointController.render(newCard, Mode.DEFAULT);
      }
    }
  }

  _onViewChange() {
    this._showedPointControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._updatePoints();
  }

  _removePoints() {
    this._container.getElement().innerHTML = ``;
    this._showedPointControllers.forEach((pointController) =>
      pointController.destroy()
    );
    this._showedPointControllers = [];
  }
}
