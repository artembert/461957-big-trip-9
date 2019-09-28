import AbstractComponent from "./abstract-component";

const sortToggles = [
  {
    title: `Event`,
    id: `event`,
    className: `event`,
  },
  {
    title: `Time`,
    id: `time`,
    className: `time`,
  },
  {
    title: `Price`,
    id: `price`,
    className: `price`,
  }
];

export default class Sort extends AbstractComponent {
  constructor(selectedType, isShowDay) {
    super();
    this._selectedType = selectedType;
    this._isShowDay = isShowDay;
  }

  getTemplate() {
    return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  <span class="trip-sort__item  trip-sort__item--day">
    ${this._isShowDay ? `Day` : ``}
  </span>
  
  ${getSortToggleMarkup(sortToggles, this._selectedType)}
  
  <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
</form>`;
  }
}

function getSortToggleMarkup(toggles, sortType) {
  return toggles.map(({title, id, className}) => `<div
class="trip-sort__item  trip-sort__item--${className}">
  <input
    id="sort-${id}"
    class="trip-sort__input  visually-hidden"
    type="radio"
    name="trip-sort"
    value="sort-${id}"
    data-sort="${id}"
    ${sortType === id ? `checked` : ``}>
    <label
      class="trip-sort__btn"
      for="sort-${id}">
      ${title}
    </label>
</div>`).join(``);
}
