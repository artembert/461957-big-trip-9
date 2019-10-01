import DayList from "../components/day-list";
import Day from "../components/day";
import {render, unrender} from "../util/dom";
import EmptyPointList from "../components/empty-point-list";
import Sort from "../components/sort";
import {sortFns, SortType} from "../models/sort";
import getDate from "date-fns/getDate";
import getMonth from 'date-fns/getMonth';
import getYear from 'date-fns/getYear';
import {PointController} from "./point-controller";

export class TripController {
  constructor(eventList, container) {
    this._container = container;
    this._eventList = eventList;
    this._dayList = new DayList();
    this._emptyPointList = new EmptyPointList();
    this._sortType = SortType.EVENT;
    this._sort = new Sort(this._sortType, this._sortType === SortType.EVENT);

    this._subscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  get _isShowDay() {
    return this._sortType === SortType.EVENT;
  }

  init() {
    if (this._eventList.length) {
      this._renderSort();
      this._renderDayList();
    } else {
      render(this._emptyPointList.getElement(), this._container);
    }
  }

  unrenderSort() {
    unrender(this._sort.getElement());
    this._sort.removeElement();
  }

  unrenderDayList() {
    unrender(this._dayList.getElement());
    this._dayList.removeElement();
  }

  _renderSort() {
    this._sort.getElement().addEventListener(`change`, this._onChangeSort.bind(this));
    render(this._sort.getElement(), this._container);
  }

  _onChangeSort(evt) {
    this._sortType = evt.target.dataset.sort;
    this.unrenderDayList();
    this.unrenderSort();
    this._sort = new Sort(this._sortType, this._isShowDay);
    this._renderSort();
    this._renderDayList();
  }

  _renderDayList() {
    render(this._dayList.getElement(), this._container);
    const dayList = this._isShowDay
      ? groupEventsByDay(this._eventList.sort(sortFns[this._sortType]))
      : [...[this._eventList.sort(sortFns[this._sortType])]];

    dayList.forEach((day, dayIndex) => {
      this._renderDay({
        dayEvents: day,
        dayIndex,
        container: this._dayList.getElement()});
    });
  }

  _renderDay({dayEvents, dayIndex, container}) {
    const day = new Day({
      date: dayEvents[0].date.start,
      dayIndex,
      isShowDate: this._isShowDay,
    });
    const eventsContainer = day.getElement().querySelector(`.trip-events__list`);

    render(day.getElement(), container);
    dayEvents.forEach((event) => this._renderEvent(event, eventsContainer));
  }

  _renderEvent(eventData, container) {
    const event = new PointController({
      eventData,
      container,
      onDataChange: this._onDataChange,
      onViewChange: this._onViewChange,
    });
    event.init();
    this._subscriptions.push(event.closeEventsEdit.bind(event));
  }

  _onDataChange(entry) {
    const changedProperty = this._eventList.find((tripEvent) => tripEvent.id === entry.id);
    updateProps(changedProperty, entry);
    this.unrenderDayList();
    this._renderDayList();
  }

  _onViewChange() {
    this._subscriptions.forEach((subscription) => subscription());
  }
}

function groupEventsByDay(eventList) {
  const dayList = eventList.reduce((accum, item) => {
    const dateKey
      = `${getDate(item.date.start)}.${getMonth(item.date.start)}.${getYear(item.date.start)}`;
    if (!accum.has(dateKey)) {
      accum.set(dateKey, []);
    }
    accum.get(dateKey).push(item);
    return accum;
  }, new Map());
  return Array.from(dayList.values());
}

function updateProps(originalEvent, newEvent) {
  Object.entries(newEvent).forEach(([key, value]) => {
    if (originalEvent.hasOwnProperty(key)) {
      originalEvent[key] = value;
    }
  });
}
