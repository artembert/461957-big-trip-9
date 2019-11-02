import { EventFilterValue } from "../types/event-filter-value";

export const EventFilter: { [key: string]: EventFilterValue } = {
  DEFAULT: `default`,
  FEATURE: `feature`,
  PAST: `past`,
};

export const filterFns: { [key in EventFilterValue]: Function } = {
  default: () => true,
  feature: tripEvent => tripEvent.date.start > new Date(),
  past: tripEvent => tripEvent.date.end <= new Date(),
};
