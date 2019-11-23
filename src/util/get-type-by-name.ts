import { types } from "../models/types";
import { EventType } from "../types/event-type";
import { EventTypeName, eventTypeNames } from "../types/event-type-name";

export function getTypeByName(typeName: EventTypeName): EventType {
  if (!eventTypeNames.includes(typeName)) {
    throw new Error(
      `"${typeName}" is not assignable to parameter of type EventTypeName: [${eventTypeNames.toString()}]`,
    );
  }
  return types.find(type => type.name === typeName);
}
