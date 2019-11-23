import { EventFilterValue } from "../types/event-filter-value";
import { Point } from "../types/point";

export const EventFilter: { [key: string]: EventFilterValue } = {
  DEFAULT: `default`,
  FEATURE: `feature`,
  PAST: `past`,
};

export const filterFns: { [key in EventFilterValue]: (Point?) => boolean } = {
  default: () => true,
  feature: (tripEvent: Point) => tripEvent.date.start > new Date().getTime(),
  past: (tripEvent: Point) => tripEvent.date.end <= new Date().getTime(),
};
