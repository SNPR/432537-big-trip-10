import {MenuComponent, StatisticsComponent} from "../components";
import TripController from "../controllers/trip";
import {renderElement, RenderPosition} from "../utils/render";
import PointsModel from "../models/points";
import FilterController from "../controllers/filter.js";
import {
  AUTHORIZATION,
  END_POINT,
  MenuItem,
  menuItems,
  BACKUP_NAME
} from "../utils/constants";
import API from "../api/index";
import Backup from "../api/backup.js";
import Provider from "../api/provider.js";

export default class AppController {
  constructor() {
    this._tripControls = document.querySelector(`.trip-main__trip-controls`);
    this._tripEvents = document.querySelector(`.trip-events`);
    this._siteMainElement = document.querySelector(`.page-body__page-main`);

    this._api = new API(END_POINT, AUTHORIZATION);
    this._backup = new Backup(BACKUP_NAME, window.localStorage);
    this._apiWithProvider = new Provider(this._api, this._backup);
    this._menuComponent = new MenuComponent(menuItems);
    this._pointsModel = new PointsModel();

    this._statisticsComponent = new StatisticsComponent(this._pointsModel);
    this._filterController = new FilterController(
        this._tripControls,
        this._pointsModel
    );
    this._tripController = new TripController(
        this._tripEvents,
        this._pointsModel,
        this._apiWithProvider,
        this._filterController
    );
  }

  init() {
    Promise.all([
      this._apiWithProvider.getDestinations(),
      this._apiWithProvider.getOffers(),
      this._apiWithProvider.getPoints()
    ]).then((values) => {
      this._pointsModel.setPoints(values[2]);
      this._tripController.render(values[2]);
      this._filterController.render();
    });

    renderElement(
        this._tripControls,
        this._menuComponent,
        RenderPosition.BEFOREEND
    );

    renderElement(
        this._siteMainElement,
        this._statisticsComponent,
        RenderPosition.BEFOREEND
    );
    this._statisticsComponent.hide();

    this._menuComponent.setChangeHandler((menuItem) => {
      switch (menuItem) {
        case MenuItem.TABLE:
          this._menuComponent.setActiveItem(MenuItem.TABLE);
          this._tripController.show();
          this._statisticsComponent.hide();
          break;
        case MenuItem.STATS:
          this._menuComponent.setActiveItem(MenuItem.STATS);
          this._statisticsComponent.show();
          this._tripController.hide();
          break;
      }
    });

    document
      .querySelector(`.trip-main__event-add-btn`)
      .addEventListener(`click`, () => {
        this._tripController.createPoint();
      });

    window.addEventListener(`online`, () => {
      document.title = document.title.replace(` [offline]`, ``);

      if (!this._apiWithProvider.getSynchronize()) {
        this._apiWithProvider.sync().catch((err) => {
          throw new Error(err);
        });
      }
    });

    window.addEventListener(`offline`, () => {
      document.title += ` [offline]`;
    });
  }
}
