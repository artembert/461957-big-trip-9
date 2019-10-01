import TripInfo from './components/info';
import Menu from './components/menu';
import Filter from './components/filter';
import {render} from "./util/dom";
import {getEventList, getFilters, getInfo, getMenuItems} from "./data";
import {Position} from "./models/position";
import {TripController} from "./controller/trip-controller";
import Stats from "./components/stats";
import {Pages} from "./models/pages";

const EVENT_COUNT = 7;

const eventList = getEventList(EVENT_COUNT);
const onChangeRoute = (evt) => {
  switch (evt.currentTarget.value) {
    case (Pages.EVENTS):
      break;
    case (Pages.STATS):
      break;
    default:
      return;
  }
};


const headerElement = document.querySelector(`.trip-main`);
const menuContainer = document.querySelector(`.trip-main__menu`);
const filterContainer = document.querySelector(`.trip-main__filter`);
const scheduleElement = document.querySelector(`.trip-events`);

const menu = new Menu(getMenuItems());

renderTripInfo(getInfo(eventList), headerElement);
render(menu.getElement(), menuContainer);
renderFilter(getFilters(), filterContainer);

renderStats();
renderEvents(eventList, scheduleElement);

Array.from(menu.getElement()
  .querySelectorAll(`.trip-tabs__toggle`))
  .forEach((link) => {
    link.addEventListener(`change`, (evt) => onChangeRoute(evt));
  });


function renderTripInfo(tripInfoData, container) {
  const tripInfo = new TripInfo(tripInfoData);
  render(tripInfo.getElement(), container, Position.AFTERBEGIN);
}

function renderFilter(filterItems, container) {
  const filter = new Filter(filterItems);
  render(filter.getElement(), container);
}

function renderEvents(eventListData, container) {
  const eventsController = new TripController(eventListData, container);
  eventsController.init();
}

function renderStats() {
  const stats = new Stats();
  const statisticsContainer = document.querySelector(`.page-main__container`);

  render(stats.getElement(), statisticsContainer, Position.AFTERBEGIN);
}
