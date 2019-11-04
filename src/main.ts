import Menu from "./components/menu";
import Filter from "./components/filter";
import { render } from "./util/dom";
import { getEventList, getFilters, getMenuItems } from "./mock-data";
import { TripController } from "./controller/trip.controller";
import { Pages } from "./models/pages";
import StatsController from "./controller/stats-controller";
import api from "./api";
import { allOptions } from "./data";
import { EventFilterValue } from "./types/event-filter-value";
import { InfoController } from "./controller/info.controller";
import { Point } from "./types/point";

const EVENT_COUNT = 7;

const onChangeRoute = route => {
  switch (route) {
    case Pages.EVENTS:
      eventsController.unrenderDayList();
      eventsController.unrenderSort();
      eventsController.init();
      statsController.destroy();
      break;
    case Pages.STATS:
      eventsController.unrenderDayList();
      eventsController.unrenderSort();
      statsController.init();
      break;
    default:
      return;
  }
};
const onAddNewEvent = () => {
  onChangeRoute(Pages.EVENTS);
  eventsController.createEvent();
};

const headerElement = document.querySelector<HTMLElement>(`.trip-main`);
const menuContainer = document.querySelector(`.trip-main__menu`);
const filterContainer = document.querySelector(`.trip-main__filter`);
const scheduleElement = document.querySelector(`.trip-events`);
const statisticsContainer = document.querySelector(`.page-main__container`);
const addNewEventButton = document.querySelector(`.trip-main__event-add-btn`);

api.getOptions().then(response => {
  allOptions.push(response);
  console.log(allOptions);
});

let eventList = [];
const mockEventList = getEventList(EVENT_COUNT);
const menu = new Menu(getMenuItems());
const filter = new Filter(getFilters());
const infoController = new InfoController(headerElement, eventList);
const statsController = new StatsController(statisticsContainer);
const eventsController = new TripController(mockEventList, scheduleElement);

infoController.rerenderInfo();
render(menu.getElement(), menuContainer);
render(filter.getElement(), filterContainer);
onChangeRoute(Pages.EVENTS);

firstDataLoad().then(events => {
  eventList = events;
  infoController.updateData(eventList);
  infoController.rerenderInfo();
});

Array.from(menu.getElement().querySelectorAll(`.trip-tabs__toggle`)).forEach(link => {
  link.addEventListener(`change`, evt => onChangeRoute((evt.currentTarget as HTMLInputElement).value));
});

addNewEventButton.addEventListener(`click`, () => onAddNewEvent());

Array.from(filter.getElement().querySelectorAll(`.trip-filters__filter-input`)).forEach(link => {
  link.addEventListener(`change`, evt =>
    eventsController.updateFilter((evt.currentTarget as HTMLInputElement).value as EventFilterValue),
  );
});

function firstDataLoad(): Promise<Point[]> {
  return api.getEvents();
}
