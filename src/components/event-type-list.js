import AbstractComponent from "./abstract-component";
import {types} from "../models/types";

export default class EventTypeList extends AbstractComponent {
  constructor(type) {
    super();
    this._currentType = type;
  }

  getTemplate() {
    return `
<div class="event__type-list">

  <fieldset class="event__type-group">
    <legend class="visually-hidden">Transfer</legend>
    
    ${types.filter((item) => !item.isPlace).map((item) =>
    `<div class="event__type-item">
        <input id="event-type-${item.name}-1" class="event__type-input  visually-hidden"
          type="radio" name="event-type" value="${item.name}"
          ${this._currentType.name === item.name ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${item.icon}"
          for="event-type-${item.name}-1">${item.name}</label>
      </div>`).join(``)}
  </fieldset>
  
  <fieldset class="event__type-group">
    <legend class="visually-hidden">Activity</legend>

    ${types.filter((item) => item.isPlace).map((item) =>
    `<div class="event__type-item">
      <input id="event-type-${item.name}-1" class="event__type-input  visually-hidden" type="radio"
        name="event-type" value="${item.name}"
        ${this._currentType.name === item.name ? `checked` : ``}>
      <label class="event__type-label  event__type-label--${item.icon}"
      for="event-type-${item.name}-1">${item.name}</label>
    </div>`).join(``)}
          
  </fieldset>
  
</div>`;
  }
}
