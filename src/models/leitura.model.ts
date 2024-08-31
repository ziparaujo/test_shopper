import mongoose from "mongoose";
import leituraSchema from "./leitura.schema";
import { ILeitura } from "./leitura.interface";

const Leitura = mongoose.model<ILeitura>("leitura", leituraSchema);

export default Leitura;
