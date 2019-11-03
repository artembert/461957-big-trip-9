import { ucFirstLetter } from "../util/uc-first";
// @ts-ignore
import { format } from "date-fns";
import { cities } from "../models/places";
import AbstractComponent from "./abstract-component";
import EventTypeList from "./event-type-list";
import OptionsComponent from "./options.component";
import { getTypeByName } from "../util/get-type-by-name";
import DestinationComponent from "./destination.component";
import { Destination } from "../types/destination";
import { AssignedOfferItem } from "../types/offer";
import { EventDate } from "../types/event-date";
import { EventType } from "../types/event-type";
import { TripEventEditConfig } from "../types/trip-event-edit-config";

export default class TripEventEdit extends AbstractComponent {
  private _type: EventType;
  private _destination: Destination;
  private readonly _price: number;
  private readonly _options: AssignedOfferItem[];
  private _date: EventDate;
  private readonly _isNew: boolean;
  private _destinationMarkup: string;
  private _eventTypeListMarkup: string;
  private _optionsMarkup: string;

  constructor({ type, destination, price, options, date, isNew }: TripEventEditConfig) {
    super();
    this._type = getTypeByName(type);
    this._destination = destination;
    this._price = price;
    this._options = options;
    this._date = date;
    this._isNew = isNew || false;

    this._destinationMarkup = this._destination.description
      ? new DestinationComponent(this._destination).getTemplate()
      : ``;
    this._eventTypeListMarkup = new EventTypeList(this._type).getTemplate();
    this._optionsMarkup =
      this._options && this._options.length ? new OptionsComponent(Array.from(this._options)).getTemplate() : ``;
  }

  public getTemplate(): string {
    return `
<li class="trip-events__item">
  <form class="trip-events__item  event  event--edit" action="#" method="post">
  
    <header class="event__header">
      <div class="event__type-wrapper">
        ${this.getSelectedTypeTemplate(this._type.icon)}
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        ${this._eventTypeListMarkup}
      </div>
      
      <div class="event__field-group  event__field-group--destination">
        ${this.getDestinationLabelTemplate(this._type.name, this._type.preposition)}
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${
          this._destination.name
        }" list="destination-list-1">
        <datalist id="destination-list-1">
          ${cities.map(item => `<option value="${item}"></option>`).join(``)}
        </datalist>
      </div>
      
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time event__input--time-start" id="event-start-time-1" type="text" name="event-start-time" value="${format(
          this._date.start,
          `dd/MM/yy HH:mm`,
        )}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time event__input--time-end" id="event-end-time-1" type="text" name="event-end-time" value="${format(
          this._date.end,
          `dd/MM/yy HH:mm`,
        )}">
      </div>
      
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${
          this._price
        }">
      </div>
      ${getActionButtons(this._isNew)}
    </header>
    ${this._getEventDetails()}
  </form>
</li>`;
  }

  public getSelectedTypeTemplate(icon): string {
    return `
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="42" height="42" src="img/icons/${icon}.png" alt="Event type icon">
    </label>`.trim();
  }

  public getDestinationLabelTemplate(typeName, preposition): string {
    return `
  <label class="event__label  event__type-output" for="event-destination-1">
    ${ucFirstLetter(typeName)} ${preposition}
  </label>`.trim();
  }

  private _getEventDetails(): string {
    if (this._options && this._options.length && this._destination.description) {
      return `
    <section class="event__details">
      ${this._optionsMarkup}
      ${this._destinationMarkup}
    </section>`;
    } else {
      return ``;
    }
  }
}

function getActionButtons(isNew: boolean): string {
  return `
    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn">${isNew ? `Cancel` : `Delete`}</button>
  `.trim();
}
