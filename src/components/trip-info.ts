// @ts-ignore
import isSameMonth from "date-fns/isSameMonth";
// @ts-ignore
import format from "date-fns/format";
import AbstractComponent from "./abstract-component";
import { Info } from "../types/info";
import { InfoPoints } from "../types/info-points";

export default class TripInfo extends AbstractComponent {
  private readonly _points: InfoPoints;
  private readonly _dateStart: number;
  private readonly _dateEnd: number;
  private readonly _cost: number;

  constructor({ points, dateStart, dateEnd, cost }: Info) {
    super();
    this._points = points;
    this._dateStart = dateStart;
    this._dateEnd = dateEnd;
    this._cost = cost;
  }

  private get _paramsExist(): boolean {
    return !!this._dateStart && !!this._dateEnd && !!this._cost && !!this._points.start;
  }

  public getTemplate(): string {
    if (this._paramsExist) {
      return `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">
          ${getDestinationMarkup(this._points)}
        </h1>
        <p class="trip-info__dates">${formatDuration(this._dateStart, this._dateEnd)}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${this._cost}</span>
      </p>
    </section>`;
    } else {
      return `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">Loading…</h1>
        <p class="trip-info__dates">&nbsp;</p>
      </div>
      <p class="trip-info__cost">
        <span class="trip-info__cost-value">&nbsp;</span>
      </p>
    </section>`;
    }
  }
}

function formatDuration(start: number, end: number): string {
  if (isSameMonth(start, end)) {
    return `${format(start, `MMM dd`)} &mdash; ${format(end, `dd`)}`;
  }
  return `${format(start, `dd MMM`)} &mdash; ${format(end, `dd MMM`)}`;
}

function getDestinationMarkup({ start, middle, end }: InfoPoints): string {
  return `${start} ${middle ? ` &mdash; ${middle}` : ``}${end ? ` &mdash; ${end}` : ``}`;
}
