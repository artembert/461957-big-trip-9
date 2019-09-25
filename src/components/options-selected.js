import AbstractComponent from "./abstract-component";

export default class OptionsSelected extends AbstractComponent {
  constructor(optionList) {
    super();
    this._optionList = optionList;
  }

  getTemplate() {
    return `${this._optionList.map((option) =>`
      <li class="event__offer">
        <span class="event__offer-title">
          ${option.name}</span>&nbsp;&plus;&nbsp;&euro;&nbsp;<span
          class="event__offer-price">&nbsp;${option.price}</span>
       </li>`).join(``)}`;
  }
}
