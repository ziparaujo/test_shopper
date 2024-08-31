import express from 'express';
import ConfirmacaoController from '../controllers/confirmacao.controller';

const routes = express.Router();

routes.patch('/confirm/:uuid', ConfirmacaoController.confirmarValor);

export default routes;