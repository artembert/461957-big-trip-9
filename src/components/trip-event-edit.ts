import { ucFirstLetter } from "../util/uc-first";
// @ts-ignore
import { format } from "date-fns";
import AbstractComponent from "./abstract-component";
import EventTypeList from "./event-type-list";
import OptionsComponent from "./options.component";
import { getTypeByName } from "../util/get-type-by-name";
import DestinationComponent from "./destination.component";
import { Destination } from "../types/destination";
import { AssignedOfferItem } from "../types/offer";
import { EventDate } from "../types/event-date";
import { EventType } from "../types/event-type";
import { Point } from "../types/point";
import { allDestinations } from "../data";

export const ButtonText = {
  NORMAL: `Save`,
  LOADING: `Loading...`,
  DELETE: `Delete`,
};

export const LOADING_CLASSNAME = `state-loading`;
export const ERROR_CLASSNAME = `state-error`;

export default class TripEventEdit extends AbstractComponent {
  private _type: EventType;
  private _destination: Destination;
  private readonly _price: number;
  private readonly _options: AssignedOfferItem[];
  private _date: EventDate;
  private readonly _isNew: boolean;
  private readonly _isFavourite: boolean;
  private _destinationMarkup: string;
  private _eventTypeListMarkup: string;
  private _optionsMarkup: string;
  private _formElement: HTMLFormElement;

  public onRequestError: VoidFunction;

  constructor({ type, destination, price, options, date, isNew, isFavourite }: Point) {
    super();
    this._type = getTypeByName(type);
    this._destination = destination;
    this._price = price;
    this._options = options;
    this._date = date;
    this._isNew = isNew || false;
    this._isFavourite = isFavourite || false;

    this._destinationMarkup =
      this._destination.description || (this._destination.pictures && this._destination.pictures.length)
        ? new DestinationComponent(this._destination).getTemplate()
        : ``;
    this._eventTypeListMarkup = new EventTypeList(this._type).getTemplate();
    this._optionsMarkup =
      this._options && this._options.length ? new OptionsComponent(this._options).getTemplate() : ``;
    this.onRequestError = this.unlockWithError.bind(this);
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
          ${allDestinations.map(item => `<option value="${item.name}"></option>`).join(``)}
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
      ${getFavouriteButton(this._isFavourite)}
      ${getCloseButton()}
    </header>
    ${this._getEventDetails()}
  </form>
</li>`;
  }

  public getSelectedTypeTemplate(icon: string): string {
    return `
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="42" height="42" src="img/icons/${icon}.png" alt="Event type icon">
    </label>`.trim();
  }

  public getDestinationLabelTemplate(typeName: string, preposition: string): string {
    return `
  <label class="event__label  event__type-output" for="event-destination-1">
    ${ucFirstLetter(typeName)} ${preposition}
  </label>`.trim();
  }

  // eslint-disable-next-line quotes
  public lockForm(actionType: "save" | "delete" = `save`): void {
    let button: HTMLButtonElement;
    if (actionType === `save`) {
      button = this._element.querySelector<HTMLButtonElement>(`.event__save-btn`);
    } else if (actionType === `delete`) {
      button = this._element.querySelector<HTMLButtonElement>(`.event__reset-btn`);
    }
    button.innerText = ButtonText.LOADING;
    button.disabled = true;
    this._form.classList.add(LOADING_CLASSNAME);
  }

  public unlockWithError(): void {
    this._shake();
    this._unlockForm();
  }

  private get _form(): HTMLFormElement {
    if (!this._formElement) {
      this._formElement = this._element.querySelector<HTMLFormElement>(`.trip-events__item`);
    }
    return this._formElement;
  }

  private _unlockForm(): void {
    const saveButton = this._element.querySelector<HTMLButtonElement>(`.event__save-btn`);
    const deleteButton = this._element.querySelector<HTMLButtonElement>(`.event__reset-btn`);
    saveButton.innerText = ButtonText.NORMAL;
    deleteButton.innerText = ButtonText.DELETE;
    saveButton.disabled = false;
    deleteButton.disabled = false;
    this._form.classList.remove(LOADING_CLASSNAME);
  }

  private _shake(): void {
    this._form.classList.add(ERROR_CLASSNAME);
  }

  private _getEventDetails(): string {
    if ((this._options && this._options.length) || this._destination.description) {
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

function getFavouriteButton(isFavourite: boolean): string {
  return `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${
    isFavourite ? `checked` : ``
  }>
  <label class="event__favorite-btn" for="event-favorite-1">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
    </svg>
  </label>
</button>`;
}

function getCloseButton(): string {
  return `
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`;
}
