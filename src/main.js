import {MenuComponent, StatisticsComponent} from "./components";
import TripController from "./controllers/trip";
import {renderElement, RenderPosition} from "./utils/render";
import PointsModel from "./models/points";
import FilterController from "./controllers/filter.js";
import {
  AUTHORIZATION,
  END_POINT,
  MenuItem,
  menuItems,
  BACKUP_NAME
} from "./utils/constants";
import API from "./api/index";
import Backup from "./api/backup.js";
import Provider from "./api/provider.js";

window.addEventListener(`load`, () => {
  navigator.serviceWorker
    .register(`/sw.js`)
    .then(() => {})
    .catch(() => {});
});

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const siteMainElement = document.querySelector(`.page-body__page-main`);

const api = new API(END_POINT, AUTHORIZATION);
const backup = new Backup(BACKUP_NAME, window.localStorage);
const apiWithProvider = new Provider(apiWithProvider, backup);

const menuComponent = new MenuComponent(menuItems);
const pointsModel = new PointsModel();
const tripController = new TripController(
    tripEvents,
    pointsModel,
    apiWithProvider
);
const statisticsComponent = new StatisticsComponent(pointsModel);

Promise.all([
  apiWithProvider.getDestinations(),
  apiWithProvider.getOffers(),
  apiWithProvider.getPoints()
]).then((values) => {
  pointsModel.setPoints(values[2]);
  tripController.render(values[2]);
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
