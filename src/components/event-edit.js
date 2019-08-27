import {ucFirstLetter} from "../util/uc-first";
import {format} from "date-fns";
import {types} from "../models/types";
import {cities} from "../models/places";

export const createEventEditTemplate = ({type, description, pictures, price, options, date}) => {
  return `
<li class="trip-events__item">
<form class="trip-events__item  event  event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type.icon}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
  
      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Transfer</legend>
          ${types.filter((item) => !item.isPlace).map((item) =>
    `<div class="event__type-item">
            <input id="event-type-${item.name}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item.name}">
            <label class="event__type-label  event__type-label--${item.icon}" for="event-type-${item.name}-1">${item.name}</label>
          </div>
          `).join(``)}
          
        </fieldset>
  
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Activity</legend>
  
          ${types.filter((item) => item.isPlace).map((item) =>
    `<div class="event__type-item">
            <input id="event-type-${item.name}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item.name}">
            <label class="event__type-label  event__type-label--${item.icon}" for="event-type-${item.name}-1">${item.name}</label>
          </div>
          `).join(``)}
          
        </fieldset>
      </div>
    </div>
  
    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        Sightseeing at
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="" list="destination-list-1">
      <datalist id="destination-list-1">
        ${cities.map((item) =>`<option value="${item}"></option>`).join(``)}
      </datalist>
    </div>
  
    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">
        From
      </label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 00:00">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">
        To
      </label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 00:00">
    </div>
  
    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
    </div>
  
    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Cancel</button>
  </header>
  <section class="event__details">
  
            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  
              <div class="event__available-offers">
              ${Array.from(options).map((offer) =>
    `<div class="event__offer-selector">
                  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.code}-1" type="checkbox" name="event-offer-${offer.code}" ${offer.isSelected ? `checked` : ``}>
                  <label class="event__offer-label" for="event-offer-${offer.code}-1">
                    <span class="event__offer-title">${offer.name}</span>&nbsp;&plus;&euro;&nbsp;<span class="event__offer-price">&nbsp;${offer.price}</span>
                  </label>
                </div>`).join(``)}
  
              </div>
            </section>
  
            <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${description}</p>
  
              <div class="event__photos-container">
                <div class="event__photos-tape">
                ${Array.from(pictures).map((picture) =>
  `<img class="event__photo" src="${picture}" alt="Event photo">`).join(``)}
                </div>
              </div>
            </section>
          </section>
  </form>
</li>`;
};
