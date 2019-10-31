import { types } from "../models/types";
import { EventType } from "../types/event-type";
import { EventTypeName } from "../types/event-type-name";

export function getTypeByName(typeName: EventTypeName): EventType {
  return types.find(type => type.name === typeName);
}
