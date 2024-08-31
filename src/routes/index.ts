import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import leitura from "./leitura.routes";
import confirmacao from "./confirmacao.routes"

const routes = (app: Express) => {
  app.use(express.json(), leitura);
  app.use(express.json(), confirmacao)
  app.use(cors());
  app.use(helmet());
};

export default routes;