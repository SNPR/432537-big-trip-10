import AbstractComponent from "./abstract-component";

export default class Menu extends AbstractComponent {
  constructor(menuItems) {
    super();
    this._menuItems = menuItems;
  }

  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${this._menuItems
      .map(
          (item) =>
            `<a class="trip-tabs__btn ${item.active &&
            `trip-tabs__btn--active`}" href="#">${item.name}</a>`
      )
      .join(``)}
    </nav>
  `;
  }
}
