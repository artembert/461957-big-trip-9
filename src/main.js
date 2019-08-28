import {createTripInfoTemplate} from './components/info';
import {createMenuTemplate} from './components/menu';
import {createFilterTemplate} from './components/filter';
import {createDayListTemplate} from './components/day-list';
import {createEventEditTemplate} from './components/event-edit';
import {createEventTemplate} from './components/event';
import {render} from "./util/dom";
import {getEventList, getFilters, getMenu, getInfo} from "./data";

const EVENT_COUNT = 7;

const eventList = getEventList(EVENT_COUNT);

renderPage(eventList);

function renderPage(events) {
  const headerElement = document.querySelector(`.trip-info`);
  const menuTitleElement = document.querySelector(`.menu-title`);
  const filterTitleElement = document.querySelector(`.filter-title`);
  const scheduleElement = document.querySelector(`.trip-events`);

  render(createTripInfoTemplate(getInfo(events)), headerElement, `afterbegin`);
  render(createMenuTemplate(getMenu()), menuTitleElement, `afterend`);
  render(createFilterTemplate(getFilters()), filterTitleElement, `afterend`);
  render(createDayListTemplate(), scheduleElement);

  const eventsListElement = document.querySelector(`.trip-events__list`);
  render(createEventEditTemplate(events[0]), eventsListElement);
  renderEvents(events, eventsListElement);
}

function renderEvents(eventCollection, eventListElem) {
  eventCollection.slice(1).forEach((event) => render(createEventTemplate(event), eventListElem));
}
