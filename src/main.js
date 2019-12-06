import {
  CardEditComponent,
  EventsSortingComponent,
  FiltersComponent,
  MenuComponent,
  TripDayItemComponent,
  TripDaysComponent,
  TripInfoComponent,
  CardComponent,
  NoEventsMessageComponent
} from "./components";
import {renderElement, RenderPosition, replace} from "./utils/render";
import {filters} from "./mock/filter";
import {menuItems} from "./mock/menu";
import {cards} from "./mock/cards";

const tripInfo = document.querySelector(`.trip-main__trip-info`);
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
  const dates = [
    ...new Set(cards.map((item) => new Date(item.startDate).toDateString()))
  ];
  renderElement(
      tripInfo,
      new TripInfoComponent(cards),
      RenderPosition.AFTERBEGIN
  );

  renderElement(
      tripEvents,
      new EventsSortingComponent(),
      RenderPosition.BEFOREEND
  );

  renderElement(tripEvents, new TripDaysComponent(), RenderPosition.BEFOREEND);

  const tripDays = document.querySelector(`.trip-days`);

  dates.forEach((date, dateIndex) => {
    const day = new TripDayItemComponent(new Date(date), dateIndex + 1);
    const dayElement = day.getElement();

    cards
      .filter((_card) => new Date(_card.startDate).toDateString() === date)
      .forEach((_card) => {
        const eventsList = dayElement.querySelector(`.trip-events__list`);

        const cardComponent = new CardComponent(_card);
        const cardEditComponent = new CardEditComponent(_card);

        const onEscKeyDown = (evt) => {
          const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

          if (isEscKey) {
            replace(cardComponent, cardEditComponent);
            document.removeEventListener(`keydown`, onEscKeyDown);
          }
        };

        renderElement(eventsList, cardComponent, RenderPosition.BEFOREEND);

        cardComponent.setClickHandler(() => {
          replace(cardEditComponent, cardComponent);
          document.addEventListener(`keydown`, onEscKeyDown);
        });

        cardEditComponent.setSubmitHandler((evt) => {
          evt.preventDefault();
          replace(cardComponent, cardEditComponent);
        });
      });

    renderElement(tripDays, day, RenderPosition.BEFOREEND);
  });

  const getFullPrice = cards.reduce((acc, item) => acc + item.price, 0);

  document.querySelector(`.trip-info__cost-value`).textContent = getFullPrice;
}
