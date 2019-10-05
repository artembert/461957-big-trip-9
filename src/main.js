import TripInfo from './components/info';
import Menu from './components/menu';
import Filter from './components/filter';
import {render, unrender} from "./util/dom";
import {getEventList, getFilters, getInfo, getMenuItems} from "./data";
import {Position} from "./models/position";
import {TripController} from "./controller/trip-controller";
import Stats from "./components/stats";
import {Pages} from "./models/pages";

const EVENT_COUNT = 7;

const eventList = getEventList(EVENT_COUNT);

const onChangeRoute = (route) => {
  switch (route) {
    case (Pages.EVENTS):
      eventsController.unrenderDayList();
      eventsController.unrenderSort();
      eventsController.init();
      unrender(stats.getElement());
      stats.removeElement();
      break;
    case (Pages.STATS):
      eventsController.unrenderDayList();
      eventsController.unrenderSort();
      render(stats.getElement(), statisticsContainer, Position.AFTERBEGIN);
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

const tripInfo = new TripInfo(getInfo(eventList));
const menu = new Menu(getMenuItems());
const filter = new Filter(getFilters());
const stats = new Stats();
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
