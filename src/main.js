import {createTripInfoTemplate} from './components/info';
import {createMenuTemplate} from './components/menu';
import {createFilterTemplate} from './components/filter';
import {createDayListTemplate} from './components/day-list';
import {createEventEditTemplate} from './components/event-edit';
import {createEventTemplate} from './components/event';
import {getEvent} from "./data";
import {render} from "./util/dom";

const EVENT_COUNT = 3;

renderPage();

function renderPage() {
  const headerElement = document.querySelector(`.trip-info`);
  const menuTitleElement = document.querySelector(`.menu-title`);
  const filterTitleElement = document.querySelector(`.filter-title`);
  const scheduleElement = document.querySelector(`.trip-events`);

  render(createTripInfoTemplate(), headerElement, `afterbegin`);
  render(createMenuTemplate(), menuTitleElement, `afterend`);
  render(createFilterTemplate(), filterTitleElement, `afterend`);
  render(createDayListTemplate(), scheduleElement);

  const eventsListElement = document.querySelector(`.trip-events__list`);
  render(createEventEditTemplate(), eventsListElement);
  renderEvents(eventsListElement);
}

function renderEvents(eventList) {
  new Array(EVENT_COUNT)
  .fill(undefined)
  .map(() => render(createEventTemplate(getEvent()), eventList));
}
