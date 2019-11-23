import AbstractComponent from "./abstract-component";

export default class DayListComponent extends AbstractComponent {
  public getTemplate(): string {
    return `<ul class="trip-days"></ul>`;
  }
}
