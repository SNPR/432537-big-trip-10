import FiltersComponent from "../components/filters";
import {FilterType} from "../utils/constants";
import {renderElement, replace, RenderPosition} from "../utils/render.js";

export default class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeFilterType = FilterType.EVERYTHING;
    this._filtersComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
  }

  render() {
    const container = this._container;
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        checked: filterType === this._activeFilterType,
        disabled: this._pointsModel.getPoints(filterType).length === 0
      };
    });
    const oldComponent = this._filtersComponent;

    this._filtersComponent = new FiltersComponent(filters);
    this._filtersComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filtersComponent, oldComponent);
    } else {
      renderElement(
          container,
          this._filtersComponent,
          RenderPosition.BEFOREEND
      );
    }
  }

  _onFilterChange(filterType) {
    this._activeFilterType = filterType;
    this._pointsModel.setFilter(filterType);
  }
}
