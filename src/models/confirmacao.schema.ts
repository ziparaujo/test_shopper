import { Schema } from "mongoose";
import { IConfirmacao } from "./confirmacao.interface";

const confirmacaoSchema = new Schema<IConfirmacao>({
  measure_uuid: { type: String, required: [true, "Measure uuid is required."] },
  confirmed_value: { type: Number },
  has_confirmed: { type: Boolean }
}, { versionKey: false });

export default confirmacaoSchema;
