import { Destination } from "../types/destination";
import { AssignedOfferItem } from "../types/offer";

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
