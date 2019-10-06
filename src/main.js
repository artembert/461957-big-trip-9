import TripInfo from './components/info';
import Menu from './components/menu';
import Filter from './components/filter';
import {render} from "./util/dom";
import {getEventList, getFilters, getInfo, getMenuItems} from "./mock-data";
import {Position} from "./models/position";
import {TripController} from "./controller/trip-controller";
import {Pages} from "./models/pages";
import StatsController from "./controller/stats-controller";
import api from "./api";

const EVENT_COUNT = 7;

const onChangeRoute = (route) => {
  switch (route) {
    case (Pages.EVENTS):
      eventsController.unrenderDayList();
      eventsController.unrenderSort();
      eventsController.init();
      statsController.destroy();
      break;
    case (Pages.STATS):
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


const headerElement = document.querySelector(`.trip-main`);
const menuContainer = document.querySelector(`.trip-main__menu`);
const filterContainer = document.querySelector(`.trip-main__filter`);
const scheduleElement = document.querySelector(`.trip-events`);
const statisticsContainer = document.querySelector(`.page-main__container`);
const addNewEventButton = document.querySelector(`.trip-main__event-add-btn`);

const mockEventList = getEventList(EVENT_COUNT);
const eventList = api.getEvents();
const tripInfo = new TripInfo(getInfo(mockEventList));
const menu = new Menu(getMenuItems());
const filter = new Filter(getFilters());
const statsController = new StatsController(statisticsContainer);
const eventsController = new TripController(eventList, scheduleElement);

render(tripInfo.getElement(), headerElement, Position.AFTERBEGIN);
render(menu.getElement(), menuContainer);
render(filter.getElement(), filterContainer);
onChangeRoute(Pages.EVENTS);


Array.from(menu.getElement()
  .querySelectorAll(`.trip-tabs__toggle`))
  .forEach((link) => {
    link.addEventListener(`change`, (evt) => onChangeRoute(evt.currentTarget.value));
  });

addNewEventButton.addEventListener(`click`, () => onAddNewEvent());

Array.from(filter.getElement()
  .querySelectorAll(`.trip-filters__filter-input`))
  .forEach((link) => {
    link.addEventListener(`change`, (evt) => eventsController.updateFilter(evt.currentTarget.value));
  });
