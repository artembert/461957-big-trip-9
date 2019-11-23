import TripEvent from "../components/trip-event";
import TripEventEdit from "../components/trip-event-edit";
import { createElement, render, unrender } from "../util/dom";
// @ts-ignore
import parse from "date-fns/parse";
// @ts-ignore
import getTime from "date-fns/getTime";
import { getTypeByName } from "../util/get-type-by-name";
// @ts-ignore
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";
import { EventMode } from "../models/event-mode";
import { allDestinations, allOptions } from "../data";
import { EventTypeName } from "../types/event-type-name";
import { AssignedOfferItem } from "../types/offer";
import { PointControllerConfig } from "../types/point-controller-config";
import { Point } from "../types/point";
import { EventModeValue } from "../types/event-mode-value";
import DestinationComponent from "../components/destination.component";
import OptionsComponent from "../components/options.component";
import { PointAction } from "../models/point-action";
import { HandleServerError } from "../types/handle-server-error";

export class PointController {
  private readonly _container: HTMLDivElement;
  private _eventData: Point;
  private _mode: EventModeValue;
  private _onDataChange: (entry: Point, onError: HandleServerError) => void;
  private _onRemoveEvent: (point: Point, onError: HandleServerError) => void;
  private _onViewChange: () => void;
  private _tripEvent: TripEvent;
  private _tripEventEdit: TripEventEdit;

  public onRequestError: VoidFunction;

  constructor({ eventData, container, onDataChange, onViewChange, onRemoveEvent, eventMode }: PointControllerConfig) {
    this._container = container;
    this._eventData = eventData;
    this._mode = eventMode;
    this._onDataChange = onDataChange;
    this._onRemoveEvent = onRemoveEvent;
    this._onViewChange = onViewChange;
    this._tripEvent = new TripEvent(this._eventData);
    this._tripEventEdit = new TripEventEdit(this._eventData);
    this.onRequestError = this._tripEventEdit.onRequestError.bind(this);
  }

  public init(): void {
    //TODO: resolve
    getAllOptions({
      assertedOptions: this._eventData.options,
      type: this._eventData.type,
      allOptions,
    });
    const flatpickrStart = flatpickr(
      this._tripEventEdit.getElement().querySelectorAll(`.event__input--time-start`),
      getDateConfig(this._eventData.date.start),
    );
    const flatpickrEnd = flatpickr(this._tripEventEdit.getElement().querySelectorAll(`.event__input--time-end`), {
      ...getDateConfig(this._eventData.date.end),
      minDate: this._eventData.date.start,
    });
    flatpickrStart.config.onChange.push(selectedDates => flatpickrEnd.set(`minDate`, selectedDates[0]));

    const onEditEvent = () => {
      this._onViewChange();
      this._tripEvent.getElement().replaceWith(this._tripEventEdit.getElement());
      document.addEventListener(`keydown`, onKeyDown);
    };
    const onSaveEvent = evt => {
      this._tripEventEdit.lockForm();
      evt.preventDefault();
      const formData = new FormData(this._tripEventEdit.getElement().querySelector(`.event--edit`));
      const entry: Point = {
        type: formData.get(`event-type`) as EventTypeName,
        date: {
          start: parseTimeTag(formData.get(`event-start-time`)),
          duration: getEventDuration(formData.get(`event-start-time`), formData.get(`event-end-time`)),
          end: parseTimeTag(formData.get(`event-end-time`)),
        },
        destination: {
          name: formData.get(`event-destination`) as string,
        },
        price: +formData.get(`event-price`),
        options: getOptions(this._tripEventEdit.getElement().querySelector(`.event--edit`)),
        id: this._eventData.id,
        isFavourite: !!formData.get(`event-favorite`),
        isNew: this._eventData.isNew,
      };
      this._onDataChange(entry, this.onRequestError);
      document.removeEventListener(`keydown`, onKeyDown);
    };
    const onResetEvent = () => {
      this.closeEditForm();
      document.removeEventListener(`keydown`, onKeyDown);
    };
    const onKeyDown = evt => {
      if (evt.code === `Esc` || evt.code === `Escape`) {
        onResetEvent();
        document.removeEventListener(`keydown`, onKeyDown);
      }
    };
    const onChangeType = evt => {
      if (evt.target.checked) {
        return;
      }
      const selectedTypeName = new FormData(this._tripEventEdit.getElement().querySelector(`.event--edit`)).get(
        `event-type`,
      ) as EventTypeName;
      const selectedType = getTypeByName(selectedTypeName);
      const updatedTypeElement = createElement(this._tripEventEdit.getSelectedTypeTemplate(selectedType.icon));
      const updatedDestinationLabelElement = createElement(
        this._tripEventEdit.getDestinationLabelTemplate(selectedType.name, selectedType.preposition),
      );
      this._tripEventEdit
        .getElement()
        .querySelector(`.event__type-btn`)
        .replaceWith(updatedTypeElement);
      this._tripEventEdit
        .getElement()
        .querySelector(`.event__type-output`)
        .replaceWith(updatedDestinationLabelElement);
      this._eventData.options = allOptions
        .find(option => option.type === selectedType.name)
        .offers.map(offer => ({ ...offer, accepted: false }));
      this.replaceOptions();
    };
    const onRemoveEvent = (): void => {
      this._tripEventEdit.lockForm(PointAction.DELETE);
      this._onRemoveEvent(this._eventData, this.onRequestError);
    };
    const onChangeDestination = evt => {
      const newDestinationName = evt.target.value;
      this._eventData.destination = allDestinations.find(destination => destination.name === newDestinationName);
      this.replaceDestinationDescription();
      this._tripEventEdit.validateDestination(!!this._eventData.destination);
    };

    this._tripEvent
      .getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, onEditEvent);
    this._tripEventEdit
      .getElement()
      .querySelector(`.event__save-btn`)
      .addEventListener(`click`, onSaveEvent);
    this._tripEventEdit
      .getElement()
      .querySelector(`.event--edit`)
      .addEventListener(`submit`, onSaveEvent);
    this._tripEventEdit
      .getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, onRemoveEvent);
    this._tripEventEdit
      .getElement()
      .querySelector(`.event__type-toggle`)
      .addEventListener(`change`, onChangeType);
    this._tripEventEdit
      .getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, onResetEvent);
    this._tripEventEdit
      .getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, onChangeDestination);

    if (this._mode === EventMode.READ) {
      render(this._tripEvent.getElement(), this._container);
    } else if (this._mode === EventMode.EDIT) {
      render(this._tripEventEdit.getElement(), this._container);
    }
  }

  public closeEventsEdit(): void {
    if (this._container.contains(this._tripEventEdit.getElement())) {
      this.closeEditForm();
    }
  }

  public closeEditForm(): void {
    this._tripEventEdit.getElement().replaceWith(this._tripEvent.getElement());
  }

  private get _detailsElement(): HTMLElement {
    let detailsElement: HTMLElement = this._tripEventEdit.getElement().querySelector<HTMLElement>(`.event__details`);
    if (!detailsElement) {
      render(
        createElement(`<section class="event__details"></section>`),
        this._tripEventEdit.getElement().querySelector<HTMLElement>(`.event--edit`),
      );
      detailsElement = this._tripEventEdit.getElement().querySelector<HTMLElement>(`.event__details`);
    }
    return detailsElement;
  }

  private replaceDestinationDescription(): void {
    const destinationMarkup: HTMLElement = this._tripEventEdit
      .getElement()
      .querySelector<HTMLElement>(`.event__section--destination`);
    if (!this._eventData.destination) {
      unrender(destinationMarkup);
    } else {
      const destinationMarkupUpdated: HTMLElement = new DestinationComponent(this._eventData.destination).getElement();
      if (destinationMarkup) {
        destinationMarkup.replaceWith(destinationMarkupUpdated);
      } else {
        this._detailsElement.append(destinationMarkupUpdated);
      }
    }
  }

  private replaceOptions(): void {
    const optionsMarkupUpdated: HTMLElement = new OptionsComponent(this._eventData.options).getElement();
    const optionsMarkup: HTMLElement = this._tripEventEdit
      .getElement()
      .querySelector<HTMLElement>(`.event__section--offers`);
    if (optionsMarkup) {
      optionsMarkup.replaceWith(optionsMarkupUpdated);
    } else {
      this._detailsElement.prepend(optionsMarkupUpdated);
    }
  }
}

function getAllOptions({ assertedOptions, type, allOptions }) {
  // TODO: resolve it
  return assertedOptions;
  return allOptions.find(groupOption => groupOption.type === type).offers;
}

function parseTimeTag(dateTime: FormDataEntryValue | null): number {
  if (typeof dateTime === `string`) {
    return getTime(parse(dateTime, `dd/MM/yy HH:mm`, new Date()));
  } else {
    throw new Error(`Incorrect date format: ${dateTime}`);
  }
}

function getEventDuration(dateStart: FormDataEntryValue | null, dateEnd: FormDataEntryValue | null): number {
  return parseTimeTag(dateEnd) - parseTimeTag(dateStart);
}

function getOptions(container: Element): AssignedOfferItem[] {
  return [...container.querySelectorAll<HTMLInputElement>(`.event__offer-checkbox`)].map(input => ({
    title: input.dataset.name,
    id: input.dataset.id,
    accepted: input.checked,
    price: +input.dataset.price,
  }));
}

function getDateConfig(defaultDate: number): object {
  return {
    altInput: true,
    allowInput: true,
    defaultDate,
    dateFormat: `d/m/y H:i`,
    altFormat: `d/m/y H:i`,
    enableTime: true,
  };
}
