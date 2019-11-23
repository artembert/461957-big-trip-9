import { EventModeValue } from "./event-mode-value";
import { Point } from "./point";
import { HandleServerError } from "./handle-server-error";

export interface PointControllerConfig {
  eventData: Point;
  container: HTMLDivElement;
  eventMode: EventModeValue;
  onDataChange: (entry: Point, onError: HandleServerError) => void;
  onViewChange: () => void;
  onRemoveEvent: (point: Point, onError: HandleServerError) => void;
}
