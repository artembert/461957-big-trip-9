import { EventModeValue } from "./event-mode-value";
import { Point } from "./point";

export interface PointControllerConfig {
  eventData: Point;
  container: HTMLDivElement;
  eventMode: EventModeValue;
  onDataChange: (EventEditInputField) => void;
  onViewChange: () => void;
  onRemoveEvent: (string) => void;
}
