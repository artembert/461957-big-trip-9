import Menu from "./components/menu";
import Filter from "./components/filter";
import { render } from "./util/dom";
import { getFilters, getMenuItems } from "./mock-data";
import { TripController } from "./controller/trip.controller";
import { Pages } from "./models/pages";
import StatsController from "./controller/stats-controller";
import api from "./api";
import { allDestinations, allOptions } from "./data";
import { EventFilterValue } from "./types/event-filter-value";
import { InfoController } from "./controller/info.controller";
import { Route } from "./types/route";
import { Action } from "./models/action";
import { OnDataChangeConfig } from "./types/on-data-change-config";

const IS_NAV_ACTIVE = false;

const headerElement = document.querySelector<HTMLElement>(`.trip-main`);
const menuContainer = document.querySelector(`.trip-main__menu`);
const filterContainer = document.querySelector(`.trip-main__filter`);
const scheduleElement = document.querySelector<HTMLElement>(`.trip-events`);
const statisticsContainer = document.querySelector(`.page-main__container`);
const addNewEventButton = document.querySelector(`.trip-main__event-add-btn`);

api.getOptions().then(response => {
  allOptions.push(...response);
});
api.getDestinations().then(response => {
  allDestinations.push(...response);
});

const menu = new Menu(getMenuItems());
const filter = new Filter(getFilters());
const infoController = new InfoController(headerElement);
const statsController = new StatsController(statisticsContainer);
const eventsController = new TripController({ container: scheduleElement, onDataChange: onDataChange });

infoController.rerenderInfo();
if (IS_NAV_ACTIVE) {
  render(menu.getElement(), menuContainer);
}
render(filter.getElement(), filterContainer);
addEventListeners();
api.getEvents().then(eventList => {
  infoController.updateData(eventList);
  eventsController.updateData(eventList);
  onChangeRoute(Pages.EVENTS);
});

function onDataChange({ actionType, point, onError }: OnDataChangeConfig): void {
  switch (actionType) {
    case Action.CREATE:
      api
        .createEvent({ data: point })
        .then(() => api.getEvents())
        .then(eventList => {
          infoController.updateData(eventList);
          eventsController.updateData(eventList);
          eventsController.rerender();
        })
        .catch(e => {
          onError(e);
        });
      break;
    case Action.UPDATE:
      api
        .updateEvent({ id: point.id, data: point })
        .then(() => api.getEvents())
        .then(eventList => {
          infoController.updateData(eventList);
          eventsController.updateData(eventList);
          eventsController.rerender();
        })
        .catch(e => {
          onError(e);
        });
      break;
    case Action.DELETE:
      api
        .deleteEvent({ id: point.id })
        .then(() => api.getEvents())
        .then(eventList => {
          infoController.updateData(eventList);
          eventsController.updateData(eventList);
          eventsController.rerender();
        })
        .catch(e => {
          onError(e);
        });
      break;
    case Action.REFRESH:
      api
        .getEvents()
        .then(eventList => {
          infoController.updateData(eventList);
          eventsController.updateData(eventList);
          eventsController.rerender();
        })
        .catch(e => {
          onError(e);
        });
      break;
  }
}

function onChangeRoute(route: Route): void {
  switch (route) {
    case Pages.EVENTS:
      eventsController.unrenderTrip();
      eventsController.renderTrip();
      statsController.destroy();
      break;
    case Pages.STATS:
      eventsController.unrenderTrip();
      statsController.init();
      break;
  }
}

function onAddNewEvent(): void {
  onChangeRoute(Pages.EVENTS);
  eventsController.createEvent();
}

function addEventListeners(): void {
  Array.from(menu.getElement().querySelectorAll(`.trip-tabs__toggle`)).forEach(link => {
    link.addEventListener(`change`, evt => onChangeRoute((evt.currentTarget as HTMLInputElement).value as Route));
  });

  addNewEventButton.addEventListener(`click`, () => onAddNewEvent());

  Array.from(filter.getElement().querySelectorAll(`.trip-filters__filter-input`)).forEach(link => {
    link.addEventListener(`change`, evt =>
      eventsController.updateFilter((evt.currentTarget as HTMLInputElement).value as EventFilterValue),
    );
  });
}
