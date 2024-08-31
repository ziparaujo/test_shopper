import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Leitura from "../models/leitura.model";
import Confirmacao from "../models/confirmacao.model";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

class LeituraController {

  static async registrarLeitura(req: Request, res: Response): Promise<void> {
    try {
      const response = req.body;
      const { image, measure_type, measure_datetime } = response;

      const leituraExistente = await Leitura.findOne({ measure_type: measure_type }).exec();

      let dataExistente: Date;
      let mes: number | undefined;
      const dataReq = new Date(measure_datetime).getMonth() + 1;
      if (leituraExistente) {
        dataExistente = new Date(leituraExistente.measure_datetime);
        mes = dataExistente.getMonth() + 1;
      }

      if (mes === dataReq) {
        res.status(409).json({
          error_code: "DOUBLE_REPORT",
          error_description: "Leitura do mês já realizada",
        });
      } else {
        const uploadCaminho = path.join('./', 'uploads');
        if (!fs.existsSync(uploadCaminho)) {
          fs.mkdirSync(uploadCaminho, { recursive: true });
        }

        const base64Data = image.replace(/^data:image\/png;base64,/, "");
        const arquivoCaminho = path.join(uploadCaminho, `${Date.now()}.png`);
        await fs.promises.writeFile(arquivoCaminho, base64Data, 'base64');
        const arquivoLink = `./uploads/${path.basename(arquivoCaminho)}`;

        const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);
        const uploadResult = await fileManager.uploadFile(`${arquivoLink}`, {
          mimeType: "image/png",
          displayName: "Uploaded Image",
        });

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent([
          "Tell me about this image.",
          {
            fileData: {
              fileUri: uploadResult.file.uri,
              mimeType: uploadResult.file.mimeType,
            },
          },
        ]);

        const novaLeitura = await Leitura.create({
          ...req.body,
          image_url: arquivoLink,
          measure_value: result.response.text(),
          has_confirmed: false,
        });

        await Confirmacao.create({
          measure_uuid: novaLeitura._id,
          confirmed_value: 0,
        });

        res.status(201).json({
          image_url: arquivoLink,
          measure_value: result.response.text(),
          measure_uuid: novaLeitura._id,
        });
      }
    } catch (erro: any) {
      if (erro.name === "ValidationError") {
        res.status(400).json({
          error_code: "INVALID_DATA",
          error_description: "Os dados fornecidos no corpo da requisição são inválidos",
        });
      } else {
        res.status(400).json({
          error_code: "INVALID_DATA",
          error_description: `${erro.message}`,
        });
      }
    }
  }

  static async buscarLeituras(req: Request, res: Response): Promise<void> {
    try {
      const { customer_code } = req.params;
      const { measure_type } = req.query;
      const filtro: any = { customer_code };

      if (measure_type) {
        if (measure_type !== "WATER" && measure_type !== "GAS") {
          res.status(400).json({
            error_code: "INVALID_TYPE",
            error_description: "Tipo de medição não permitida",
          });
          return;
        }
        filtro.measure_type = measure_type;
      }

      const leituraExistente = await Leitura.find(filtro);

      if (!leituraExistente || leituraExistente.length === 0) {
        res.status(404).json({
          error_code: "MEASURES_NOT_FOUND",
          error_description: "Nenhuma leitura encontrada",
        });
        return;
      }

      const retorno = leituraExistente.map((item) => ({
        measure_uuid: item._id,
        measure_datetime: item.measure_datetime,
        measure_type: item.measure_type,
        has_confirmed: item.has_confirmed,
        image_url: item.image_url,
      }));

      const dados = {
        customer_code,
        measures: retorno,
      };

      res.status(200).json(dados);
    } catch (erro: any) {
      res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: `${erro.message}`,
      });
    }
  }

  // static async deletarLeitura(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { id } = req.params;
  //     await Leitura.findByIdAndDelete(id);
  //     res.status(200).json({ message: "Leitura deletada com sucesso" });
  //   } catch (erro: any) {
  //     res.status(400).json({
  //       error_code: "INVALID_DATA",
  //       error_description: `${erro.message}`,
  //     });
  //   }
  // }
}

export default LeituraController;
