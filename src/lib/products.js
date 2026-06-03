//importa la función que conecta la db
import { connectDB } from "@/lib/mongodb";
//importa el schema del producto
import Product from "@/models/Product";

//recibe el producto de la db y lo devuelve en caracteres o numeros
function serializeProduct(product) {
  return {
    _id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    image: product.image,
    //mongo guarda las fechas como objetos Date()
    createdAt: product.createdAt?.toISOString(),
    updatedAt: product.updatedAt?.toISOString(),
  };
}

//función asíncrona que va a consultar la db
export async function getProducts() {

  //primero espera la conexión con la db
  await connectDB();

  //product.find(): trae todos los productos
  //sort({createdAt:-1}): los ordena desde los más recientes (-1 es desccendiente) 
  //.lean(): como la db devuelve objetos especiales de mongoose, esta función hace que devuelva objetos JS normales mas livianos y rápidos
  const products = await Product.find().sort({ createdAt: -1 }).lean();

  //a todos los productos, los serializa
  return products.map(serializeProduct);
}
