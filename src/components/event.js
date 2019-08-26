import {ucFirstLetter} from "../util/uc-first";

export const createEventTemplate = ({type, destination, price, selectedOptions, dateStart, duration}) => {
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
                        <time class="event__start-time"
                          datetime="${dateStart}">${dateStart}
                        </time>
                        &mdash;
                        <time class="event__end-time" datetime="${dateStart + duration}">
                          ${dateStart + duration}
                        </time>
                      </p>
                      <p class="event__duration">${duration}</p>
                    </div>

                    <p class="event__price">
                      &euro;&nbsp;<span class="event__price-value">${price}</span>
                    </p>

                    <h4 class="visually-hidden">Offers:</h4>
                    <ul class="event__selected-offers">
                    ${Array.from(selectedOptions).map((option) =>`
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
