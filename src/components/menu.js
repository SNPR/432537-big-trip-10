import {createElement} from "../utils.js";

const getMenuTemplate = (menuItems) => {
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
};

export default class Menu {
  constructor(menuItems) {
    this._menuItems = menuItems;
    this._element = null;
  }

  getTemplate() {
    return getMenuTemplate(this._menuItems);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
