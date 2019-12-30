import {MenuComponent, StatisticsComponent} from "./components";
import TripController from "./controllers/trip";
import {renderElement, RenderPosition} from "./utils/render";
import {MenuItem, menuItems} from "./mock/menu";
import PointsModel from "./models/points";
import FilterController from "./controllers/filter.js";
import {AUTHORIZATION, END_POINT} from "./utils/constants";
import API from "./api.js";

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const siteMainElement = document.querySelector(`.page-body__page-main`);

const api = new API(END_POINT, AUTHORIZATION);

const menuComponent = new MenuComponent(menuItems);
const pointsModel = new PointsModel();
const tripController = new TripController(tripEvents, pointsModel);
const statisticsComponent = new StatisticsComponent(pointsModel);

api.getPoints().then((points) => {
  pointsModel.setPoints(points);
  tripController.render(points);
});

renderElement(tripControls, menuComponent, RenderPosition.BEFOREEND);

const filterController = new FilterController(tripControls, pointsModel);
filterController.render();

document
  .querySelector(`.trip-main__event-add-btn`)
  .addEventListener(`click`, () => {
    tripController.createPoint();
  });

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
