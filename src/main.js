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
  const currentDateCard = cards.find(
      (_card) => new Date(date).getDate() === new Date(_card.startDate).getDate()
  );
  const currentDayEvents = cards.filter(
      (_card) =>
        new Date(_card.startDate).getDate() ===
      new Date(currentDateCard.startDate).getDate()
  );
  renderElement(
      tripDays,
      getTripDayItem(currentDateCard.startDate, dateIndex + 1)
  );
  const tripDayItem = document.querySelectorAll(`.trip-events__list`)[
    dateIndex
  ];
  currentDayEvents.forEach((cardData, eventsIndex) => {
    if (dateIndex === 0 && eventsIndex === 0) {
      renderElement(tripDayItem, getCardEdit(cardData));
    } else {
      renderElement(tripDayItem, getCard(cardData));
    }
  });
});

const getFullPrice = cards.reduce((acc, item) => acc + item.price, 0);

document.querySelector(`.trip-info__cost-value`).textContent = getFullPrice;
