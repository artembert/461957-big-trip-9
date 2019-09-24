import isSameMonth from 'date-fns/isSameMonth';
import format from 'date-fns/format';
import AbstractComponent from "./abstract-component";

export default class TripInfo extends AbstractComponent {
  constructor({points, dateStart, dateEnd, cost}) {
    super();
    this._points = points;
    this._dateStart = dateStart;
    this._dateEnd = dateEnd;
    this._cost = cost;
  }

  getTemplate() {
    return `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">
          ${this._points.start} &mdash; ${this._points.middle ? this._points.middle : `...`} &mdash; ${this._points.end}
        </h1>
        <p class="trip-info__dates">${formatDuration(this._dateStart, this._dateEnd)}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${this._cost}</span>
      </p>
    </section>`;
  }
}

function formatDuration(start, end) {
  if (isSameMonth(start, end)) {
    return `${format(start, `MMM dd`)} &mdash; ${format(end, `dd`)}`;
  }
  return `${format(start, `dd MMM`)} &mdash; ${format(end, `dd MMM`)}`;
}
