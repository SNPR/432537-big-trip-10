import {
  FiltersComponent,
  MenuComponent,
  NoEventsMessageComponent,
  TripDaysComponent
} from "./components";
import TripController from "./controllers/trip";
import {renderElement, RenderPosition} from "./utils/render";
import {filters} from "./mock/filter";
import {menuItems} from "./mock/menu";
import {cards} from "./mock/cards";
import PointsModel from './models/point';

const pointsModel = new PointsModel();
pointsModel.setPoints(cards);

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const tripDaysComponent = new TripDaysComponent();

renderElement(
    tripControls,
    new MenuComponent(menuItems),
    RenderPosition.BEFOREEND
);

renderElement(
    tripControls,
    new FiltersComponent(filters),
    RenderPosition.BEFOREEND
);

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
}
