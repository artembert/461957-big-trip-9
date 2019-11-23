import { DayEvents } from "./day-events";

export interface RenderDayConfig {
  dayEvents: DayEvents;
  dayIndex: number;
  container: HTMLElement;
}
