import TripInfo from './components/info';
import Menu from './components/menu';
import Filter from './components/filter';
import {render} from "./util/dom";
import {getEventList, getFilters, getInfo, getMenu} from "./data";
import {Position} from "./models/position";
import {TripController} from "./controller/trip-controller";

const EVENT_COUNT = 7;

const eventList = getEventList(EVENT_COUNT);

renderPage(eventList);

function renderPage(events) {
  const headerElement = document.querySelector(`.trip-main`);
  const menuContainer = document.querySelector(`.trip-main__menu`);
  const filterContainer = document.querySelector(`.trip-main__filter`);
  const scheduleElement = document.querySelector(`.trip-events`);

  renderTripInfo(getInfo(events), headerElement);
  renderMenu(getMenu(), menuContainer);
  renderFilter(getFilters(), filterContainer);

  renderEvents(events, scheduleElement);
}

function renderTripInfo(tripInfoData, container) {
  const tripInfo = new TripInfo(tripInfoData);
  render(tripInfo.getElement(), container, Position.AFTERBEGIN);
}

function renderMenu(menuItems, container) {
  const menu = new Menu(menuItems);
  render(menu.getElement(), container);
}

function renderFilter(filterItems, container) {
  const filter = new Filter(filterItems);
  render(filter.getElement(), container);
}

function renderEvents(eventListData, container) {
  const eventsController = new TripController(eventListData, container);
  eventsController.init();
}
