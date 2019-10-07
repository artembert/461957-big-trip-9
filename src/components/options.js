import AbstractComponent from "./abstract-component";

export default class Options extends AbstractComponent {
  constructor(optionList) {
    super();
    this._optionList = optionList;
  }

  getTemplate() {
    return `<div class="event__available-offers">
      ${this._optionList.map((offer) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
      id="event-offer-${offer.code}-1"
      type="checkbox"
      name="event-offer-${offer.code}"
      ${offer.isSelected ? `checked` : ``}
      data-name="${offer.name}"
      data-code="${offer.code}"
      data-price="${offer.price}">
      <label class="event__offer-label" for="event-offer-${offer.code}-1">
        <span class="event__offer-title">${offer.name}</span>&nbsp;&plus;&nbsp;&euro;&nbsp;<span class="event__offer-price">&nbsp;${offer.price}</span>
      </label>
    </div>`).join(``)}
  </div>`;
  }
}
