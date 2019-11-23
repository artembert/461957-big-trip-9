import { ActionType } from "../types/action-type";

export const Action: { [key: string]: ActionType } = {
  CREATE: `create`,
  UPDATE: `update`,
  DELETE: `delete`,
};
