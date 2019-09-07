import TripInfo from './components/info';
import Menu from './components/menu';
import Filter from './components/filter';
import DayList from './components/day-list';
import {createEventEditTemplate} from './components/event-edit';
import {createEventTemplate} from './components/event';
import {render, renderNew} from "./util/dom";
import {getEventList, getFilters, getInfo, getMenu} from "./data";
import {Position} from "./models/position";

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

  renderDayList(undefined, scheduleElement);

  const eventsListElement = document.querySelector(`.trip-events__list`);
  render(createEventEditTemplate(events[0]), eventsListElement);
  renderEvents(events, eventsListElement);
}

function renderEvents(eventCollection, eventListElem) {
  eventCollection.slice(1).forEach((event) => render(createEventTemplate(event), eventListElem));
}

function renderTripInfo(tripInfoData, container) {
  const tripInfo = new TripInfo(tripInfoData);
  renderNew(tripInfo.getElement(), container, Position.AFTERBEGIN);
}

function renderMenu(menuItems, container) {
  const menu = new Menu(menuItems);
  renderNew(menu.getElement(), container);
}

function renderFilter(filterItems, container) {
  const filter = new Filter(filterItems);
  renderNew(filter.getElement(), container);
}

function renderDayList(dayListData, container) {
  const dayList = new DayList(dayListData);
  renderNew(dayList.getElement(), container);
}
