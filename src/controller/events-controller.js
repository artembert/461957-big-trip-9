import DayList from "../components/day-list";
import {render} from "../util/dom";
import EmptyPointList from "../components/empty-point-list";
import TripEvent from "../components/trip-event";
import TripEventEdit from "../components/trip-event-edit";

export class EventsController {
  // eslint-disable-next-line valid-jsdoc
  /**
   * @param {import("../types/trip-event").TripEventT[]} eventList
   * @param {Element} container
   */
  constructor(eventList, container) {
    /** @type {Element} */
    this._container = container;
    /** @type {import("../types/trip-event").TripEventT[]} */
    this._eventList = eventList;
    this._dayList = new DayList(undefined);
    this._emptyPointList = new EmptyPointList();
  }


  init() {
    if (!this._eventList.length) {
      render(this._emptyPointList.getElement(), this._container);
    } else {
      render(this._dayList.getElement(), this._container);
      this._eventList.forEach((item) => this._renderEvent(item));
    }
  }

  _renderEvent(eventData) {
    const tripEvent = new TripEvent(eventData);
    const tripEventEdit = new TripEventEdit(eventData);

    const onEditCard = () => tripEvent.getElement().replaceWith(tripEventEdit.getElement());

    tripEvent.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, onEditCard);

    // @ts-ignore
    render(tripEvent.getElement(), this._dayList.getElement().querySelector(`.trip-events__list`));
  }
}
