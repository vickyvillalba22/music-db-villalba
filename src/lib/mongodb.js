//MONGODB.JS: conectarse a mongo db y reutilizar la conexión existente.

//mongoose: librería de js que se pone entre mi app y mongo DB. sirve para: definir schemas, validar datos, metodos de crud
import mongoose from "mongoose";

//lee la variable de entorno
const MONGODB_URI = process.env.MONGODB_URI;

//valida que exista la variable de entorno
if (!MONGODB_URI) {
  throw new Error("Falta la variable MONGODB_URI en el archivo .env");
}

//guarda una conexión global para que la misma no se haga muchas veces
let cached = global.mongoose;
//primera ejecución
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

//funcion de conexión para llamarla desde otras partes
export async function connectDB() {

  //si ya se conectó, devuelve la existente
  if (cached.conn) {
    return cached.conn;
  }

  //si no se intentó conectar
  if (!cached.promise) {
    //la conecta (connect.(variable de entorno)) y devuelve una promise
    cached.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  //guardan información sobre la conexión a mongoDB
  cached.conn = await cached.promise;
  return cached.conn;
}
