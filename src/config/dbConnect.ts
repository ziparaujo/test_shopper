import mongoose, { Connection } from "mongoose";

async function conectaDatabase(): Promise<Connection> {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING || '');

    return mongoose.connection;
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    throw new Error("Não foi possível conectar ao banco de dados.");
  }
}

export default conectaDatabase;
