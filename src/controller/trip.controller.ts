import DayList from "../components/day-list";
import Day from "../components/day";
import { render, unrender } from "../util/dom";
import EmptyPointList from "../components/empty-point-list";
import Sort from "../components/sort";
import { sortFns, SortType } from "../models/sort";
// @ts-ignore
import getDate from "date-fns/getDate";
// @ts-ignore
import getMonth from "date-fns/getMonth";
// @ts-ignore
import getYear from "date-fns/getYear";
import { PointController } from "./point-controller";
import { getId } from "../util/get-id";
import { EventMode } from "../models/event-mode";
import { EventFilter } from "../models/event-filter";
import api from "../api";
import { EventModeValue } from "../types/event-mode-value";
import { EventFilterValue } from "../types/event-filter-value";

export class TripController {
  private readonly _container: any;
  private _eventListValue: any;
  private _dayList: any;
  private _emptyPointList: any;
  private _sortType: any;
  private _sort: any;
  private _isEventCreating: any;
  private _filterType: EventFilterValue;
  private _subscriptions: any;

  constructor(eventList, container) {
    this._container = container;
    this._dayList = new DayList();
    this._emptyPointList = new EmptyPointList();
    this._sortType = SortType.EVENT;
    this._sort = new Sort(this._sortType, this._sortType === SortType.EVENT);
    this._isEventCreating = false;
    this._filterType = EventFilter.DEFAULT;

    this._subscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onRemoveEvent = this._onRemoveEvent.bind(this);
  }

  private get _isShowDay() {
    return this._sortType === SortType.EVENT;
  }

  private get _eventList() {
    return this._eventListValue;
    //   .filter(filterFns[this._filterType])
    //   .sort(sortFns[this._sortType]);
  }

  private set _eventList(newValue) {
    this._eventListValue = newValue;
  }

  public init() {
    api.getEvents().then(response => {
      this._eventListValue = response;
      if (this._eventList.length) {
        this._renderSort();
        this._renderDayList();
      } else {
        this._renderEmptyEventList();
      }
    });
  }

  public createEvent() {
    if (this._isEventCreating) {
      return;
    }
    if (!this._dayList.length) {
      unrender(this._emptyPointList.getElement());
      this._emptyPointList.removeElement();
      this._renderSort();
    }
    this._isEventCreating = true;
    this._eventList = [getDefaultEvent(), ...this._eventList];
    this.unrenderDayList();
    this._renderDayList();
  }

  public unrenderSort() {
    unrender(this._sort.getElement());
    this._sort.removeElement();
  }

  public unrenderDayList() {
    unrender(this._dayList.getElement());
    this._dayList.removeElement();
  }

  public updateFilter(filterType) {
    this._filterType = filterType;
    this.unrenderSort();
    this.unrenderDayList();
    this._renderSort();
    this._renderDayList();
  }

  private _renderSort() {
    this._sort.getElement().addEventListener(`change`, this._onSortChange.bind(this));
    render(this._sort.getElement(), this._container);
  }

  private _renderEmptyEventList() {
    render(this._emptyPointList.getElement(), this._container);
  }

  private _renderDayList() {
    render(this._dayList.getElement(), this._container);
    const dayList = this._isShowDay
      ? groupEventsByDay(this._eventList.sort(sortFns[this._sortType]))
      : [...[this._eventList.sort(sortFns[this._sortType])]];

    dayList.forEach((day, dayIndex) => {
      this._renderDay({
        dayEvents: day,
        dayIndex,
        container: this._dayList.getElement(),
      });
    });
  }

  private _renderDay({ dayEvents, dayIndex, container }) {
    const day = new Day({
      date: dayEvents[0].date.start,
      dayIndex: this._isEventCreating ? dayIndex : dayIndex + 1,
      isShowDate: !dayEvents[0].isNew && this._isShowDay,
    });
    const eventsContainer = day.getElement().querySelector(`.trip-events__list`);

    render(day.getElement(), container);
    dayEvents.forEach(event => this._renderEvent(event, eventsContainer));
  }

  private _renderEvent(eventData, container) {
    const event = new PointController({
      eventData,
      container,
      eventMode: getEventMode(eventData.isNew),
      onDataChange: this._onDataChange,
      onViewChange: this._onViewChange,
      onRemoveEvent: this._onRemoveEvent,
    });
    event.init();
    this._subscriptions.push(event.closeEventsEdit.bind(event));
  }

  private _removeEvent(eventId) {
    const removeIndex = this._eventList.findIndex(tripEvent => tripEvent.id === eventId);
    this._eventList = [...this._eventList.slice(0, removeIndex), ...this._eventList.slice(removeIndex + 1)];
  }

  private _onSortChange(evt): void {
    this._sortType = evt.target.dataset.sort;
    this.unrenderDayList();
    this.unrenderSort();
    this._sort = new Sort(this._sortType, this._isShowDay);
    this._renderSort();
    this._renderDayList();
  }

  private _onDataChange(entry): void {
    this._isEventCreating = false;
    const changedProperty = this._eventList.find(tripEvent => tripEvent.id === entry.id);
    updateProps(changedProperty, entry);
    this.unrenderDayList();
    this._renderDayList();
  }

  private _onRemoveEvent(eventId: string): void {
    this._isEventCreating = false;
    this._removeEvent(eventId);
    this.unrenderDayList();
    if (this._eventList.length) {
      this._renderDayList();
    } else {
      this.unrenderSort();
      this._renderEmptyEventList();
    }
  }

  private _onViewChange(): void {
    this._subscriptions.forEach(subscription => subscription());
  }
}

function groupEventsByDay(eventList) {
  const dayList = eventList.reduce((accum, item) => {
    if (item.isNew) {
      accum.set(0, [item]);
      return accum;
    }
    const dateKey = `${getDate(item.date.start)}.${getMonth(item.date.start)}.${getYear(item.date.start)}`;
    if (!accum.has(dateKey)) {
      accum.set(dateKey, []);
    }
    accum.get(dateKey).push(item);
    return accum;
  }, new Map());
  return Array.from(dayList.values());
}

function updateProps(originalEvent, newEvent): void {
  Object.entries(newEvent).forEach(([key, value]) => {
    if (originalEvent.hasOwnProperty(key)) {
      originalEvent[key] = value;
    }
  });
  originalEvent.isNew = false;
}

function getEventMode(isNew: boolean): EventModeValue {
  return isNew ? EventMode.EDIT : EventMode.READ;
}

function getDefaultEvent() {
  return {
    type: `train`,
    description: ``,
    date: {
      start: new Date(),
      duration: 0,
      end: new Date(),
    },
    destination: ``,
    price: ``,
    options: new Set(),
    pictures: [],
    id: getId(),
    isNew: true,
  };
}