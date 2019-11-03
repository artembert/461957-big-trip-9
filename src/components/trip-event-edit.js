import {ucFirstLetter} from "../util/uc-first";
import {format} from "date-fns";
import {cities} from "../models/places";
import AbstractComponent from "./abstract-component";
import EventTypeList from "./event-type-list";
import OptionsComponent from "./options.component";
import {getTypeByName} from "../util/get-type-by-name";
import DestinationComponent from "./destination.component";


export default class TripEventEdit extends AbstractComponent {
  constructor({type, destination, price, options, date, isNew}) {
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
    this._optionsMarkup = new OptionsComponent(Array.from(this._options)).getTemplate();
  }

  getTemplate() {
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
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._destination.name}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${cities.map((item) => `<option value="${item}"></option>`).join(``)}
        </datalist>
      </div>
      
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time event__input--time-start" id="event-start-time-1" type="text" name="event-start-time" value="${format(this._date.start, `dd/MM/yy HH:mm`)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time event__input--time-end" id="event-end-time-1" type="text" name="event-end-time" value="${format(this._date.end, `dd/MM/yy HH:mm`)}">
      </div>
      
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._price}">
      </div>
      
      ${getActionButtons(this._isNew)}
      
    </header>
    
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        ${this._optionsMarkup}
      </section>
      ${this._destinationMarkup}
    </section>
    
  </form>
</li>`;
  }

  getSelectedTypeTemplate(icon) {
    return `
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="42" height="42" src="img/icons/${icon}.png" alt="Event type icon">
    </label>`.trim();
  }

  getDestinationLabelTemplate(typeName, preposition) {
    return `
  <label class="event__label  event__type-output" for="event-destination-1">
    ${ucFirstLetter(typeName)} ${preposition}
  </label>`.trim();
  }
}


function getActionButtons(isNew) {
  return `
    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn">${isNew ? `Cancel` : `Delete`}</button>
  `.trim();
}
