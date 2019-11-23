import { Point } from "./point";
import { HandleServerError } from "./handle-server-error";

export interface PointControllerConfig {
  eventData: Point;
  container: HTMLDivElement;
  isEditing: boolean;
  onDataChange: (entry: Point, onError: HandleServerError) => void;
  onViewChange: () => void;
  onRemoveEvent: (point: Point, onError: HandleServerError) => void;
}
