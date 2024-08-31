import mongoose from "mongoose";
import confirmacaoSchema from "./confirmacao.schema";
import { IConfirmacao } from "./confirmacao.interface";

const Confirmacao = mongoose.model<IConfirmacao>("confirmado", confirmacaoSchema);

export default Confirmacao;
