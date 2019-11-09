import { ActionType } from "./action-type";
import { Point } from "./point";

export type OnDataChange = (actionType: ActionType, point: Point) => void;
