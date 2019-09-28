import TripEvent from "../components/trip-event";
import TripEventEdit from "../components/trip-event-edit";
import {render} from "../util/dom";
import parse from 'date-fns/parse';
import getTime from 'date-fns/getTime';

export class PointController {
  constructor(eventData, container) {
    this._container = container;
    this._eventData = eventData;
    this._tripEvent = new TripEvent(this._eventData);
    this._tripEventEdit = new TripEventEdit(this._eventData);
  }

  init() {
    const onEditEvent = () => {
      this._tripEvent.getElement().replaceWith(this._tripEventEdit.getElement());
      document.addEventListener(`keydown`, onKeyDown);
    };
    const onSaveEvent = (evt) => {
      evt.preventDefault();
      const formData = new FormData(this._tripEventEdit.getElement().querySelector(`.event--edit`));
      const entry = {
        type: formData.get(`event-type`),
        date: {
          start: parseTimeTag(formData.get(`event-start-time`)),
          duration: getEventDuration(formData.get(`event-start-time`), formData.get(`event-end-time`)),
          end: parseTimeTag(formData.get(`event-end-time`)),
        },
        destination: formData.get(`event-destination`),
        price: formData.get(`event-price`),
        options: getOptions(this._tripEventEdit.getElement().querySelector(`.event--edit`)),
        id: this._eventData.id,
      };
      this.closeEditForm();
      document.removeEventListener(`keydown`, onKeyDown);
    };
    const onResetEvent = () => {
      this.closeEditForm();
      document.removeEventListener(`keydown`, onKeyDown);
    };
    const onKeyDown = (evt) => {
      if (evt.code === `Esc` || evt.code === `Escape`) {
        onResetEvent();
        document.removeEventListener(`keydown`, onKeyDown);
      }
    };

    this._tripEvent.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, onEditEvent);
    this._tripEventEdit.getElement()
      .querySelector(`.event__save-btn`)
      .addEventListener(`click`, onSaveEvent);
    this._tripEventEdit.getElement()
      .querySelector(`.event--edit`)
      .addEventListener(`submit`, onSaveEvent);
    this._tripEventEdit.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, onResetEvent);

    render(this._tripEvent.getElement(), this._container);
  }
}

function parseTimeTag(dateTime) {
  return getTime(parse(dateTime, `dd/MM/yy HH:mm`, new Date()));
}

function getEventDuration(dateStart, dateEnd) {
  return parseTimeTag(dateEnd) - parseTimeTag(dateStart);
}

function getOptions(container) {
  return [...container.querySelectorAll(`.event__offer-checkbox`)]
    .map((input) => ({
      name: input.dataset.name,
      code: input.dataset.code,
      isSelected: input.checked,
      price: input.dataset.price,
    }));
}
