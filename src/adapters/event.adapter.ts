// @ts-ignore
import getTime from "date-fns/getTime";
import { PointJSON } from "../models/point-json";
import { Point } from "../models/point";
import { EventDate } from "../types/event-date";
import { Destination } from "../types/destination";
import { EventTypeName } from "../types/event-type-name";
import { AssignedOfferItem } from "../types/offer";

export default class EventAdapter implements Point {
  public type: EventTypeName;
  public date: EventDate;
  public destination: Destination;
  public price: number;
  public options: AssignedOfferItem[];
  public id: string;
  public isFavourite: boolean;

  constructor(json: PointJSON) {
    this.type = json[`type`] as EventTypeName;
    this.date = {
      start: dateToTimeStamp(json[`date_from`]),
      duration: getDuration(dateToTimeStamp(json[`date_from`]), dateToTimeStamp(json[`date_to`])),
      end: dateToTimeStamp(json[`date_to`]),
    };
    this.destination = json[`destination`];
    this.price = json[`base_price`];
    this.options = json[`offers`];
    this.id = json[`id`];
    this.isFavourite = json[`is_favorite`];
  }

  public static parseEvent(json: PointJSON): Point {
    return new EventAdapter(json);
  }

  public static parseEvents(json: PointJSON[]): Point[] {
    return json.map(EventAdapter.parseEvent);
  }
}

function getDuration(dateStart: number, dateEnd: number): number {
  return dateEnd - dateStart;
}

function dateToTimeStamp(dateString: number): number {
  return getTime(dateString);
}
