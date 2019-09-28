import AbstractComponent from "./abstract-component";
import format from 'date-fns/format';

export default class Day extends AbstractComponent {
  constructor(date, number, isShowDate) {
    super();
    this._isShowDate = isShowDate;
    this._date = date;
    this._number = number + 1;
  }

  getTemplate() {
    return `<li class="trip-days__item  day">
  <div class="day__info">
    ${this._isShowDate
    ? `<span class="day__counter">${this._number}</span>
      <time class="day__date" datetime="${getMetadataDate(this._date)}">
        ${getDisplayDate(this._date)}
      </time>`
    : ``}
  </div>
  <ul class="trip-events__list">
  </ul>
</li>`;
  }
}

function getDisplayDate(date) {
  return format(date, `MMM d`);
}

function getMetadataDate(date) {
  return format(date, `uuuu-mm-d`);
}
