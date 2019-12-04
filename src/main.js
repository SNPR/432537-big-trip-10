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
import {renderElement, createElement} from "./utils";
import {filters} from "./mock/filter";
import {menuItems} from "./mock/menu";
import {cards} from "./mock/cards";

const dates = [
  ...new Set(cards.map((item) => new Date(item.startDate).toDateString()))
];

const tripInfo = document.querySelector(`.trip-main__trip-info`);
renderElement(tripInfo, getTripInfo(cards), `afterbegin`);

const tripControls = document.querySelector(`.trip-main__trip-controls`);
renderElement(tripControls, getMenu(menuItems));
renderElement(tripControls, getFilters(filters));

const tripEvents = document.querySelector(`.trip-events`);
renderElement(tripEvents, getEventsSorting());
renderElement(tripEvents, getTripDays());

const tripDays = document.querySelector(`.trip-days`);

dates.forEach((date, dateIndex) => {
  const day = createElement(getTripDayItem(new Date(date), dateIndex + 1));

  cards
    .filter((_card) => new Date(_card.startDate).toDateString() === date)
    .forEach((_card, cardIndex) => {
      if (cardIndex === 0 && dateIndex === 0) {
        renderElement(
            document.querySelector(`.trip-events__trip-sort`),
            getCardEdit(_card),
            `afterend`
        );
      }
      renderElement(day.querySelector(`.trip-events__list`), getCard(_card));
    });

  renderElement(tripDays, day.innerHTML);
});

const getFullPrice = cards.reduce((acc, item) => acc + item.price, 0);

document.querySelector(`.trip-info__cost-value`).textContent = getFullPrice;
