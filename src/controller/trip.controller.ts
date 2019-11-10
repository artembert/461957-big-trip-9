import DayListComponent from "../components/day-list.component";
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
import { PointController } from "./point.controller";
import { getId } from "../util/get-id";
import { EventMode } from "../models/event-mode";
import { EventFilter, filterFns } from "../models/event-filter";
import { EventModeValue } from "../types/event-mode-value";
import { EventFilterValue } from "../types/event-filter-value";
import { SortValue } from "../types/sort-value";
import { Point } from "../types/point";
import { RenderDayConfig } from "../types/render-day-config";
// @ts-ignore
import objectAssignDeep from "object-assign-deep";
import { TripControllerConfig } from "../types/trip-controller-config";
import { OnDataChange } from "../types/on-data-change";
import { Action } from "../models/action";

export class TripController {
  private readonly _container: Element;
  private readonly _onDataChangeMain: OnDataChange;
  private _eventListValue: Point[] = [];
  private readonly _dayList: DayListComponent;
  private _emptyPointList: EmptyPointList;
  private _sortType: SortValue;
  private _sort: Sort;
  private _isEventCreating: boolean;
  private _filterType: EventFilterValue;
  private _subscriptions: VoidFunction[];

  constructor({ container, onDataChange }: TripControllerConfig) {
    this._container = container;
    this._onDataChangeMain = onDataChange;
    this._dayList = new DayListComponent();
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

  private get _isShowDay(): boolean {
    return this._sortType === SortType.EVENT;
  }

  private get _eventList(): Point[] {
    return this._eventListValue.length
      ? this._eventListValue.filter(filterFns[this._filterType]).sort(sortFns[this._sortType])
      : [];
  }

  private set _eventList(newValue: Point[]) {
    this._eventListValue = newValue;
  }

  public unrenderTrip(): void {
    this.unrenderEmptyPointList();
    this.unrenderSort();
    this.unrenderDayList();
  }

  public renderTrip(): void {
    if (this._eventList.length) {
      this._renderSort();
      this._renderDayList();
    } else {
      this._renderEmptyEventList();
    }
  }

  public updateData(eventList: Point[]): void {
    this._eventListValue = eventList;
  }

  public rerender(): void {
    this.unrenderEmptyPointList();
    this.unrenderSort();
    this.unrenderDayList();
    this.renderTrip();
  }

  public createEvent(): void {
    if (this._isEventCreating) {
      return;
    }
    // TODO: compare with previously state: `if (!this._dayList) {`
    if (!this._dayList) {
      unrender(this._emptyPointList.getElement());
      this._emptyPointList.removeElement();
      this._renderSort();
    }
    this._isEventCreating = true;
    this._eventList = [getDefaultEvent(), ...this._eventList];
    this.unrenderDayList();
    this._renderDayList();
  }

  public unrenderSort(): void {
    unrender(this._sort.getElement());
    this._sort.removeElement();
  }

  public unrenderDayList(): void {
    unrender(this._dayList.getElement());
    this._dayList.removeElement();
  }

  public updateFilter(filterType: EventFilterValue): void {
    this._filterType = filterType;
    this.unrenderSort();
    this.unrenderDayList();
    this._renderSort();
    this._renderDayList();
  }

  public unrenderEmptyPointList(): void {
    unrender(this._emptyPointList.getElement());
    this._emptyPointList.removeElement();
  }

  private _renderSort(): void {
    this._sort.getElement().addEventListener(`change`, this._onSortChange.bind(this));
    render(this._sort.getElement(), this._container);
  }

  private _renderEmptyEventList(): void {
    render(this._emptyPointList.getElement(), this._container);
  }

  private _renderDayList(): void {
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

  private _renderDay({ dayEvents, dayIndex, container }: RenderDayConfig): void {
    const day = new Day({
      date: dayEvents[0].date.start,
      dayIndex: this._isEventCreating ? dayIndex : dayIndex + 1,
      isShowDate: !dayEvents[0].isNew && this._isShowDay,
    });
    const eventsContainer = day.getElement().querySelector<HTMLDivElement>(`.trip-events__list`);

    render(day.getElement(), container);
    dayEvents.forEach(event => this._renderEvent(event, eventsContainer));
  }

  private _renderEvent(eventData: Point, container: HTMLDivElement): void {
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

  private _removeEvent(event: Point): void {
    this._onDataChangeMain(Action.DELETE, event);
  }

  private _onSortChange(evt: Event): void {
    this._sortType = (evt.target as HTMLDivElement).dataset.sort as SortValue;
    this.unrenderDayList();
    this.unrenderSort();
    this._sort = new Sort(this._sortType, this._isShowDay);
    this._renderSort();
    this._renderDayList();
  }

  private _onDataChange(entry: Point): void {
    this._isEventCreating = false;
    if (entry.isNew) {
      this._onDataChangeMain(Action.CREATE, entry);
    } else {
      let changedProperty = this._eventList.find(tripEvent => tripEvent.id === entry.id);
      changedProperty = updateProps(changedProperty, entry);
      this._onDataChangeMain(Action.UPDATE, changedProperty);
    }
  }

  private _onRemoveEvent(event: Point): void {
    this._isEventCreating = false;
    this._removeEvent(event);
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

function groupEventsByDay(eventList: Point[]) {
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

function updateProps(originalEvent: Point, newEvent: Point): Point {
  const updatedEvent: Point = objectAssignDeep(originalEvent, newEvent);
  updatedEvent.isNew = false;
  return updatedEvent;
}

function getEventMode(isNew: boolean): EventModeValue {
  return isNew ? EventMode.EDIT : EventMode.READ;
}

function getDefaultEvent(): Point {
  return {
    type: `train`,
    date: {
      start: new Date().getTime(),
      duration: 0,
      end: new Date().getTime(),
    },
    destination: {
      description: ``,
      name: ``,
      pictures: [],
    },
    price: 0,
    options: [],
    id: getId(),
    isNew: true,
    isFavourite: true,
  };
}
