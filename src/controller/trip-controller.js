import DayList from "../components/day-list";
import {render, unrender} from "../util/dom";
import EmptyPointList from "../components/empty-point-list";
import TripEvent from "../components/trip-event";
import TripEventEdit from "../components/trip-event-edit";
import Sort from "../components/sort";
import {sortFns, SortType} from "../models/sort";

export class TripController {
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
    this._sortType = SortType.EVENT;
  }


  init() {
    if (!this._eventList.length) {
      render(this._emptyPointList.getElement(), this._container);
    } else {
      this._renderSort();
      render(this._dayList.getElement(), this._container);
      this._renderEvents();
    }
  }

  _renderSort() {
    const sort = new Sort();

    const onChangeSort = (evt) => {
      this._sortType = evt.target.dataset.sort;
      unrender(this._dayList.getElement());
      this._dayList.removeElement();
      render(this._dayList.getElement(), this._container);
      this._renderEvents();
    };

    sort.getElement()
      .addEventListener(`change`, onChangeSort);

    render(sort.getElement(), this._container);
  }

  _renderEvents() {
    this._eventList
      .sort(sortFns[this._sortType])
      .forEach((item) => this._renderEvent(item));
  }

  _renderEvent(eventData) {
    const tripEvent = new TripEvent(eventData);
    const tripEventEdit = new TripEventEdit(eventData);

    const onEditEvent = () => {
      tripEvent.getElement().replaceWith(tripEventEdit.getElement());
      document.addEventListener(`keydown`, onKeyDown);
    };
    const onSaveEvent = () => {
      tripEventEdit.getElement().replaceWith(tripEvent.getElement());
      document.removeEventListener(`keydown`, onKeyDown);
    };
    const onResetEvent = () => {
      tripEventEdit.getElement().replaceWith(tripEvent.getElement());
      document.removeEventListener(`keydown`, onKeyDown);
    };
    const onKeyDown = (evt) => {
      if (evt.code === `Esc` || evt.code === `Escape`) {
        onResetEvent();
        document.removeEventListener(`keydown`, onKeyDown);
      }
    };

    tripEvent.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, onEditEvent);
    tripEventEdit.getElement()
      .querySelector(`.event__save-btn`)
      .addEventListener(`click`, onSaveEvent);
    tripEventEdit.getElement()
      .querySelector(`.event--edit`)
      .addEventListener(`submit`, onSaveEvent);
    tripEventEdit.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, onResetEvent);

    // @ts-ignore
    render(tripEvent.getElement(), this._dayList.getElement().querySelector(`.trip-events__list`));
  }
}
