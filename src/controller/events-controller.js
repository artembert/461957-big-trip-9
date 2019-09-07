export class EventsController {
  // eslint-disable-next-line valid-jsdoc
  /**
   * @param {import("../types/trip-event").TripEventT[]} eventList
   * @param {HTMLElement} container
   */
  constructor(eventList, container) {
    this._container = container;
    this._eventList = eventList;
  }
}
