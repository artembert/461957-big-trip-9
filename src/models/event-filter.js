export const EventFilter = {
  DEFAULT: `default`,
  FEATURE: `feature`,
  PAST: `past`,
};

export const filterFns = {
  default: () => true,
  feature: (tripEvent) => tripEvent.date.start > new Date(),
  past: (tripEvent) => tripEvent.date.end <= new Date(),
};
