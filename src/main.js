import {
  MenuComponent,
  NoEventsMessageComponent,
  TripDaysComponent,
  StatisticsComponent
} from "./components";
import TripController from "./controllers/trip";
import {renderElement, RenderPosition} from "./utils/render";
import {MenuItem, menuItems} from "./mock/menu";
import {cards} from "./mock/cards";
import PointsModel from "./models/point";
import FilterController from "./controllers/filter.js";

const pointsModel = new PointsModel();
pointsModel.setPoints(cards);

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const siteMainElement = document.querySelector(`.page-body__page-main`);
const tripDaysComponent = new TripDaysComponent();
const menuComponent = new MenuComponent(menuItems);
const statisticsComponent = new StatisticsComponent();
const tripController = new TripController(tripDaysComponent, pointsModel);

renderElement(tripControls, menuComponent, RenderPosition.BEFOREEND);

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
  tripController.render(cards);
  document
    .querySelector(`.trip-main__event-add-btn`)
    .addEventListener(`click`, () => {
      tripController.createPoint();
    });
}

renderElement(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

menuComponent.setChangeHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      menuComponent.setActiveItem(MenuItem.TABLE);
      tripController.show();
      statisticsComponent.hide();
      break;
    case MenuItem.STATS:
      menuComponent.setActiveItem(MenuItem.STATS);
      statisticsComponent.show();
      tripController.hide();
      break;
  }
});
