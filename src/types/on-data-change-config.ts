import { ActionType } from "./action-type";
import { Point } from "./point";
import { HandleServerError } from "./handle-server-error";

export interface OnDataChangeConfig {
  actionType: ActionType;
  point: Point;
  onError?: HandleServerError;
}
