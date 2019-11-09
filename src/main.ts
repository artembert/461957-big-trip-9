import Menu from "./components/menu";
import Filter from "./components/filter";
import { render } from "./util/dom";
import { getFilters, getMenuItems } from "./mock-data";
import { TripController } from "./controller/trip.controller";
import { Pages } from "./models/pages";
import StatsController from "./controller/stats-controller";
import api from "./api";
import { allOptions } from "./data";
import { EventFilterValue } from "./types/event-filter-value";
import { InfoController } from "./controller/info.controller";
import { Point } from "./types/point";
import { ActionType } from "./types/action-type";
import { Route } from "./types/route";
import { Action } from "./models/action";

const headerElement = document.querySelector<HTMLElement>(`.trip-main`);
const menuContainer = document.querySelector(`.trip-main__menu`);
const filterContainer = document.querySelector(`.trip-main__filter`);
const scheduleElement = document.querySelector<HTMLElement>(`.trip-events`);
const statisticsContainer = document.querySelector(`.page-main__container`);
const addNewEventButton = document.querySelector(`.trip-main__event-add-btn`);

api.getOptions().then(response => {
  allOptions.push(response);
  console.log(allOptions);
});

const menu = new Menu(getMenuItems());
const filter = new Filter(getFilters());
const infoController = new InfoController(headerElement);
const statsController = new StatsController(statisticsContainer);
const eventsController = new TripController({ container: scheduleElement, onDataChange: onDataChange });

infoController.rerenderInfo();
render(menu.getElement(), menuContainer);
render(filter.getElement(), filterContainer);
addEventListeners();
api.getEvents().then(eventList => {
  infoController.updateData(eventList);
  eventsController.updateData(eventList);
  onChangeRoute(Pages.EVENTS);
});

function onDataChange(actionType: ActionType, point: Point): void {
  switch (actionType) {
    case Action.CREATE:
      break;
    case Action.UPDATE:
      break;
    case Action.DELETE:
      api
        .deleteEvent({ id: point.id })
        .then(() => api.getEvents())
        .then(eventList => {
          infoController.updateData(eventList);
          eventsController.updateData(eventList);
          eventsController.rerender();
        });
      break;
  }
}

function onChangeRoute(route: Route): void {
  switch (route) {
    case Pages.EVENTS:
      eventsController.unrenderEmptyPointList();
      eventsController.unrenderDayList();
      eventsController.unrenderSort();
      eventsController.renderTrip();
      statsController.destroy();
      break;
    case Pages.STATS:
      eventsController.unrenderDayList();
      eventsController.unrenderSort();
      statsController.init();
      break;
  }
}

function onAddNewEvent(): void {
  onChangeRoute(Pages.EVENTS);
  eventsController.createEvent();
}

function addEventListeners(): void {
  Array.from(menu.getElement().querySelectorAll(`.trip-tabs__toggle`)).forEach(link => {
    link.addEventListener(`change`, evt => onChangeRoute((evt.currentTarget as HTMLInputElement).value as Route));
  });

  addNewEventButton.addEventListener(`click`, () => onAddNewEvent());

  Array.from(filter.getElement().querySelectorAll(`.trip-filters__filter-input`)).forEach(link => {
    link.addEventListener(`change`, evt =>
      eventsController.updateFilter((evt.currentTarget as HTMLInputElement).value as EventFilterValue),
    );
  });
}
