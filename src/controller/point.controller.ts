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
import { allDestinations, allOptions } from "../data";
import { EventTypeName } from "../types/event-type-name";
import { AssignedOfferItem } from "../types/offer";
import { PointControllerConfig } from "../types/point-controller-config";
import { Point } from "../types/point";
import DestinationComponent from "../components/destination.component";
import OptionsComponent from "../components/options.component";
import { PointAction } from "../models/point-action";
import { HandleServerError } from "../types/handle-server-error";

export class PointController {
  private readonly _container: HTMLDivElement;
  private readonly _eventData: Point;
  private _isEditing: boolean;
  private readonly _onDataChange: (entry: Point, onError: HandleServerError) => void;
  private readonly _onRemoveEvent: (point: Point, onError: HandleServerError) => void;
  private readonly _onViewChange: () => void;
  private readonly _tripEvent: TripEvent;
  private readonly _tripEventEdit: TripEventEdit;
  private readonly _requestToRefresh: () => void;

  public onRequestError: VoidFunction;

  constructor({
    eventData,
    container,
    onDataChange,
    onViewChange,
    onRemoveEvent,
    isEditing,
    requestToRefresh,
  }: PointControllerConfig) {
    this._container = container;
    this._eventData = eventData;
    this._isEditing = isEditing;
    this._onDataChange = onDataChange;
    this._onRemoveEvent = onRemoveEvent;
    this._onViewChange = onViewChange;
    this._requestToRefresh = requestToRefresh;
    this._tripEvent = new TripEvent(this._eventData);
    this._tripEventEdit = new TripEventEdit(this._eventData);
    this.onRequestError = this._tripEventEdit.onRequestError.bind(this);

    this._onSaveEvent = this._onSaveEvent.bind(this);
    this._onDeleteEvent = this._onDeleteEvent.bind(this);
    this._onChangeType = this._onChangeType.bind(this);
    this._onResetEvent = this._onResetEvent.bind(this);
    this._onChangeDestination = this._onChangeDestination.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onEditEvent = this._onEditEvent.bind(this);
    this._requestToRefresh = this._requestToRefresh.bind(this);
  }

  public init(): void {
    if (this._isEditing) {
      this._renderPointEdit();
    } else {
      this._renderPoint();
    }
  }

  public closeEventsEdit(): void {
    if (this._isEditing) {
      this.closeEditForm();
    }
  }

  public closeEditForm(): void {
    this._tripEventEdit.getElement().replaceWith(this._tripEvent.getElement());
    this._isEditing = false;
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

  private _onResetEvent(): void {
    this.closeEditForm();
    document.removeEventListener(`keydown`, this._onKeyDown);
  }

  private _onKeyDown(evt: KeyboardEvent): void {
    if (evt.code === `Esc` || evt.code === `Escape`) {
      this._onResetEvent();
      document.removeEventListener(`keydown`, this._onKeyDown);
    }
  }

  private _onEditEvent(): void {
    this._onViewChange();
    this._tripEvent.getElement().replaceWith(this._tripEventEdit.getElement());
    this._isEditing = true;
    this._addPointEditEventListeners();
    document.addEventListener(`keydown`, this._onKeyDown);
  }

  private _onDeleteEvent(): void {
    if (this._eventData.isNew) {
      this._requestToRefresh();
    } else {
      this._tripEventEdit.lockForm(PointAction.DELETE);
      this._onRemoveEvent(this._eventData, this.onRequestError);
    }
  }

  private _onChangeDestination(evt: InputEvent): void {
    const newDestinationName = (evt.target as HTMLInputElement).value;
    this._eventData.destination = allDestinations.find(destination => destination.name === newDestinationName);
    this.replaceDestinationDescription();
    this._tripEventEdit.validateDestination(!!this._eventData.destination);
  }

  private _onChangeType(evt: Event): void {
    if ((evt.target as HTMLInputElement).checked) {
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
  }

  private _onSaveEvent(evt: Event): void {
    evt.preventDefault();
    this._tripEventEdit.lockForm();
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
    document.removeEventListener(`keydown`, this._onKeyDown);
  }

  private _initFlatpickr(): void {
    const flatpickrStart = flatpickr(
      this._tripEventEdit.getElement().querySelector(`.event__input--time-start`),
      getDateConfig(this._eventData.date.start),
    );
    const flatpickrEnd = flatpickr(this._tripEventEdit.getElement().querySelector(`.event__input--time-end`), {
      ...getDateConfig(this._eventData.date.end),
      minDate: this._eventData.date.start,
    });
    flatpickrStart.config.onChange.push(selectedDates => flatpickrEnd.set(`minDate`, selectedDates[0]));
  }

  private _renderPoint(): void {
    render(this._tripEvent.getElement(), this._container);
    this._addPointEventListeners();
  }

  private _renderPointEdit(): void {
    render(this._tripEventEdit.getElement(), this._container);
    this._addPointEditEventListeners();
  }

  private _addPointEventListeners(): void {
    this._tripEvent
      .getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._onEditEvent);
  }

  private _addPointEditEventListeners(): void {
    this._tripEventEdit
      .getElement()
      .querySelector(`.event__save-btn`)
      .addEventListener(`click`, this._onSaveEvent);
    this._tripEventEdit
      .getElement()
      .querySelector(`.event--edit`)
      .addEventListener(`submit`, this._onSaveEvent);
    this._tripEventEdit
      .getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, this._onDeleteEvent);
    this._tripEventEdit
      .getElement()
      .querySelector(`.event__type-toggle`)
      .addEventListener(`change`, this._onChangeType);
    this._tripEventEdit
      .getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._onResetEvent);
    this._tripEventEdit
      .getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._onChangeDestination);

    this._initFlatpickr();
  }
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
