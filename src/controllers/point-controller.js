import {CardComponent, CardEditComponent} from "../components";
import {replace, RenderPosition, renderElement} from "../utils/render";

export default class PointController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;
  }

  render(card) {
    const cardComponent = new CardComponent(card);
    const cardEditComponent = new CardEditComponent(card);

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        replace(cardComponent, cardEditComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    renderElement(this._container, cardComponent, RenderPosition.BEFOREEND);

    cardComponent.setClickHandler(() => {
      replace(cardEditComponent, cardComponent);
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    cardEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      replace(cardComponent, cardEditComponent);
    });

    cardEditComponent.setFavoriteButtonClickHandler(() => {
      const newCard = Object.assign({}, card, {isFavorite: !card.isFavorite});
      this._onDataChange(card, newCard);
    });
  }
}
