import { Document } from "mongoose";

export interface ILeitura extends Document {
  image: string;
  customer_code: string;
  measure_datetime: Date;
  measure_type: "WATER" | "GAS";
  has_confirmed?: boolean;
  image_url?: string;
}