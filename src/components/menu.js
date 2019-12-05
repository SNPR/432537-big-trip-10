import {createElement} from "../utils.js";

export default class Menu {
  constructor(menuItems) {
    this._menuItems = menuItems;
    this._element = null;
  }

  getTemplate(menuItems) {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${menuItems
      .map(
          (item) =>
            `<a class="trip-tabs__btn ${item.active &&
            `trip-tabs__btn--active`}" href="#">${item.name}</a>`
      )
      .join(``)}
    </nav>
  `;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate(this._menuItems));
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
