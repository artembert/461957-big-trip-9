import AbstractComponent from "./abstract-component";

export default class Filter extends AbstractComponent {
  constructor(filterList) {
    super();
    this._filterList = filterList;
  }

  getTemplate() {
    return `<form class="trip-filters" action="#" method="get">
      ${this._filterList.map((filter) => `
        <div class="trip-filters__filter">
          <input id="filter-${filter.type}"
            class="trip-filters__filter-input  visually-hidden"
            type="radio"
            name="trip-filter"
            value="${filter.type}"
            ${isFilterActive(filter)}>
          <label class="trip-filters__filter-label"
            for="filter-${filter.type}">${filter.title}</label>
        </div>`).join(``)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
  }
}

function isFilterActive(filter) {
  return filter.isActive ? `checked` : ``;
}
