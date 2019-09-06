import {createTripInfoTemplate} from './components/info';
import Menu from './components/menu';
import {createFilterTemplate} from './components/filter';
import {createDayListTemplate} from './components/day-list';
import {createEventEditTemplate} from './components/event-edit';
import {createEventTemplate} from './components/event';
import {render, renderNew} from "./util/dom";
import {getEventList, getFilters, getMenu, getInfo} from "./data";

const EVENT_COUNT = 7;

const eventList = getEventList(EVENT_COUNT);

renderPage(eventList);

function renderPage(events) {
  const headerElement = document.querySelector(`.trip-info`);
  const menuContainer = document.querySelector(`.trip-main__menu`);
  const filterTitleElement = document.querySelector(`.filter-title`);
  const scheduleElement = document.querySelector(`.trip-events`);

  render(createTripInfoTemplate(getInfo(events)), headerElement, `afterbegin`);
  renderMenu(getMenu(), menuContainer);
  render(createFilterTemplate(getFilters()), filterTitleElement, `afterend`);
  render(createDayListTemplate(), scheduleElement);

  const eventsListElement = document.querySelector(`.trip-events__list`);
  render(createEventEditTemplate(events[0]), eventsListElement);
  renderEvents(events, eventsListElement);
}

function renderEvents(eventCollection, eventListElem) {
  eventCollection.slice(1).forEach((event) => render(createEventTemplate(event), eventListElem));
}

function renderMenu(menuItems, container) {
  const menu = new Menu(menuItems);
  renderNew(menu.getElement(), container, `beforeend`);
}
