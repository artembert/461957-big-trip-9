import {createElement} from "../util/dom";

export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only inherit from it.`);
    }
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      // @ts-ignore
      this._element = createElement(this.getTemplate().trim());
    }
    return this._element;
  }

  getTemplate() {
    throw new Error(`Abstract method is not implemented`);
  }
}
