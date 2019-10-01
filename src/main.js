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


const headerElement = document.querySelector(`.trip-main`);
const menuContainer = document.querySelector(`.trip-main__menu`);
const filterContainer = document.querySelector(`.trip-main__filter`);
const scheduleElement = document.querySelector(`.trip-events`);
const statisticsContainer = document.querySelector(`.page-main__container`);

const menu = new Menu(getMenuItems());
const stats = new Stats();
const eventsController = new TripController(eventList, scheduleElement);

renderTripInfo(getInfo(eventList), headerElement);
render(menu.getElement(), menuContainer);
renderFilter(getFilters(), filterContainer);
onChangeRoute(Pages.EVENTS);


Array.from(menu.getElement()
  .querySelectorAll(`.trip-tabs__toggle`))
  .forEach((link) => {
    link.addEventListener(`change`, (evt) => onChangeRoute(evt.currentTarget.value));
  });


function renderTripInfo(tripInfoData, container) {
  const tripInfo = new TripInfo(tripInfoData);
  render(tripInfo.getElement(), container, Position.AFTERBEGIN);
}

function renderFilter(filterItems, container) {
  const filter = new Filter(filterItems);
  render(filter.getElement(), container);
}
