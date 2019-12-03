import {
  getCardEdit,
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
import {card, cards} from "./mock/cards";

const uniqueDates = new Set(
    cards.map((item) => new Date(item.startDate).toDateString())
);

const tripInfo = document.querySelector(`.trip-main__trip-info`);
renderElement(tripInfo, getTripInfo(cards), `afterbegin`);

const tripControls = document.querySelector(`.trip-main__trip-controls`);
renderElement(tripControls, getMenu(menuItems));
renderElement(tripControls, getFilters(filters));

const tripEvents = document.querySelector(`.trip-events`);
renderElement(tripEvents, getEventsSorting());
renderElement(tripEvents, getTripDays());

const tripDays = document.querySelector(`.trip-days`);

renderElement(tripDays, getTripDayItem(card));
const eventsList = document.querySelector(`.trip-events__list`);
renderElement(eventsList, getCardEdit(card));
cards.forEach((cardData) => renderElement(eventsList, getCard(cardData)));

const getFullPrice = cards.reduce((acc, item) => acc + item.price, 0);

document.querySelector(`.trip-info__cost-value`).textContent = getFullPrice;
