import AbstractSmartComponent from "./abstract-smart-component";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";
import nanoid from "nanoid";
import Store from "../store";
import {
  EventTypeToPlaceholderText,
  DefaultData,
  DEBOUNCE_TIMEOUT
} from "../utils/constants";
import debounce from "lodash/debounce";

export default class CardEdit extends AbstractSmartComponent {
  constructor(card) {
    super();
    this._card = card;
    this._eventType = card.type;
    this._city = card.city;
    this._offers = [...card.offers];
    this._photos = [...card.photos];
    this._price = card.price;
    this._description = card.description;
    this._externalData = DefaultData;
    this._subscribeOnEvents();
    this._flatpickrStartDate = null;
    this._flatpickrEndDate = null;
    this._submitHandler = null;
    this._favoriteButtonClickHandler = null;
    this._deleteButtonClickHandler = null;
    this._clickHandler = null;
    this._applyFlatpickr();
  }

  getTemplate() {
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
                src="img/icons/${this._eventType}.png"
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
                    ${this._eventType === `taxi` && `checked`}
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
                    ${this._eventType === `bus` && `checked`}
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
                    ${this._eventType === `train` && `checked`}
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
                    ${this._eventType === `ship` && `checked`}
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
                    ${this._eventType === `transport` && `checked`}
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
                    ${this._eventType === `drive` && `checked`}
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
                    ${this._eventType === `flight` && `checked`}
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
                    ${this._eventType === `check-in` && `checked`}
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
                    ${this._eventType === `sightseeing` && `checked`}
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
                    ${this._eventType === `restaurant` && `checked`}
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
            ${this._eventType} ${EventTypeToPlaceholderText[this._eventType]}
            </label>
            <input
              class="event__input  event__input--destination"
              id="event-destination-1"
              type="text"
              name="event-destination"
              value="${this._city}"
              list="destination-list-1"
              required
            />
            <datalist id="destination-list-1">
            ${Store.getDestinations()
              .map((destination) => {
                return `<option value="${destination.name}"></option>`;
              })
              .join(``)}

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
              value="${this._card.startDate}"
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
              value="${this._card.endDate}"
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
              value="${this._price}"
            />
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">
            ${this._externalData.saveButtonText}
          </button>
          <button class="event__reset-btn" type="reset">${
  this._card.isNew ? `Cancel` : this._externalData.deleteButtonText
}</button>
${
  !this._card.isNew
    ? `<input
            id="event-favorite-1"
            class="event__favorite-checkbox  visually-hidden"
            type="checkbox"
            name="event-favorite"
            ${this._card.isFavorite && `checked`}
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
              </button>`
    : ``
}
        </header>

        ${
  this._city || this._offers.length > 0
    ? `<section class="event__details">
        ${
  this._offers.length > 0 ||
          Store.getOffersByType(this._eventType).length > 0
    ? `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">
              Offers
            </h3>

            <div class="event__available-offers">
            ${Store.getOffersByType(this._eventType)
              .map((offer) => {
                const offerId = nanoid();
                const selectedOffer = this._offers.find(
                    (_offer) => _offer.title === offer.title
                );
                return `
                  <div class="event__offer-selector">
                    <input
                      class="event__offer-checkbox  visually-hidden"
                      id="event-offer-${offerId}-1"
                      type="checkbox"
                      name="event-offer-${offerId}"
                      ${selectedOffer && `checked`}
                    />
                    <label class="event__offer-label" for="event-offer-${offerId}-1">
                      <span class="event__offer-title">${offer.title}</span>
                      &plus; &euro;&nbsp;<span class="event__offer-price">
                      ${selectedOffer ? selectedOffer.price : offer.price}
                      </span>
                    </label>
                  </div>
                `;
              })
              .join(``)}
            </div>
          </section>`
    : ``
}

          ${
  this._city
    ? `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">
              Destination
            </h3>
            <p class="event__destination-description" name="event-description">
            ${this._description}
            </p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
              ${this._photos
                .map((photo) => {
                  return `
                    <img
                      class="event__photo"
                      src="${photo.src}"
                      alt="${photo.description}"
                    />
                  `;
                })
                .join(``)}
              </div>
            </div>
          </section>`
    : ``
}
        </section>`
    : ``
}
      </form>
    </li>
  `;
  }

  getData() {
    const form = this.getElement().querySelector(`.event--edit`);

    return new FormData(form);
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  removeElement() {
    if (this._flatpickrStartDate || this._flatpickrEndDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrEndDate.destroy();
      this._flatpickrStartDate = null;
      this._flatpickrEndDate = null;
    }

    super.removeElement();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setFavoriteButtonClickHandler(this._favoriteButtonClickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setClickHandler(this._clickHandler);
    this._subscribeOnEvents();
  }

  reset() {
    this._eventType = this._card.type;
    this._city = this._card.city;
    this._offers = this._card.offers;
    this._photos = this._card.photos;
    this._price = this._card.price;
    this._description = this._card.description;

    this.rerender();
  }

  blockForm() {
    const form = this.getElement().querySelector(`form`);

    form.querySelectorAll(`input`).forEach((input) => (input.disabled = true));
    form.querySelectorAll(`button`).forEach((button) => (button.disabled = true));
  }

  _applyFlatpickr() {
    if (this._flatpickrStartDate || this._flatpickrEndDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrEndDate.destroy();
      this._flatpickrStartDate = null;
      this._flatpickrEndDate = null;
    }

    const element = this.getElement();
    const flatpickrOptions = {
      dateFormat: `d/m/y H:i`,
      enableTime: true,
      allowInput: true,
      minDate: this._card.startDate
    };

    this._flatpickrStartDate = flatpickr(
        element.querySelector(`input[name="event-start-time"]`),
        Object.assign({}, flatpickrOptions, {defaultDate: this._card.startDate})
    );

    this._flatpickrEndDate = flatpickr(
        element.querySelector(`input[name="event-end-time"]`),
        Object.assign({}, flatpickrOptions, {defaultDate: this._card.endDate})
    );
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element
      .querySelector(`.event__type-list`)
      .addEventListener(`click`, (evt) => {
        if (evt.target.tagName === `INPUT`) {
          this._eventType = evt.target.value;
          this._offers = Store.getOffersByType(this._eventType);
          this.rerender();
          this.getElement()
            .querySelector(`form`)
            .classList.add(`trip-events__item`);
        }
      });

    element
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => {
        this._city = evt.target.value;

        const city = Store.getDestinations().find(
            (destination) => destination.name === this._city
        );
        this._description = city ? city.description : ``;
        this._photos = city ? city.pictures : [];

        this.rerender();
      });

    element
      .querySelector(`.event__input--price`)
      .addEventListener(`change`, (evt) => {
        this._price = evt.target.value;
      });
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  setFavoriteButtonClickHandler(handler) {
    if (!this._card.isNew) {
      this.getElement()
        .querySelector(`.event__favorite-checkbox`)
        .addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));

      this._favoriteButtonClickHandler = handler;
    }
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setClickHandler(handler) {
    if (!this._card.isNew) {
      this.getElement()
        .querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, handler);
      this._clickHandler = handler;
    }
  }
}
