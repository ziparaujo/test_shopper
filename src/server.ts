import dotenv from "dotenv";
import app from "./app";
import conectaDatabase from "./config/dbConnect";

dotenv.config();

const PORTA = process.env.PORT || 80;

let conexao

(async () => {
  conexao = await conectaDatabase();

  conexao.on("error", (erro) => {
    console.error("erro de conexão:", erro);
  });
  
  conexao.once("open", () => {
    console.log("conexão com o banco de dados efetuada com sucesso")
  })
})();

app.listen(PORTA, () => {
  console.log(`app ouvindo na porta ${PORTA}`);
});
