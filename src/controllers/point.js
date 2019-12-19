import {CardComponent, CardEditComponent} from "../components";
import {
  replace,
  remove,
  RenderPosition,
  renderElement
} from "../utils/render";
import {Mode} from "../utils/constants";

const emptyPoint = {
  type: ``,
  city: ``,
  startDate: null,
  endDate: null,
  offers: [],
  photos: [],
  description: ``,
  price: 0,
  isFavorite: false,
  id: String(Date.now() + Math.random())
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

    this._cardEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceCardEditToCard();
      const data = this._cardEditComponent.getData();
      this._onDataChange(card, data, this);
    });

    this._cardEditComponent.setDeleteButtonClickHandler(() =>
      this._onDataChange(card, null, this)
    );

    this._cardEditComponent.setFavoriteButtonClickHandler(() => {
      const newCard = Object.assign({}, card, {isFavorite: !card.isFavorite});

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

    // if (oldCardComponent && oldCardEditComponent) {
    //   replace(this._cardComponent, oldCardComponent);
    //   replace(this._cardEditComponent, oldCardEditComponent);
    // } else {
    //   renderElement(
    //       this._container,
    //       this._cardComponent,
    //       RenderPosition.BEFOREEND
    //   );
    // }
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
        this._onDataChange(emptyPoint, null, this);
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
