import {
  getEventsContent,
  getEventsSorting,
  getFilters,
  getMenu,
  getTripDayItem,
  getTripDays,
  getTripInfo,
  getCard
} from "./components";
import {renderElement} from "./utils";
import {filters} from "./mock/filter";
import {menuItems} from "./mock/menu";
import {card} from "./mock/card";

const tripInfo = document.querySelector(`.trip-main__trip-info`);
renderElement(tripInfo, getTripInfo(), `afterbegin`);

const tripControls = document.querySelector(`.trip-main__trip-controls`);
renderElement(tripControls, getMenu(menuItems));
renderElement(tripControls, getFilters(filters));

const tripEvents = document.querySelector(`.trip-events`);
renderElement(tripEvents, getEventsSorting());
renderElement(tripEvents, getEventsContent(card));
renderElement(tripEvents, getTripDays());

const tripDays = document.querySelector(`.trip-days`);

renderElement(tripDays, getTripDayItem());
const eventsList = document.querySelector(`.trip-events__list`);

Array(3)
  .fill(``)
  .forEach((_) => renderElement(eventsList, getCard()));
