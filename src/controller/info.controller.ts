import { Point } from "../types/point";
import TripInfo from "../components/trip-info";
import { render, unrender } from "../util/dom";
import { Position } from "../models/position";
import { Info } from "../types/info";
import { InfoPoints } from "../types/info-points";

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

  private get _getInfo(): Info {
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
    const points = getDestinationList(this._pointList);
    return {
      points: getPoints(points),
      dateStart: firstEvent.date.start,
      dateEnd: lastEvent.date.start,
      cost: getCost(this._pointList),
    };
  }
}

function getDestinationList(events: Point[]): string[] {
  return Array.from(new Set(events.map(event => event.destination.name)));
}

function getPoints(destinationList: string[]): InfoPoints {
  if (destinationList.length === 1) {
    return {
      start: destinationList[0],
      middle: undefined,
      end: undefined,
    };
  } else if (destinationList.length === 2) {
    return {
      start: destinationList[0],
      middle: undefined,
      end: destinationList[1],
    };
  } else if (destinationList.length === 3) {
    return {
      start: destinationList[0],
      middle: destinationList[1],
      end: destinationList[2],
    };
  } else {
    return {
      start: destinationList[0],
      middle: `...`,
      end: destinationList[destinationList.length - 1],
    };
  }
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
