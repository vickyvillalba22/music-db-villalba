//todo lo que hace este archivo se ejecuta en el servidor
"use server";

import mongoose from "mongoose";
//es de next, sirve para actualizar páginas cacheadas cuando cambia la información
import { revalidatePath } from "next/cache";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

//FUNCIONES REUTILIZABLES

//agarra el formulario, toma los valores y los junta en un objeto
function getProductPayload(formData) {
  return {
    name: formData.get("name"),
    description: formData.get("description"),
    //se usa number porque los forms envían texto, pero en el schema este dato es un número
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    image: formData.get("image"),
  };
}

//wrapper para que la home vuelva a consultar los datos actualizados cuando algo cambia
function revalidateProductsDashboard() {
  revalidatePath("/");
}

//FUNCIONES CRUD (3/4)(el get está en products)

export async function createProduct(_previousState, formData) {

  try {

    //conexión
    await connectDB();
    //creación del producto a partir de los datos del form
    await Product.create(getProductPayload(formData));
    //actualización de datos en ui
    revalidateProductsDashboard();

    return { ok: true, message: "Producto creado." };

  } catch (error) {
    return {
      ok: false,
      message: error.message || "Error al crear el producto.",
    };
  }
}

export async function updateProduct(id, _previousState, formData) {

  //verifica que el id tenga el formato válido, antes de hacer la consulta
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, message: "ID de producto invalido." };
  }

  //acción de la db
  try {
    await connectDB();

    const product = await Product.findByIdAndUpdate(id, getProductPayload(formData), {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return { ok: false, message: "Producto no encontrado." };
    }

    //actualización ui
    revalidateProductsDashboard();
    //devuelve msj para la ui que esté utilizando esta acción
    return { ok: true, message: "Producto actualizado." };

  } catch (error) {

    return {
      ok: false,
      message: error.message || "Error al actualizar el producto.",
    };
    
  }
}

export async function deleteProduct(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, message: "ID de producto invalido." };
  }

  try {
    await connectDB();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return { ok: false, message: "Producto no encontrado." };
    }

    revalidateProductsDashboard();
    return { ok: true, message: "Producto eliminado." };
  } catch (error) {
    return {
      ok: false,
      message: error.message || "Error al eliminar el producto.",
    };
  }
}
