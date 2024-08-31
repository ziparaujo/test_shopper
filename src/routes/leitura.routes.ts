import express from 'express';
import LeituraController from '../controllers/leitura.controller';

const routes = express.Router();

routes.post('/upload', LeituraController.registrarLeitura);
routes.get('/:customer_code/list', LeituraController.buscarLeituras);

export default routes;
