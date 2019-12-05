import {createElement} from "../utils.js";

export default class Filters {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate(filters) {
    return `<form class="trip-filters" action="#" method="get">
    ${filters
      .map((filter) => {
        return `
          <div class="trip-filters__filter">
            <input
              id="filter-${filter.name}"
              class="trip-filters__filter-input  visually-hidden"
              type="radio"
              name="trip-filter"
              value="${filter.name}"
              ${filter.checked && `checked`}
            />
            <label class="trip-filters__filter-label" for="filter-
            ${filter.name}">
            ${filter.name}
            </label>
          </div>
      `;
      })
      .join(``)}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate(this._filters));
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
