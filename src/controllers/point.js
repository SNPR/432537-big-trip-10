import moment from "moment";
import {CardComponent, CardEditComponent} from "../components";
import {
  replace,
  remove,
  RenderPosition,
  renderElement
} from "../utils/render";
import {Mode} from "../utils/constants";
import PointModel from "../models/point";
import Store from "../store";

export const EmptyPoint = {
  type: `taxi`,
  city: ``,
  startDate: Date.now(),
  endDate: Date.now(),
  offers: [],
  photos: [],
  description: ``,
  price: 0,
  isFavorite: false,
  id: String(Date.now() + Math.random()),
  isNew: true
};

const parseFormData = (formData) => {
  const offerLabels = [
    ...document.querySelectorAll(`label[for^="event-offer"]`)
  ];
  const destination = Store.getDestinations().find(
      (city) => city.name === formData.get(`event-destination`)
  );

  return new PointModel({
    base_price: formData.get(`event-price`),
    date_from: new Date(
        moment(formData.get(`event-start-time`), `DD/MM/YY HH:mm`).valueOf()
    ).toISOString(),
    date_to: new Date(
        moment(formData.get(`event-end-time`), `DD/MM/YY HH:mm`).valueOf()
    ).toISOString(),
    destination: {
      description: destination.description,
      name: destination.name,
      pictures: destination.pictures
    },
    is_favorite: formData.get(`event-favorite`) === `on` ? true : false,
    offers: offerLabels.map((offer) => ({
      title: offer.querySelector(`.event__offer-title`).textContent,
      price: Number(offer.querySelector(`.event__offer-price`).textContent)
    })),
    type: formData.get(`event-type`)
  });
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._cardComponent = null;
    this._cardEditComponent = null;
    this._mode = Mode.DEFAULT;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
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
      this._cardEditComponent.setData({
        saveButtonText: `Saving...`
      });

      const formData = this._cardEditComponent.getData();
      const data = parseFormData(formData);

      this._onDataChange(card, data, this);
    });

    this._cardEditComponent.setDeleteButtonClickHandler(() => {
      this._cardEditComponent.setData({
        deleteButtonText: `Deleting...`
      });
      this._onDataChange(card, null, this);
    });

    this._cardEditComponent.setFavoriteButtonClickHandler(() => {
      const newCard = PointModel.clone(card);
      newCard.isFavorite = !newCard.isFavorite;

      this._onDataChange(card, newCard, this);
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
      case Mode.ADDING:
        if (oldCardEditComponent && oldCardComponent) {
          remove(oldCardComponent);
          remove(oldCardEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        renderElement(
            this._container,
            this._cardEditComponent,
            RenderPosition.AFTERBEGIN
        );
        break;
    }
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
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(EmptyPoint, null, this);
      }
      this._replaceCardEditToCard();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceCardEditToCard();
    }
  }

  destroy() {
    remove(this._cardEditComponent);
    remove(this._cardComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
}
