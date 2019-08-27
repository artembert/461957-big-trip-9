import {ucFirstLetter} from "../util/uc-first";
import {format} from "date-fns";
import {MS_IN_DAY, MS_IN_HOUR} from "../models/time";

export const createEventTemplate = ({type, destination, price, options, dateStart, duration}) => {
  return `<li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/${type.icon}.png" alt="Event type icon">
                    </div>
                    <h3 class="event__title">
                      ${ucFirstLetter(type.name)} ${type.preposition} ${destination}
                    </h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="${dateStart}">
                          ${format(dateStart, `HH:mm`)}
                        </time>
                        &mdash;
                        <time class="event__end-time" datetime="${dateStart + duration}">
                          ${format(dateStart + duration, `HH:mm`)}
                        </time>
                      </p>
                      <p class="event__duration">${formatDuration(duration)}</p>
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
  console.log(duration /  (36 * Math.pow(10, 5)));
  if (duration >= MS_IN_DAY) {
    return format(duration, `dd'\D' HH'\H' mm'\M'`);
  } else if (duration >= MS_IN_HOUR) {
    return format(duration, `HH'\H' mm'\M'`);
  } else {
    return format(duration, `mm'\M'`);
  }
}

function getSelectedOptions(options) {
  return Array.from(options).filter((option) => option.isSelected);
}
