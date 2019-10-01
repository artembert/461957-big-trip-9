import AbstractComponent from "./abstract-component";
import format from 'date-fns/format';

export default class Day extends AbstractComponent {
  constructor({date, dayIndex, isShowDate}) {
    super();
    this._date = date;
    this._number = dayIndex + 1;
    this._isShowDate = isShowDate;
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
