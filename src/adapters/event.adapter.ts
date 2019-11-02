// @ts-ignore
import getTime from "date-fns/getTime";
import { PointJSON } from "../models/point-json";

export default class EventAdapter {
  public type: any;
  public description: any;
  public date: any;
  public destination: any;
  public price: any;
  public options: any;
  public pictures: any;
  public id: any;
  public isFavourite: any;

  constructor(json: PointJSON) {
    this.type = json[`type`];
    this.description = undefined;
    this.date = {
      start: dateToTimeStamp(json[`date_from`]),
      duration: getDuration(dateToTimeStamp(json[`date_from`]), dateToTimeStamp(json[`date_to`])),
      end: dateToTimeStamp(json[`date_to`]),
    };
    this.destination = undefined;
    this.price = json[`base_price`];
    this.options = json[`offers`];
    this.pictures = undefined;
    this.id = json[`id`];
    this.isFavourite = json[`is_favourite`];
  }

  public static parseEvent(json: PointJSON): EventAdapter {
    return new EventAdapter(json);
  }

  public static parseEvents(json: PointJSON[]): EventAdapter[] {
    console.log(json);
    return json.map(EventAdapter.parseEvent);
  }
}

function getDuration(dateStart: number, dateEnd: number): number {
  return dateEnd - dateStart;
}

function dateToTimeStamp(dateString: number): number {
  return getTime(dateString);
}
