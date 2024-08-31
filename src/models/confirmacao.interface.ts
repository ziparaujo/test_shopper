import { Document } from "mongoose";

export interface IConfirmacao extends Document {
  measure_uuid: string;
  confirmed_value?: number;
  has_confirmed?: boolean;
}
