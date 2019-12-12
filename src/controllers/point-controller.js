import {CardComponent, CardEditComponent} from "../components";
import {replace, RenderPosition, renderElement} from "../utils/render";

export default class PointController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._cardComponent = null;
    this._cardEditComponent = null;
  }

  render(card) {
    const oldCardComponent = this._cardComponent;
    const oldCardEditComponent = this._cardEditComponent;

    this._cardComponent = new CardComponent(card);
    this._cardEditComponent = new CardEditComponent(card);

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        replace(this._cardComponent, this._cardEditComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._cardComponent.setClickHandler(() => {
      replace(this._cardEditComponent, this._cardComponent);
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    this._cardEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      replace(this._cardComponent, this._cardEditComponent);
    });

    this._cardEditComponent.setFavoriteButtonClickHandler(() => {
      const newCard = Object.assign({}, card, {isFavorite: !card.isFavorite});

      this._onDataChange(card, newCard, this);
    });

    if (oldCardComponent && oldCardEditComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._cardEditComponent, oldCardEditComponent);
    } else {
      renderElement(
          this._container,
          this._cardComponent,
          RenderPosition.BEFOREEND
      );
    }
  }
}
