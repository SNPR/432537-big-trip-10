import {
  EventsSortingComponent,
  TripDaysComponent,
  TripDayItemComponent,
  TripInfoComponent,
  NoEventsMessageComponent
} from "../components";
import {renderElement, RenderPosition, remove} from "../utils/render";
import {SortType, Mode} from "../utils/constants";
import PointController, {EmptyPoint} from "./point";

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
  constructor(container, pointsModel, api, filterController) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._eventsSortingComponent = null;
    this._tripInfoComponent = null;
    this._showedPointControllers = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
    this._creatingPoint = null;
    this._noEventsMessageComponent = null;
    this._isDefaultSorting = true;
    this._currentSortType = SortType.DATE_DOWN;
    this._tripDaysComponent = new TripDaysComponent();
    this._api = api;
    this._filterController = filterController;
    renderElement(
        this._container,
        this._tripDaysComponent,
        RenderPosition.BEFOREEND
    );
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    this._creatingPoint = new PointController(
        this._tripDaysComponent.getElement(),
        this._onDataChange,
        this._onViewChange
    );

    this._creatingPoint.render(EmptyPoint, Mode.ADDING);
    this._onViewChange();
  }

  render() {
    if (this._pointsModel.getPoints().length === 0) {
      this._toggleNoEventsMessageComponent();
      return;
    }

    this._showedPointControllers = renderCards(
        this._pointsModel.getPoints(),
        this._tripDaysComponent,
        this._onDataChange,
        this._onViewChange,
        this._isDefaultSorting
    );

    this._eventsSortingComponent = new EventsSortingComponent();
    this._tripInfoComponent = new TripInfoComponent(
        this._pointsModel.getPoints()
    );

    renderElement(tripInfo, this._tripInfoComponent, RenderPosition.AFTERBEGIN);

    renderElement(
        tripEvents,
        this._eventsSortingComponent,
        RenderPosition.AFTERBEGIN
    );

    this._eventsSortingComponent.setSortTypeChangeHandler((sortType) =>
      this._sortPoints(sortType)
    );

    this._sortPoints(this._currentSortType);
    this._checkSortType(this._currentSortType);
    this._getFullPrice();
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  show() {
    this._container.classList.remove(`visually-hidden`);
  }

  _removePoints() {
    this._tripDaysComponent.getElement().innerHTML = ``;
    this._showedPointControllers.forEach((pointController) =>
      pointController.destroy()
    );
    this._showedPointControllers = [];
  }

  _updatePoints() {
    this._removePoints();
    this._showedPointControllers = renderCards(
        this._pointsModel.getPoints(),
        this._tripDaysComponent,
        this._onDataChange,
        this._onViewChange,
        this._isDefaultSorting
    );
  }

  _toggleNoEventsMessageComponent() {
    if (this._pointsModel.getPoints().length === 0) {
      if (!this._noEventsMessageComponent) {
        this._noEventsMessageComponent = new NoEventsMessageComponent();
        renderElement(
            tripEvents,
            this._noEventsMessageComponent,
            RenderPosition.BEFOREEND
        );
      }
    } else {
      if (this._noEventsMessageComponent) {
        remove(this._noEventsMessageComponent);
        this._noEventsMessageComponent = null;
        this.render();
      }
    }
    this._reset();
  }

  _reset() {
    this._tripDaysComponent.getElement().innerHTML = ``;

    if (this._tripInfoComponent) {
      remove(this._tripInfoComponent);
    }
    if (this._eventsSortingComponent) {
      remove(this._eventsSortingComponent);
    }

    if (this._pointsModel.getPoints().length) {
      this._eventsSortingComponent = new EventsSortingComponent();
      this._tripInfoComponent = new TripInfoComponent(
          this._pointsModel.getPoints()
      );

      this.render();
    }
    this._getFullPrice();
  }

  _getFullPrice() {
    const fullPrice = this._pointsModel.getPoints().reduce((acc, item) => {
      return (
        acc +
        Number(item.price) +
        item.offers.reduce((_acc, _item) => _acc + Number(_item.price), 0)
      );
    }, 0);

    document.querySelector(`.trip-info__cost-value`).textContent = fullPrice;
  }

  _onDataChange(oldCard, newCard, pointController, shouldRerender = true) {
    if (oldCard === EmptyPoint) {
      this._creatingPoint = null;
      if (newCard === null) {
        pointController.destroy();
        this._updatePoints();
      } else {
        this._api
          .createPoint(newCard)
          .then((pointModel) => {
            this._pointsModel.addPoint(pointModel);

            this._showedPointControllers = [
              pointController,
              ...this._showedPointControllers
            ];

            this._removePoints();

            this._showedPointControllers = renderCards(
                this._pointsModel.getPoints(),
                this._tripDaysComponent,
                this._onDataChange,
                this._onViewChange,
                this._isDefaultSorting
            );
            this._toggleNoEventsMessageComponent();
            this._filterController.render();
          })
          .catch(() => {
            pointController.shake();
          });
      }
    } else if (newCard === null) {
      this._api
        .deletePoint(oldCard.id)
        .then(() => {
          this._pointsModel.removePoint(oldCard.id);
          this._updatePoints();
          this._toggleNoEventsMessageComponent();
          this._filterController.render();
        })
        .catch(() => {
          pointController.shake();
        });
    } else {
      this._api
        .updatePoint(oldCard.id, newCard)
        .then((pointModel) => {
          const isSuccess = this._pointsModel.updatePoint(
              oldCard.id,
              pointModel
          );
          if (isSuccess) {
            if (shouldRerender) {
              pointController.render(pointModel, Mode.DEFAULT);
              this._updatePoints();
              this._reset();
              this._filterController.render();
            } else {
              pointController.render(pointModel, Mode.EDIT);
            }
          }
        })
        .catch(() => {
          pointController.shake();
        });
    }
  }

  _sortPoints(sortType) {
    let sortedCards = [];

    switch (sortType) {
      case SortType.DATE_DOWN:
        sortedCards = this._pointsModel
          .getPoints()
          .slice()
          .sort((a, b) => a.startDate - b.startDate);
        this._isDefaultSorting = true;
        this._currentSortType = sortType;
        break;
      case SortType.TIME_DOWN:
        sortedCards = this._pointsModel
          .getPoints()
          .slice()
          .sort((a, b) => b.endDate - b.startDate - (a.endDate - a.startDate));
        this._isDefaultSorting = false;
        this._currentSortType = sortType;
        break;
      case SortType.PRICE_DOWN:
        sortedCards = this._pointsModel
          .getPoints()
          .slice()
          .sort((a, b) => b.price - a.price);
        this._isDefaultSorting = false;
        this._currentSortType = sortType;
        break;
    }

    this._removePoints();
    this._showedPointControllers = renderCards(
        sortedCards,
        this._tripDaysComponent,
        this._onDataChange,
        this._onViewChange,
        this._isDefaultSorting
    );
  }

  _checkSortType(sortType) {
    document.querySelector(`input[data-sort-type=${sortType}]`).checked = true;
  }

  _onViewChange() {
    this._showedPointControllers.forEach((it) => it.setDefaultView());
    this._creatingPoint = null;
  }

  _onFilterChange() {
    this._isDefaultSorting = true;
    this._checkSortType(SortType.DATE_DOWN);
    this._updatePoints();
  }
}
