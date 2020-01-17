import moment from "moment";
import {CardComponent, CardEditComponent} from "../components";
import {
  replace,
  remove,
  RenderPosition,
  renderElement
} from "../utils/render";
import {
  Mode,
  SHAKE,
  SHAKE_ANIMATION_TIMEOUT,
  Button,
  Key
} from "../utils/constants";
import PointModel from "../models/point";
import Store from "../store";
import nanoid from "nanoid";

const EmptyPoint = {
  type: `taxi`,
  city: ``,
  startDate: Date.now(),
  endDate: Date.now(),
  offers: [],
  photos: [],
  description: ``,
  price: 0,
  isFavorite: false,
  id: nanoid(),
  isNew: true
};

const parseFormData = (formData) => {
  const selectedOffers = [
    ...document.querySelectorAll(
        `.event__offer-checkbox:checked + label[for^="event-offer"]`
    )
  ];
  const destination = Store.getDestinations().find(
      (city) => city.name === formData.get(`event-destination`)
  );

  return new PointModel({
    "base_price": formData.get(`event-price`),
    "date_from": new Date(
        moment(formData.get(`event-start-time`), `DD/MM/YY HH:mm`).valueOf()
    ).toISOString(),
    "date_to": new Date(
        moment(formData.get(`event-end-time`), `DD/MM/YY HH:mm`).valueOf()
    ).toISOString(),
    "destination": {
      description: destination.description,
      name: destination.name,
      pictures: destination.pictures
    },
    "is_favorite": formData.get(`event-favorite`) === `on` ? true : false,
    "offers": selectedOffers.map((offer) => ({
      title: offer.querySelector(`.event__offer-title`).textContent,
      price: Number(offer.querySelector(`.event__offer-price`).textContent)
    })),
    "type": formData.get(`event-type`)
  });
};

class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._cardComponent = null;
    this._cardEditComponent = null;
    this._mode = Mode.DEFAULT;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceCardEditToCard();
    }
  }

  render(card, mode) {
    const oldCardComponent = this._cardComponent;
    const oldCardEditComponent = this._cardEditComponent;
    this._mode = mode;

    this._cardComponent = new CardComponent(card);
    this._cardEditComponent = new CardEditComponent(card);

    this._cardComponent.setClickHandler(() => {
      this._replaceCardToCardEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._cardEditComponent.setClickHandler(() => {
      this._replaceCardEditToCard();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._cardEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();

      const formData = this._cardEditComponent.getData();
      const data = parseFormData(formData);

      this._cardEditComponent.setData({
        saveButtonText: Button.SAVING
      });

      this._onDataChange(card, data, this);
    });

    this._cardEditComponent.setDeleteButtonClickHandler(() => {
      this._cardEditComponent.setData({
        deleteButtonText: Button.DELETING
      });
      this._onDataChange(card, null, this);
    });

    this._cardEditComponent.setFavoriteButtonClickHandler(() => {
      const newCard = PointModel.clone(card);
      newCard.isFavorite = !newCard.isFavorite;

      this._onDataChange(card, newCard, this, false);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldCardEditComponent && oldCardComponent) {
          replace(this._cardComponent, oldCardComponent);
          replace(this._cardEditComponent, oldCardEditComponent);
          this._replaceCardEditToCard();
        } else {
          renderElement(
              this._container,
              this._cardComponent,
              RenderPosition.BEFOREEND
          );
        }
        break;
      case Mode.EDIT:
        if (oldCardEditComponent) {
          replace(this._cardEditComponent, oldCardEditComponent);
        }
        break;
      case Mode.ADDING:
        if (oldCardEditComponent && oldCardComponent) {
          remove(oldCardComponent);
          remove(oldCardEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        this._cardEditComponent
          .getElement()
          .querySelector(`form`)
          .classList.add(`trip-events__item`);
        renderElement(
            this._container,
            this._cardEditComponent,
            RenderPosition.AFTERBEGIN
        );
        break;
    }
  }

  shake() {
    this._cardEditComponent.getElement().style.animation = `${SHAKE} ${SHAKE_ANIMATION_TIMEOUT /
      1000}s`;
    this._cardComponent.getElement().style.animation = `${SHAKE} ${SHAKE_ANIMATION_TIMEOUT /
      1000}s`;

    setTimeout(() => {
      this._cardEditComponent.getElement().style.animation = ``;
      this._cardComponent.getElement().style.animation = ``;

      this._cardEditComponent.setData({
        saveButtonText: Button.SAVE,
        deleteButtonText: Button.DELETE
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  destroy() {
    remove(this._cardEditComponent);
    remove(this._cardComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceCardEditToCard() {
    replace(this._cardComponent, this._cardEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _replaceCardToCardEdit() {
    this._onViewChange();
    replace(this._cardEditComponent, this._cardComponent);
    this._mode = Mode.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === Key.ESCAPE || evt.key === Key.ESC;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(EmptyPoint, null, this);
      }
      this._replaceCardEditToCard();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}

export {PointController as default, EmptyPoint};
