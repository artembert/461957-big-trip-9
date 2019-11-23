import AbstractComponent from "./abstract-component";
import { OfferItem } from "../types/offer";

export default class OptionsSelected extends AbstractComponent {
  private readonly _optionList: OfferItem[];

  constructor(optionList: OfferItem[]) {
    super();
    this._optionList = optionList;
  }

  public getTemplate(): string {
    return `${this._optionList
      .map(
        option => `
      <li class="event__offer">
        <span class="event__offer-title">
          ${option.title}</span>&nbsp;&plus;&nbsp;&euro;&nbsp;<span
          class="event__offer-price">&nbsp;${option.price}</span>
       </li>`,
      )
      .join(``)}`;
  }
}
