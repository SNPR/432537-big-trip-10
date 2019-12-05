import {createElement, parseDate} from "../utils.js";

export default class CardEdit {
  constructor(card) {
    this._card = card;
    this._element = null;
  }

  getTemplate(card) {
    return `<li class="trip-events__item">
    <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img
                class="event__type-icon"
                width="17"
                height="17"
                src="img/icons/${card.type}.png"
                alt="Event type icon"
              />
            </label>
            <input
              class="event__type-toggle  visually-hidden"
              id="event-type-toggle-1"
              type="checkbox"
            />

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>

                <div class="event__type-item">
                  <input
                    id="event-type-taxi-1"
                    class="event__type-input  visually-hidden"
                    type="radio"
                    name="event-type"
                    value="taxi"
                    ${card.type === `taxi` && `checked`}
                  />
                  <label
                    class="event__type-label  event__type-label--taxi"
                    for="event-type-taxi-1"
                    >Taxi</label
                  >
                </div>

                <div class="event__type-item">
                  <input
                    id="event-type-bus-1"
                    class="event__type-input  visually-hidden"
                    type="radio"
                    name="event-type"
                    value="bus"
                    ${card.type === `bus` && `checked`}
                  />
                  <label
                    class="event__type-label  event__type-label--bus"
                    for="event-type-bus-1"
                    >Bus</label
                  >
                </div>

                <div class="event__type-item">
                  <input
                    id="event-type-train-1"
                    class="event__type-input  visually-hidden"
                    type="radio"
                    name="event-type"
                    value="train"
                    ${card.type === `train` && `checked`}
                  />
                  <label
                    class="event__type-label  event__type-label--train"
                    for="event-type-train-1"
                    >Train</label
                  >
                </div>

                <div class="event__type-item">
                  <input
                    id="event-type-ship-1"
                    class="event__type-input  visually-hidden"
                    type="radio"
                    name="event-type"
                    value="ship"
                    ${card.type === `ship` && `checked`}
                  />
                  <label
                    class="event__type-label  event__type-label--ship"
                    for="event-type-ship-1"
                    >Ship</label
                  >
                </div>

                <div class="event__type-item">
                  <input
                    id="event-type-transport-1"
                    class="event__type-input  visually-hidden"
                    type="radio"
                    name="event-type"
                    value="transport"
                    ${card.type === `transport` && `checked`}
                  />
                  <label
                    class="event__type-label  event__type-label--transport"
                    for="event-type-transport-1"
                    >Transport</label
                  >
                </div>

                <div class="event__type-item">
                  <input
                    id="event-type-drive-1"
                    class="event__type-input  visually-hidden"
                    type="radio"
                    name="event-type"
                    value="drive"
                    ${card.type === `drive` && `checked`}
                  />
                  <label
                    class="event__type-label  event__type-label--drive"
                    for="event-type-drive-1"
                    >Drive</label
                  >
                </div>

                <div class="event__type-item">
                  <input
                    id="event-type-flight-1"
                    class="event__type-input  visually-hidden"
                    type="radio"
                    name="event-type"
                    value="flight"
                    ${card.type === `flight` && `checked`}
                  />
                  <label
                    class="event__type-label  event__type-label--flight"
                    for="event-type-flight-1"
                    >Flight</label
                  >
                </div>
              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>

                <div class="event__type-item">
                  <input
                    id="event-type-check-in-1"
                    class="event__type-input  visually-hidden"
                    type="radio"
                    name="event-type"
                    value="check-in"
                    ${card.type === `check-in` && `checked`}
                  />
                  <label
                    class="event__type-label  event__type-label--check-in"
                    for="event-type-check-in-1"
                    >Check-in</label
                  >
                </div>

                <div class="event__type-item">
                  <input
                    id="event-type-sightseeing-1"
                    class="event__type-input  visually-hidden"
                    type="radio"
                    name="event-type"
                    value="sightseeing"
                    ${card.type === `sightseeing` && `checked`}
                  />
                  <label
                    class="event__type-label  event__type-label--sightseeing"
                    for="event-type-sightseeing-1"
                    >Sightseeing</label
                  >
                </div>

                <div class="event__type-item">
                  <input
                    id="event-type-restaurant-1"
                    class="event__type-input  visually-hidden"
                    type="radio"
                    name="event-type"
                    value="restaurant"
                    ${card.type === `restaurant` && `checked`}
                  />
                  <label
                    class="event__type-label  event__type-label--restaurant"
                    for="event-type-restaurant-1"
                    >Restaurant</label
                  >
                </div>
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label
              class="event__label  event__type-output"
              for="event-destination-1"
            >
            ${card.type} at
            </label>
            <input
              class="event__input  event__input--destination"
              id="event-destination-1"
              type="text"
              name="event-destination"
              value="${card.city}"
              list="destination-list-1"
            />
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input
              class="event__input  event__input--time"
              id="event-start-time-1"
              type="text"
              name="event-start-time"
              value="${parseDate(card.startDate)}"
            />
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              value="${parseDate(card.endDate)}"
            />
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input  event__input--price"
              id="event-price-1"
              type="text"
              name="event-price"
              value="${card.price}"
            />
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">
            Save
          </button>
          <button class="event__reset-btn" type="reset">Delete</button>

          <input
            id="event-favorite-1"
            class="event__favorite-checkbox  visually-hidden"
            type="checkbox"
            name="event-favorite"
            checked
          />
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg
              class="event__favorite-icon"
              width="28"
              height="28"
              viewBox="0 0 28 28"
            >
              <path
                d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"
              />
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">
              Offers
            </h3>

            <div class="event__available-offers">
            ${card.offers
              .map((offer) => {
                return `
                  <div class="event__offer-selector">
                    <input
                      class="event__offer-checkbox  visually-hidden"
                      id="event-offer-${offer.type}-1"
                      type="checkbox"
                      name="event-offer-${offer.type}"
                      ${offer.checked && `checked`}
                    />
                    <label class="event__offer-label" for="event-offer-
                    ${offer.type}-1">
                      <span class="event__offer-title">${offer.name}</span>
                      &plus; &euro;&nbsp;<span class="event__offer-price">
                      ${offer.price}
                      </span>
                    </label>
                  </div>
                `;
              })
              .join(``)}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">
              Destination
            </h3>
            <p class="event__destination-description">
            ${card.description}
            </p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
              ${card.photos
                .map((photo) => {
                  return `
                    <img
                      class="event__photo"
                      src="${photo}"
                      alt="Event photo"
                    />
                  `;
                })
                .join(``)}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>
  `;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate(this._card));
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
