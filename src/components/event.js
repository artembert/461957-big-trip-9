import {ucFirstLetter} from "../util/uc-first";
import {format} from "date-fns";
import {MS_IN_DAY, MS_IN_HOUR, MS_IN_MINUTE} from "../models/time";
import AbstractComponent from "./abstract-component";

export const createEventTemplate = ({type, destination, price, options, date}) => {
  return `
<li class="trip-events__item">
  <div class="event">
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type.icon}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">
      ${ucFirstLetter(type.name)} ${type.preposition} ${destination}
    </h3>
  
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${date.start}">
          ${format(date.start, `HH:mm`)}
        </time>
        &mdash;
        <time class="event__end-time" datetime="${date.end}">
          ${format(date.end, `HH:mm`)}
        </time>
      </p>
      <p class="event__duration">${formatDuration(date.duration)}</p>
    </div>
  
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${price}</span>
    </p>
  
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${getSelectedOptions(options).map((option) =>`
      <li class="event__offer">
        <span class="event__offer-title">
          ${option.name}</span>&nbsp;&plus;&nbsp;&euro;&nbsp;<span
          class="event__offer-price">&nbsp;${option.price}</span>
       </li>`).join(``)}
    </ul>
  
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
  </li>`;
};


function formatDuration(duration) {
  const days = Math.floor(duration / MS_IN_DAY);
  const hours = Math.floor((duration - days * MS_IN_DAY) / MS_IN_HOUR);
  const minutes = Math.floor((duration - days * MS_IN_DAY - hours * MS_IN_HOUR) / MS_IN_MINUTE);
  return `${formatUnit(days, `D`)}${formatUnit(hours, `H`)}${formatUnit(minutes, `M`)}`;
}

function formatUnit(value, unit) {
  if (!value) {
    return ``;
  }
  return value.toString().length > 1 ? `${value}${unit} ` : `0${value}${unit} `;
}

function getSelectedOptions(options) {
  return Array.from(options).filter((option) => option.isSelected);
}

export default class XXX extends AbstractComponent {

}
