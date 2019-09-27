import AbstractComponent from "./abstract-component";

export default class DayList extends AbstractComponent {
  getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }
}
