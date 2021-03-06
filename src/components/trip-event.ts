import { ucFirstLetter } from "../util/uc-first";
// @ts-ignore
import format from "date-fns/format";
import { MS_IN_DAY, MS_IN_HOUR, MS_IN_MINUTE } from "../models/time";
import AbstractComponent from "./abstract-component";
import OptionsSelected from "./options-selected";
import { getTypeByName } from "../util/get-type-by-name";
import { EventType } from "../types/event-type";
import { EventDate } from "../types/event-date";
import { AssignedOfferItem } from "../types/offer";
import { Destination } from "../types/destination";

export default class TripEvent extends AbstractComponent {
  private _type: EventType;
  private readonly _price: number;
  private _options: AssignedOfferItem[];
  private _date: EventDate;
  private readonly _optionsSelectedMarkup: string;
  private readonly _destination: Destination;

  constructor({ type, destination, price, options, date }) {
    super();
    this._type = getTypeByName(type);
    this._destination = destination;
    this._price = price;
    this._options = options;
    this._date = date;
    this._optionsSelectedMarkup = new OptionsSelected(getSelectedOptions(this._options)).getTemplate();
  }

  public getTemplate(): string {
    return `
<li class="trip-events__item">
  <div class="event">
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type.icon}.png" alt="Event type icon">
    </div>
    
    <h3 class="event__title">
      ${ucFirstLetter(this._type.name)} ${this._type.preposition} ${this._destination.name}
    </h3>
    
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${this._date.start}">
          ${format(this._date.start, `HH:mm`)}
        </time>
        &mdash;
        <time class="event__end-time" datetime="${this._date.end}">
          ${format(this._date.end, `HH:mm`)}
        </time>
      </p>
      <p class="event__duration">${formatDuration(this._date.duration)}</p>
    </div>
    
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${this._price}</span>
    </p>
    
    <h4 class="visually-hidden">Offers:</h4>
    
    <ul class="event__selected-offers">
      ${this._optionsSelectedMarkup}
    </ul>
  
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
  }
}

function formatDuration(duration: number): string {
  const days = Math.floor(duration / MS_IN_DAY);
  const hours = Math.floor((duration - days * MS_IN_DAY) / MS_IN_HOUR);
  const minutes = Math.floor((duration - days * MS_IN_DAY - hours * MS_IN_HOUR) / MS_IN_MINUTE);
  return `${formatUnit(days, `D`)}${formatUnit(hours, `H`)}${formatUnit(minutes, `M`)}`;
}

function formatUnit(value: number, unit: string): string {
  if (!value) {
    return ``;
  }
  return value.toString().length > 1 ? `${value}${unit} ` : `0${value}${unit} `;
}

function getSelectedOptions(options: AssignedOfferItem[]): AssignedOfferItem[] {
  return Array.from(options).filter(option => option.accepted);
}
