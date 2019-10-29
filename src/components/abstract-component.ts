import {createElement} from "../util/dom";

export default abstract class AbstractComponent {
  private _element: HTMLElement;

  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only inherit from it.`);
    }
    this._element = null;
  }

  public getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate().trim());
    }
    return (this._element as HTMLElement);
  }

  public abstract getTemplate(): string;

  public removeElement() {
    this._element = null;
  }
}
