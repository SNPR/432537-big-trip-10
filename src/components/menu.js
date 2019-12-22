import AbstractComponent from "./abstract-component";

const ACTIVE_MENU_CLASS = `trip-tabs__btn--active`;

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
            `<a class="trip-tabs__btn ${
              item.active ? ACTIVE_MENU_CLASS : ``
            }" href="#" id="${item.name.toLowerCase()}">${item.name}</a>`
      )
      .join(``)}
    </nav>
  `;
  }

  setActiveItem(selectedItem) {
    this.getElement()
      .querySelectorAll(`.trip-tabs__btn`)
      .forEach((_item) => {
        if (_item.id === selectedItem) {
          _item.classList.add(ACTIVE_MENU_CLASS);
        } else {
          _item.classList.remove(ACTIVE_MENU_CLASS);
        }
      });
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }
      const menuItem = evt.target.id;

      handler(menuItem);
    });
  }
}
