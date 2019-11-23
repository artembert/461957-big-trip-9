import { SortValue } from "../types/sort-value";
import { Point } from "../types/point";

export const SortType: { [key: string]: SortValue } = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
};

export const sortFns: { [key in SortValue]: (a: Point, b: Point) => number } = {
  event: (a, b) => {
    if (a.isNew) {
      return -1;
    }
    if (b.isNew) {
      return 1;
    }
    return a.date.start - b.date.start;
  },
  time: (a, b) => {
    if (a.isNew) {
      return -1;
    }
    if (b.isNew) {
      return 1;
    }
    return b.date.duration - a.date.duration;
  },
  price: (a, b) => {
    if (a.isNew) {
      return -1;
    }
    if (b.isNew) {
      return 1;
    }
    return b.price - a.price;
  },
};
