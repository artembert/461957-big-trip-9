import { Destination } from "./destination";
import { AssignedOfferItem } from "./offer";

export interface PointJSON {
  id?: string;
  type?: string;
  date_from?: number;
  date_to?: number;
  destination?: Destination;
  base_price?: number;
  is_favorite?: boolean;
  offers?: AssignedOfferItem[];
}
