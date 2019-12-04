import {
  CardEditComponent,
  EventsSortingComponent,
  FiltersComponent,
  MenuComponent,
  TripDayItemComponent,
  TripDaysComponent,
  TripInfoComponent,
  CardComponent
} from "./components";
import {renderElement, RenderPosition} from "./utils";
import {filters} from "./mock/filter";
import {menuItems} from "./mock/menu";
import {cards} from "./mock/cards";

const dates = [
  ...new Set(cards.map((item) => new Date(item.startDate).toDateString()))
];

const tripInfo = document.querySelector(`.trip-main__trip-info`);
renderElement(
    tripInfo,
    new TripInfoComponent(cards).getElement(),
    RenderPosition.AFTERBEGIN
);

const tripControls = document.querySelector(`.trip-main__trip-controls`);

renderElement(
    tripControls,
    new MenuComponent(menuItems).getElement(),
    RenderPosition.BEFOREEND
);

renderElement(
    tripControls,
    new FiltersComponent(filters).getElement(),
    RenderPosition.BEFOREEND
);

const tripEvents = document.querySelector(`.trip-events`);
renderElement(
    tripEvents,
    new EventsSortingComponent().getElement(),
    RenderPosition.BEFOREEND
);
renderElement(
    tripEvents,
    new TripDaysComponent().getElement(),
    RenderPosition.BEFOREEND
);

const tripDays = document.querySelector(`.trip-days`);

dates.forEach((date, dateIndex) => {
  const day = new TripDayItemComponent(
      new Date(date),
      dateIndex + 1
  ).getElement();

  cards
    .filter((_card) => new Date(_card.startDate).toDateString() === date)
    .forEach((_card) => {
      const eventsList = day.querySelector(`.trip-events__list`);

      const cardComponent = new CardComponent(_card);
      const cardElement = cardComponent.getElement();
      const cardEditComponent = new CardEditComponent(_card);
      const cardEditElement = cardEditComponent.getElement();

      renderElement(eventsList, cardElement, RenderPosition.BEFOREEND);

      cardElement
        .querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, () => {
          eventsList.replaceChild(cardEditElement, cardElement);
        });

      cardEditElement.addEventListener(`submit`, (evt) => {
        evt.preventDefault();
        eventsList.replaceChild(cardElement, cardEditElement);
      });
    });

  renderElement(tripDays, day, RenderPosition.BEFOREEND);
});

const getFullPrice = cards.reduce((acc, item) => acc + item.price, 0);

document.querySelector(`.trip-info__cost-value`).textContent = getFullPrice;
