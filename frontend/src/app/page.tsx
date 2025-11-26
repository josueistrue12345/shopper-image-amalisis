import { Icon } from "@/components/Icon";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex w-full h-screen overflow-auto flex-col items-center gap-4 py-12 px-16 sm:items-start">
      <Image
        className="invert-image"
        src="/mobo.png"
        alt="Logo Mobo"
        width={100}
        height={20}
        priority
      />
      <section className="flex flex-col w-full h-full items-center gap-28 text-center sm:flex-row sm:text-left">
        <div className="flex flex-col w-full gap-6 items-center justify-center sm:items-start">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Analizador de imágenes
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Realiza la revision automática de formularios, a través de la carga
            inicial de fotografías indicando ciertas reglas relacionadas con la
            categorización de evidencias.
          </p>
        </div>

        <aside className="flex flex-col w-full gap-4 items-center text-center sm:flex-row">
          <Link
            href={"/search"}
            className="flex flex-col items-center max-w-30 py-4 px-6 gap-2 rounded-xl outline outline-current/20 hover:bg-current/10"
          >
            <Icon name="search" />
            <p className="text-sm font-bold">Buscar formularios</p>
          </Link>
          <Link href={"/analysis"} className="flex flex-col items-center max-w-30 py-4 px-6 gap-2 rounded-xl outline outline-current/20 hover:bg-current/10">
            <Icon name="analytics" />
            <p className="text-sm font-bold">Análisis realizados</p>
          </Link>
          <button className="flex flex-col items-center max-w-30 py-4 px-6 gap-2 rounded-xl outline outline-current/20">
            <Icon name="join" />
            <p className="text-sm font-bold">Integración externa</p>
          </button>
        </aside>
      </section>
    </main>
  );
}
