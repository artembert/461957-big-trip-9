import {types} from "../models/types";

export function getTypeByName(typeName) {
  return types.find((type) => type.name === typeName);
}
