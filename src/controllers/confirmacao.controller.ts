import { Request, Response } from 'express';
import Confirmacao from '../models/confirmacao.model';
import Leitura from '../models/leitura.model';

class ConfirmacaoController {

  static async confirmarValor(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.uuid;
      const leituraExistente = await Confirmacao.findOne({ measure_uuid: id }).exec();

      if (!leituraExistente) {
        res.status(404).json({
          error_code: 'MEASURE_NOT_FOUND',
          error_description: 'Leitura não encontrada',
        });
        return;
      }

      if (id !== req.body.measure_uuid) {
        res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: 'O uuid informado no corpo da requisição é diferente do uuid buscado',
        });
        return;
      }

      if (leituraExistente.has_confirmed) {
        res.status(409).json({
          error_code: 'CONFIRMATION_DUPLICATE',
          error_description: 'Leitura já confirmada',
        });
        return;
      }

      await Confirmacao.findOneAndUpdate({ measure_uuid: id }, { ...req.body, has_confirmed: true }).exec();
      await Leitura.findByIdAndUpdate(id, { has_confirmed: true }).exec();

      res.status(200).json({ success: true });

    } catch (erro) {
      if (erro instanceof Error) {
        res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: erro.message,
        });
      } else {
        res.status(500).json({
          error_code: 'INTERNAL_SERVER_ERROR',
          error_description: 'Um erro inesperado ocorreu',
        });
      }
    }
  }
}

export default ConfirmacaoController;
