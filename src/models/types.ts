import { EventType } from "../types/event-type";

export const moveTypes: EventType[] = [
  { name: `taxi`, icon: `taxi`, preposition: `to`, isPlace: false },
  { name: `bus`, icon: `bus`, preposition: `to`, isPlace: false },
  { name: `train`, icon: `train`, preposition: `to`, isPlace: false },
  { name: `ship`, icon: `ship`, preposition: `to`, isPlace: false },
  { name: `transport`, icon: `transport`, preposition: `to`, isPlace: false },
  { name: `drive`, icon: `drive`, preposition: `to`, isPlace: false },
  { name: `flight`, icon: `flight`, preposition: `to`, isPlace: false },
];

export const placeTypes: EventType[] = [
  { name: `check-in`, icon: `check-in`, preposition: `into`, isPlace: true },
  { name: `sightseeing`, icon: `sightseeing`, preposition: `at`, isPlace: true },
  { name: `restaurant`, icon: `restaurant`, preposition: `in`, isPlace: true },
];

export const types: EventType[] = moveTypes.concat(placeTypes);
