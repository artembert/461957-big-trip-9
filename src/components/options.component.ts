import AbstractComponent from "./abstract-component";
import { AssignedOfferItem, UniqueOfferItem } from "../types/offer";
import { getId } from "../util/get-id";

export default class OptionsComponent extends AbstractComponent {
  private _optionList: (AssignedOfferItem & UniqueOfferItem)[];

  constructor(optionList: AssignedOfferItem[]) {
    super();
    this._optionList = optionList.map(option => ({ ...option, id: getId() }));
  }

  public getTemplate(): string {
    return `<div class="event__available-offers">
      ${this._optionList
        .map(
          offer =>
            `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
      id="event-offer-${offer.id}-1"
      type="checkbox"
      name="event-offer-${offer.id}"
      ${offer.accepted ? `checked` : ``}
      data-name="${offer.title}"
      data-code="${offer.id}"
      data-price="${offer.price}">
      <label class="event__offer-label" for="event-offer-${offer.id}-1">
        <span class="event__offer-title">${
          offer.title
        }</span>&nbsp;&plus;&nbsp;&euro;&nbsp;<span class="event__offer-price">&nbsp;${offer.price}</span>
      </label>
    </div>`,
        )
        .join(``)}
  </div>`;
  }
}
