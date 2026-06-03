"use client";

import {
  useCallback,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";

import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/app/actions/products";

//para el estado inicial del form
const initialForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  image: "",
};

export default function ProductManager({ initialProducts = [] }) {

  //navegación
  const router = useRouter();
  //estado del forms
  const [form, setForm] = useState(initialForm);
  //para que react sepa qué producto estamos editando
  const [editingId, setEditingId] = useState("");
  //mostrar mensajes
  const [message, setMessage] = useState("");
  //si está en proceso de guardado, por ejemplo para deshabilitar botones
  const [isSaving, setIsSaving] = useState(false);
  //estado para actualización de la página
  const [isRefreshing, startRefreshTransition] = useTransition();

  //useCallback: evita que se cree la función en cada render y usa la que se creo antes
  //resetea el estado del forms y sale del modo edición, sacandole el valor al id
  const resetForm = useCallback(() => {
    setForm(initialForm);
    setEditingId("");
  }, []);

  //volver a cargar los datos de la página. ejecuta los server components de nuevo y trae los datos nuevos
  const refreshProducts = useCallback(() => {
    startRefreshTransition(() => {
      router.refresh();
    });
  }, [router]);


  //va armando el nuevo estado de form con un spread y prop dinámica
  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }


  async function handleSubmit(event) {

    //evita que el forms recargue la página
    event.preventDefault();
    //activa el estado de guardado
    setIsSaving(true);

    //convierte el formulario en objeto
    const formData = new FormData(event.currentTarget);

    //a partir del estdo de edicion, si tiene id pasa la función de actualizar, sino, la de crear
    //bind: hace que el primer parámetro (id osea editing id) ya quede guardado y solo pongamos los dos siguientes
    const action = editingId ? updateProduct.bind(null, editingId) : createProduct;

    try {
      const result = await action(null, formData);
      setMessage(result.message);

      //si se resuelve resetea y refresca los productos
      if (result.ok) {
        resetForm();
        refreshProducts();
      }
    } catch {
      setMessage("Ocurrio un error al guardar el producto.");
    } finally {
      //siempre termina el proceso de guardado
      setIsSaving(false);
    }
  }

  function handleEdit(product) {
    //guarda el id del producto
    setEditingId(product._id);
    //hace que los inputs se completen, carga los datos en el forms próximos a editar
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image || "",
    });
    setMessage("Editando producto.");
  }

  async function handleDelete(id) {

    //llama a la server action
    const result = await deleteProduct(id);

    //si hay caso de error:
    if (!result.ok) {
      setMessage(result.message || "No se pudo eliminar el producto.");
      return;
    }

    //caso especial: si es igual a uno que estoy editando se recarga el form
    if (editingId === id) {
      resetForm();
    }

    //le da el valor al message
    setMessage(result.message);
    //refresca los productos
    refreshProducts();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          {editingId ? "Editar producto" : "Nuevo producto"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Formulario simple para probar los endpoints del CRUD.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            required
          />
          <textarea
            className="min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            name="description"
            placeholder="Descripcion"
            value={form.description}
            onChange={handleChange}
          />
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            name="price"
            placeholder="Precio"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            name="stock"
            placeholder="Stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            required
          />
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            name="image"
            placeholder="URL de imagen"
            value={form.image}
            onChange={handleChange}
          />

          <div className="flex gap-3">
            <button
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
            </button>
            <button
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
              type="button"
              onClick={resetForm}
            >
              Limpiar
            </button>
          </div>
        </form>

        {message ? <p className="mt-4 text-sm text-slate-700">{message}</p> : null}
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Productos</h2>
            <p className="mt-2 text-sm text-slate-600">
              Lista obtenida desde el container del dashboard.
            </p>
          </div>
          <button
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
            disabled={isRefreshing}
            type="button"
            onClick={refreshProducts}
          >
            {isRefreshing ? "Recargando..." : "Recargar"}
          </button>
        </div>

        {initialProducts.length === 0 ? (
          <p className="mt-6 text-slate-600">Todavia no hay productos cargados.</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {initialProducts.map((product) => (
              <article
                key={product._id}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{product.name}</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {product.description || "Sin descripcion"}
                    </p>
                  </div>
                  <div className="text-right text-sm text-slate-700">
                    <p>${product.price}</p>
                    <p>Stock: {product.stock}</p>
                  </div>
                </div>

                <p className="mt-3 break-all text-xs text-slate-500">
                  ID: {product._id}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    className="rounded-xl bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900"
                    type="button"
                    onClick={() => handleEdit(product)}
                  >
                    Editar
                  </button>
                  <button
                    className="rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-900"
                    type="button"
                    onClick={() => handleDelete(product._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
