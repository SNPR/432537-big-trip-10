import {
  getEventsContent,
  getEventsSorting,
  getFilters,
  getMenu,
  getTripDayItem,
  getTripDays,
  getTripInfo,
  getTripEventsItem
} from "./components";
import {renderElement} from "./utils";

const tripInfo = document.querySelector(`.trip-main__trip-info`);
renderElement(tripInfo, getTripInfo(), `afterbegin`);

const tripControls = document.querySelector(`.trip-main__trip-controls`);
renderElement(tripControls, getMenu());
renderElement(tripControls, getFilters());

const tripEvents = document.querySelector(`.trip-events`);
renderElement(tripEvents, getEventsSorting());
renderElement(tripEvents, getEventsContent());
renderElement(tripEvents, getTripDays());

const tripDays = document.querySelector(`.trip-days`);

renderElement(tripDays, getTripDayItem());
const eventsList = document.querySelector(`.trip-events__list`);

Array(3)
  .fill(``)
  .forEach((_) => renderElement(eventsList, getTripEventsItem()));
