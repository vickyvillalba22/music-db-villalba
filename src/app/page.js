import ProductDashboardContainer from "@/containers/ProductDashboardContainer";

export const dynamic = "force-dynamic";

//PONERLO EN UN ARCHIVO APARTE
const endpoints = [
  "GET /api/products",
  "POST /api/products",
  "GET /api/products/:id",
  "PUT /api/products/:id",
  "DELETE /api/products/:id",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-3xl bg-slate-900 px-8 py-10 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
            Programacion 3
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight">
            CRUD simple de productos con Next.js, API Routes y MongoDB
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300">
            Proyecto base para ecommerce con Mongoose. Desde esta misma pantalla
            podes crear, listar, editar y eliminar productos.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {endpoints.map((endpoint) => (
              <span
                key={endpoint}
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm"
              >
                {endpoint}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Ejemplo de consumo desde componentes</h2>
          <p className="mt-2 text-sm text-slate-600">
            La lista inicial se consulta en un Server Component y las mutaciones
            pasan por Server Actions.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">
{`const products = await getProducts();`}
          </pre>
        </section>

        <section className="mt-8">
          <ProductDashboardContainer />
        </section>
      </div>
    </main>
  );
}
