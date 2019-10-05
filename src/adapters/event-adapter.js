import getTime from 'date-fns/getTime';

export default class EventAdapter {
  constructor(json) {
    this.type = json[`type`];
    this.description = undefined;
    this.date = {
      start: dateToTimeStamp(json[`date_from`]),
      duration: getDuration(dateToTimeStamp(json[`date_from`]), dateToTimeStamp(json[`date_to`])),
      end: dateToTimeStamp(json[`date_to`]),
    };
    this.destination = undefined;
    this.price = json[`base_price`];
    this.options = undefined;
    this.pictures = undefined;
    this.id = json[`id`];
    this.isFavourite = json[`is_favourite`];
  }

  static parseEvent(json) {
    return new EventAdapter(json);
  }

  static parseEvents(json) {
    return json.map(EventAdapter.parseEvent);
  }
}

function getDuration(dateStart, dateEnd) {
  return dateEnd - dateStart;
}

function dateToTimeStamp(dateString) {
  return getTime(dateString);
}
