export const eventTypeNames = [
  `taxi`,
  `bus`,
  `train`,
  `ship`,
  `transport`,
  `drive`,
  `flight`,
  `check-in`,
  `sightseeing`,
  `restaurant`,
] as const;

export type EventTypeName = typeof eventTypeNames[number];
