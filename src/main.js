import {
  FiltersComponent,
  MenuComponent,
  NoEventsMessageComponent
} from "./components";
import TripController from "./controllers/trip-controller";
import {renderElement, RenderPosition} from "./utils/render";
import {filters} from "./mock/filter";
import {menuItems} from "./mock/menu";
import {cards} from "./mock/cards";

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);

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

if (cards.length === 0) {
  renderElement(
      tripEvents,
      new NoEventsMessageComponent(),
      RenderPosition.BEFOREEND
  );
} else {
  const tripController = new TripController(tripEvents);
  tripController.render(cards);
}
