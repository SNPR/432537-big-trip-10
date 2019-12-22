import {
  MenuComponent,
  NoEventsMessageComponent,
  TripDaysComponent,
  StatisticsComponent
} from "./components";
import TripController from "./controllers/trip";
import {renderElement, RenderPosition} from "./utils/render";
import {menuItems} from "./mock/menu";
import {cards} from "./mock/cards";
import PointsModel from "./models/point";
import FilterController from "./controllers/filter.js";

const pointsModel = new PointsModel();
pointsModel.setPoints(cards);

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const siteMainElement = document.querySelector(`.page-body__page-main`);
const tripDaysComponent = new TripDaysComponent();

renderElement(
    tripControls,
    new MenuComponent(menuItems),
    RenderPosition.BEFOREEND
);

const filterController = new FilterController(tripControls, pointsModel);
filterController.render();

renderElement(tripEvents, tripDaysComponent, RenderPosition.BEFOREEND);

if (cards.length === 0) {
  renderElement(
      tripEvents,
      new NoEventsMessageComponent(),
      RenderPosition.BEFOREEND
  );
} else {
  const tripController = new TripController(tripDaysComponent, pointsModel);
  tripController.render(cards);
  document
    .querySelector(`.trip-main__event-add-btn`)
    .addEventListener(`click`, () => {
      tripController.createPoint();
    });
}

renderElement(
    siteMainElement,
    new StatisticsComponent(),
    RenderPosition.BEFOREEND
);
