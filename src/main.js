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
import {renderElement, RenderPosition} from "./utils";
import {filters} from "./mock/filter";
import {menuItems} from "./mock/menu";
import {cards} from "./mock/cards";

const tripInfo = document.querySelector(`.trip-main__trip-info`);
const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);

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

if (cards.length === 0) {
  renderElement(
      tripEvents,
      new NoEventsMessageComponent().getElement(),
      RenderPosition.BEFOREEND
  );
} else {
  const dates = [
    ...new Set(cards.map((item) => new Date(item.startDate).toDateString()))
  ];
  renderElement(
      tripInfo,
      new TripInfoComponent(cards).getElement(),
      RenderPosition.AFTERBEGIN
  );

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
        const cardEditComponent = new CardEditComponent(_card);

        const replaceCardToCardEdit = () => {
          eventsList.replaceChild(
              cardEditComponent.getElement(),
              cardComponent.getElement()
          );
        };

        const replaceCardEditToCard = () => {
          eventsList.replaceChild(
              cardComponent.getElement(),
              cardEditComponent.getElement()
          );
        };

        const onEscKeyDown = (evt) => {
          const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

          if (isEscKey) {
            replaceCardEditToCard();
            document.removeEventListener(`keydown`, onEscKeyDown);
          }
        };

        renderElement(
            eventsList,
            cardComponent.getElement(),
            RenderPosition.BEFOREEND
        );

        cardComponent
          .getElement()
          .querySelector(`.event__rollup-btn`)
          .addEventListener(`click`, () => {
            replaceCardToCardEdit();
            document.addEventListener(`keydown`, onEscKeyDown);
          });

        cardEditComponent.getElement().addEventListener(`submit`, (evt) => {
          evt.preventDefault();
          replaceCardEditToCard();
        });
      });

    renderElement(tripDays, day, RenderPosition.BEFOREEND);
  });

  const getFullPrice = cards.reduce((acc, item) => acc + item.price, 0);

  document.querySelector(`.trip-info__cost-value`).textContent = getFullPrice;
}
