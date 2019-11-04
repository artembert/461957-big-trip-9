import { Point } from "../types/point";
import TripInfo from "../components/trip-info";
import { render, unrender } from "../util/dom";
import { Position } from "../models/position";

export class InfoController {
  private _tripInfoComponent: TripInfo;

  constructor(private _container: HTMLElement, private _pointList: Point[]) {
    this._tripInfoComponent = new TripInfo(this._getInfo);
  }

  public rerenderInfo(): void {
    unrender(this._tripInfoComponent.getElement());
    this._tripInfoComponent.removeElement();
    this._tripInfoComponent = new TripInfo(this._getInfo);
    render(this._tripInfoComponent.getElement(), this._container, Position.AFTERBEGIN);
  }

  public updateData(newPoints: Point[]): void {
    this._pointList = newPoints;
  }

  private get _getInfo() {
    if (!this._pointList.length) {
      return {
        points: undefined,
        dateStart: undefined,
        dateEnd: undefined,
        cost: undefined,
      };
    }
    const sortEventList = this._pointList.sort((event1, event2) => event1.date.start - event2.date.start);
    const firstEvent = sortEventList[0];
    const lastEvent = sortEventList[sortEventList.length - 1];
    const points = getPoints(this._pointList);
    return {
      points: {
        start: points[0],
        middle: getMiddlePoint(points),
        end: points[points.length - 1],
      },
      dateStart: firstEvent.date.start,
      dateEnd: lastEvent.date.start,
      cost: getCost(this._pointList),
    };
  }
}

function getPoints(events) {
  return events.map(event => event.destination).filter(event => !!event);
}

function getMiddlePoint(points) {
  return points.length > 3 ? undefined : points[1];
}

function getCost(events: Point[]) {
  return events.reduce((sum, event) => {
    const optionsCost = event.options
      .filter(option => option.accepted)
      .reduce((accum, option) => {
        return accum + Number(option.price);
      }, 0);
    return sum + Number(event.price) + optionsCost;
  }, 0);
}
